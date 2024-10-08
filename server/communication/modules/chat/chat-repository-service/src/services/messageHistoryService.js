import { ObjectId } from "mongodb";
import MessageHistory from "../schemas/MessageHistory.js";
import { getLogger } from "../utils/logger.js";
import redisClient from "../utils/redisClient.js";
import MessageBufferService from "./messageBufferService.js";
const logger = getLogger("MessageHistoryService");

class MessageHistoryService {
  static getSortedUsernames(usernames) {
    return usernames.sort();
  }

  ///////////////messageHistories
  static async addMessage(usernames, message) {
    const sortedUsernames = this.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    logger.info(`Adding message. Cache key: ${cacheKey}`);

    const wrappedMessage = {
      _id: new ObjectId(),
      ...message,
    };

    await MessageBufferService.addToBuffer(sortedUsernames, wrappedMessage);
  }

  static async getMessageHistory(usernames) {
    const sortedUsernames = this.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    logger.info(`Fetching message history. Cache key: ${cacheKey}`);

    const cachedMessageHistory = await redisClient.hGet(
      process.env.REDIS_MESSAGE_HISTORY_KEY,
      cacheKey
    );

    const messagesFromBuffer = await MessageBufferService.getMessagesFromBuffer(
      sortedUsernames
    );

    let combinedMessages = [];

    if (cachedMessageHistory) {
      logger.info("Cache hit. Getting cached message history.");

      combinedMessages = JSON.parse(cachedMessageHistory);

      if (messagesFromBuffer.length > 0) {
        logger.info("Adding messages from buffer to cached message history.");
        combinedMessages = combinedMessages.concat(messagesFromBuffer);
      }

      return combinedMessages;
    } else {
      logger.info("Cache miss. No cached message history found.");
    }

    const messageHistory = await MessageHistory.findOne({
      usernames: sortedUsernames,
    });

    if (messageHistory) {
      combinedMessages = messageHistory.messages;

      if (messagesFromBuffer.length > 0) {
        logger.info("Adding messages from buffer to database message history.");
        combinedMessages = combinedMessages.concat(messagesFromBuffer);
      }

      await redisClient.hSet(
        process.env.REDIS_MESSAGE_HISTORY_KEY,
        cacheKey,
        JSON.stringify(combinedMessages)
      );
      logger.info(`Message history cached. Cache key: ${cacheKey}`);
    } else if (messagesFromBuffer.length > 0) {
      logger.info("Buffer cache hit. Returning messages from buffer.");
      combinedMessages = messagesFromBuffer;
    }

    return combinedMessages;
  }

  ///////////////unread
  static async getUnreadMessagesCount(usernames, requestingUsername) {
    const sortedUsernames = this.getSortedUsernames(usernames);

    const combinedMessages = await this.getMessageHistory(sortedUsernames);

    const unreadCount = combinedMessages.reduce((count, message) => {
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

  static async markAsRead(usernames, requestingUsername) {
    const sortedUsernames = this.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    logger.info(`Marking messages as read. Cache key: ${cacheKey}`);

    const bufferedMessages = await MessageBufferService.getMessagesFromBuffer(
      sortedUsernames
    );

    const messageHistory = await MessageHistory.findOne({
      usernames: { $all: sortedUsernames },
    });

    const messages = messageHistory?.messages.concat(bufferedMessages);

    let updated = false;

    for (let i = 0; i < messages.length; i++) {
      if (!messages[i].message) {
        logger.warn(`Skipping message ${i} because it has no message field.`);
        continue;
      }
      if (
        messages[i].username !== requestingUsername &&
        messages[i].readAt === undefined
      ) {
        messages[i].readAt = new Date();
        updated = true;
      }
    }

    if (updated) {
      messageHistory.messages = messages;
      await messageHistory.save();
      await redisClient.hDel(
        process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY,
        cacheKey
      );
      logger.info(
        `Messages marked as read in DB. Cache key invalidated: ${cacheKey}`
      );
    } else {
      logger.info(
        `No messages to mark as read in DB. Cache key not invalidated: ${cacheKey}`
      );
    }

    return messageHistory;
  }
}

export default MessageHistoryService;
