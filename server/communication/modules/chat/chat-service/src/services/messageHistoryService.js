import mongoose from "mongoose";

import { getLogger } from "../utils/logger.js";

import MessageHistory from "../schemas/MessageHistory.js";

import MessageBufferService from "./messageBufferService.js";

const logger = getLogger("MessageHistoryService");

class MessageHistoryService {
  static getSortedUsernames(usernames) {
    return usernames.sort();
  }

  static async addMessage(usernames, message) {
    try {
      const sortedUsernames = this.getSortedUsernames(usernames);
      const cacheKey = sortedUsernames.join("-");
      logger.info(`Adding message. Cache key: ${cacheKey}`);

      const newId = new mongoose.Types.ObjectId();

      const wrappedMessage = {
        _id: newId,
        ...message,
      };

      await MessageBufferService.addToBuffer(sortedUsernames, wrappedMessage);
    } catch (error) {
      logger.error(`Error adding message to buffer: ${error.message}`);
      throw error;
    }
  }

  static async getMessageHistory(usernames) {
    const sortedUsernames = this.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    logger.info(`Fetching message history. Cache key: ${cacheKey}`);

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

    logger.info(
      `Fetched message history from MongoDB for: ${sortedUsernames.join(", ")}`
    );

    if (!messageHistory) {
      return [];
    }

    const messages = messageHistory.messages;
    await MessageBufferService.replaceBuffer(sortedUsernames, messages);
    logger.info(`Message history cached. Cache key: ${cacheKey}`);
    return messages;
  }

  //unread
  static async getUnreadMessagesCount(usernames, requestingUsername) {
    const sortedUsernames = this.getSortedUsernames(usernames);

    const bufferedMessages =
      await MessageBufferService.getMessagesFromBuffer(sortedUsernames);

    const messageHistory = await MessageHistory.findOne({
      usernames: sortedUsernames,
    });
    const dbMessages = messageHistory ? messageHistory.messages : [];

    const allMessages = [...bufferedMessages, ...dbMessages];

    const unreadCount = allMessages.reduce((count, message) => {
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

    let messagesToChange =
      await MessageBufferService.getMessagesFromBuffer(sortedUsernames);

    if (!messagesToChange || messagesToChange.length === 0) {
      logger.info("No messages in buffer. Getting messages from DB.");
      messagesToChange = await this.getMessageHistory(sortedUsernames);
    }

    let updated = false;

    logger.info("Attempting to mark messages as read.");
    for (let i = 0; i < messagesToChange.length; i++) {
      const message = messagesToChange[i];

      if (message.username !== requestingUsername && !message.readAt) {
        message.readAt = new Date();
        updated = true;
      }
    }

    if (updated) {
      await MessageBufferService.replaceBuffer(
        sortedUsernames,
        messagesToChange
      );
      logger.info(`Messages marked as read in buffer. Cache key: ${cacheKey}`);
    } else {
      logger.info(
        `No unread messages found to mark as read. Cache key: ${cacheKey}`
      );
    }

    return messagesToChange;
  }
}

export default MessageHistoryService;
