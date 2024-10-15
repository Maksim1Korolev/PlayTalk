import mongoose from "mongoose";
import MessageHistory from "../schemas/MessageHistory.js";
import { getLogger } from "../utils/logger.js";
import MessageBufferService from "./messageBufferService.js";
const logger = getLogger("MessageHistoryService");

class MessageHistoryService {
  static getSortedUsernames(usernames) {
    return usernames.sort();
  }

  //the problem with id!!!!!!!!?
  static async addMessage(usernames, message) {
    const sortedUsernames = this.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    logger.info(`Adding message. Cache key: ${cacheKey}`);

    var newId = new mongoose.mongo.ObjectId();
    console.log(newId);

    const wrappedMessage = {
      _id: newId,
      ...message,
    };

    await MessageBufferService.addToBuffer(sortedUsernames, wrappedMessage);
  }

  // Maybe the problem in async requests
  static async getMessageHistory(usernames) {
    const sortedUsernames = this.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    logger.info(`Fetching message history. Cache key: ${cacheKey}`);
    //TODO: Rename?
    const bufferedMessageHistory =
      await MessageBufferService.getMessagesFromBuffer(sortedUsernames);

    if (bufferedMessageHistory?.length > 0) {
      logger.info("Cache hit. Getting cached message history.");

      return bufferedMessageHistory;
    }

    logger.info("Cache miss. No cached message history found.");

    const messageHistory = await MessageHistory.findOne({
      usernames: sortedUsernames,
    });

    logger.info(`Get message history of ${usernames} from Mongo`);

    if (messageHistory) {
      const messages = messageHistory.messages;

      await MessageBufferService.replaceBuffer(sortedUsernames, messages);
      logger.info(`Message history cached. Cache key: ${cacheKey}`);
    }

    return messageHistory.messages;
  }

  //unread
  static async getUnreadMessagesCount(usernames, requestingUsername) {
    const sortedUsernames = this.getSortedUsernames(usernames);

    const messages = await this.getMessageHistory(sortedUsernames);

    const unreadCount = messages.reduce((count, message) => {
      if (message.username !== requestingUsername && !message.readAt) {
        return count + 1;
      }
      return count;
    }, 0);

    return unreadCount;
  }

  static async getAllUnreadMessagesCount(requestingUsername) {
    const messageHistories = await MessageHistory.find({
      usernames: requestingUsername,
    });

    const unreadMessageMap = {};

    for (const messageHistory of messageHistories) {
      const combinedMessages = await this.getMessageHistory(
        messageHistory.usernames
      );

      const unreadCount = combinedMessages.reduce((count, message) => {
        if (message.username !== requestingUsername && !message.readAt) {
          return count + 1;
        }
        return count;
      }, 0);

      const otherUser = messageHistory.usernames.find(
        username => username !== requestingUsername
      );

      if (otherUser) {
        unreadMessageMap[otherUser] = unreadCount;
      }
    }

    return unreadMessageMap;
  }

  //maybe the problem in async
  static async markAsRead(usernames, requestingUsername) {
    const sortedUsernames = this.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    logger.info(`Marking messages as read. Cache key: ${cacheKey}`);
    let messagesToChange = [];

    logger.info("Get messages from buffer to mark as read");
    const bufferedMessages = await MessageBufferService.getMessagesFromBuffer(
      sortedUsernames
    );

    if (bufferedMessages?.length > 0) {
      messagesToChange = bufferedMessages;
    } else {
      logger.info("No messages in buffer. Get messages from DB");
      const messageHistory = this.getMessageHistory(sortedUsernames);
      messagesToChange = messageHistory.messages;
    }

    let updated = false;

    logger.info("Trying to find messages to mark as read");
    for (let i = 0; i < messagesToChange.length; i++) {
      if (!messagesToChange[i].message) {
        logger.warn(`Skipping message ${i} because it has no message field.`);
        continue;
      }

      if (
        messagesToChange[i].username !== requestingUsername &&
        messagesToChange[i].readAt === undefined
      ) {
        messagesToChange[i].readAt = new Date();
        updated = true;
      }
    }

    if (updated) {
      await MessageBufferService.replaceBuffer(usernames, messagesToChange);
      logger.info(
        `Messages marked as read in DB. Cache key invalidated: ${cacheKey}`
      );
    } else {
      logger.info(
        `No messages to mark as read in DB. Cache key not invalidated: ${cacheKey}`
      );
    }

    return messagesToChange;
  }
}

export default MessageHistoryService;
