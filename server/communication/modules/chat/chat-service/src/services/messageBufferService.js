import { getLogger } from "../utils/logger.js";

import redisClient from "../utils/redisClient.js";

import MessageHistory from "../schemas/MessageHistory.js";

import MessageHistoryService from "./messageHistoryService.js";

const logger = getLogger("MessageBufferService");

class MessageBufferService {
  static flushTimer = null;

  static async addToBuffer(usernames, message) {
    const sortedUsernames = MessageHistoryService.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    const bufferKey = `${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:${cacheKey}`;
    const messageCountKey = `${process.env.REDIS_MESSAGE_COUNT_KEY}:${cacheKey}`;

    const bufferSize = await redisClient.lLen(bufferKey);
    console.log("THIS IS CURRENT BUFFER SIZE:::::: ", bufferSize);

    if (bufferSize !== 0) {
      await redisClient.rPush(bufferKey, JSON.stringify(message));
      logger.info(`Added new message to buffer for: ${cacheKey}`);

      const storedMessageCountStr = await redisClient.get(messageCountKey);
      const storedMessageCount = storedMessageCountStr
        ? parseInt(storedMessageCountStr)
        : 0;

      const newMessagesCount = bufferSize - storedMessageCount;
      logger.info(
        `Buffer size: ${bufferSize}, Stored message count: ${storedMessageCount}, New messages: ${newMessagesCount}`
      );
      const threshold = parseInt(process.env.MESSAGE_BUFFER_THRESHOLD) || 10;

      if (newMessagesCount >= threshold) {
        logger.info(
          `Threshold reached for ${cacheKey}. Flushing buffer to database.`
        );

        await this.flushBufferToDatabase(sortedUsernames);

        await redisClient.set(messageCountKey, bufferSize);
        logger.info(
          `Updated message count for ${cacheKey} after flush: ${bufferSize}`
        );
      }
    } else {
      await this.loadMongoToBuffer(sortedUsernames);
      await redisClient.rPush(bufferKey, JSON.stringify(message));
      logger.info(`Added new message to buffer for: ${cacheKey}`);
    }
  }

  static async loadMongoToBuffer(usernames) {
    const sortedUsernames = MessageHistoryService.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    const messageCountKey = `${process.env.REDIS_MESSAGE_COUNT_KEY}:${cacheKey}`;

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
    await this.replaceBuffer(sortedUsernames, messages);
    logger.info(`Message history cached. Cache key: ${cacheKey}`);

    const totalMessages = messages.length;
    await redisClient.set(messageCountKey, totalMessages);
    logger.info(`Updated message count for ${cacheKey}: ${totalMessages}`);

    return messages;
  }

  static async replaceBuffer(usernames, updatedMessages) {
    const sortedUsernames = MessageHistoryService.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    const bufferKey = `${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:${cacheKey}`;

    await redisClient.del(bufferKey);
    logger.info(`Cleared existing buffer for: ${cacheKey}`);

    const messageStrings = updatedMessages.map(msg => JSON.stringify(msg));
    await redisClient.rPush(bufferKey, messageStrings);
    logger.info(`Replaced buffer with updated messages for: ${cacheKey}`);
  }

  static async flushBufferToDatabase(usernames) {
    const sortedUsernames = MessageHistoryService.getSortedUsernames(usernames);
    const cacheKey = `${
      process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY
    }:${sortedUsernames.join("-")}`;
    const messageCountKey = `${process.env.REDIS_MESSAGE_COUNT_KEY}:${cacheKey}`;

    const messageHistory = await redisClient.lRange(cacheKey, 0, -1);
    if (messageHistory.length < 1) {
      logger.warn(`No messages found to flush in Redis for: ${cacheKey}`);
      return;
    }

    logger.info(
      `Flushing ${messageHistory.length} messages from Redis for: ${cacheKey}`
    );

    const parsedMessages = messageHistory.map(msg => JSON.parse(msg));

    let existingMessageHistory = await MessageHistory.findOne({
      usernames: sortedUsernames,
    });

    if (!existingMessageHistory) {
      existingMessageHistory = new MessageHistory({
        usernames: sortedUsernames,
        messages: [],
      });
    }

    const existingMessagesMap = new Map(
      existingMessageHistory.messages.map(msg => [msg._id.toString(), msg])
    );

    parsedMessages.forEach(parsedMessage => {
      const existingMessage = existingMessagesMap.get(parsedMessage._id);
      if (existingMessage) {
        Object.assign(existingMessage, parsedMessage);
      } else {
        existingMessageHistory.messages.push(parsedMessage);
      }
    });

    await existingMessageHistory.save();

    await redisClient.del(cacheKey);
    await redisClient.del(messageCountKey);
    logger.info(`Cleared Redis cache for: ${cacheKey}`);
  }

  static async flushAllBuffers() {
    const keys = await redisClient.keys(
      `${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:*`
    );

    let buffersFlushed = false;

    for (const bufferKey of keys) {
      const usernames = bufferKey
        .replace(`${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:`, "")
        .split("-");
      const messages = await redisClient.lRange(bufferKey, 0, -1);

      if (messages.length > 0) {
        buffersFlushed = true;
        await this.flushBufferToDatabase(usernames);
      }
    }

    return buffersFlushed;
  }

  static async subscribeToPeriodicFlush() {
    if (this.flushTimer) {
      logger.info("Periodic flush timer is already running.");
      return;
    }

    const MESSAGE_BUFFER_FLUSH_INTERVAL =
      parseInt(process.env.MESSAGE_BUFFER_FLUSH_INTERVAL) || 60000;

    this.flushTimer = setInterval(async () => {
      const flushed = await this.flushAllBuffers();
      if (flushed) {
        logger.info("Periodic buffer flush executed.");
      }
    }, MESSAGE_BUFFER_FLUSH_INTERVAL);

    logger.info(
      `Started periodic buffer flush with interval: ${MESSAGE_BUFFER_FLUSH_INTERVAL}ms`
    );
  }

  static async getMessagesFromBuffer(usernames) {
    const sortedUsernames = MessageHistoryService.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    const bufferKey = `${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:${cacheKey}`;

    const messages = await redisClient.lRange(bufferKey, 0, -1);

    if (messages.length > 0) {
      logger.info(
        `Fetched ${messages.length} messages from buffer: ${bufferKey}`
      );
      return messages.map(msg => JSON.parse(msg));
    } else {
      logger.info(`No messages found in buffer: ${bufferKey}`);
      return [];
    }
  }
}

export default MessageBufferService;
