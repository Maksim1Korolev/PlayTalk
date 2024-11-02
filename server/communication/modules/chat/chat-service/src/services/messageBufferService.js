import { getLogger } from "../utils/logger.js";

import redisClient from "../utils/redisClient.js";

import MessageHistory from "../schemas/MessageHistory.js";

const logger = getLogger("MessageBufferService");

class MessageBufferService {
  static flushTimer = null;

  static async addToBuffer(usernames, message) {
    const sortedUsernames = usernames.sort();
    const cacheKey = sortedUsernames.join("-");
    const bufferKey = `${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:${cacheKey}`;

    await redisClient.rPush(bufferKey, JSON.stringify(message));

    this.addedMessagesCount++;

    //const threshold = parseInt(process.env.MESSAGE_BUFFER_THRESHOLD) || 10;

    //if (this.addedMessagesCount >= threshold) {
    //  logger.info(
    //    `Buffer size threshold reached for ${cacheKey}. Flushing buffer to database.`
    //  );
    //  await this.flushBufferToDatabase(sortedUsernames);
    //  this.addedMessagesCount = 0;
    //}
  }

  //TODO:Think about flush
  static async addAllToBuffer(usernames, messages) {
    const sortedUsernames = usernames.sort();
    const cacheKey = sortedUsernames.join("-");
    const bufferKey = `${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:${cacheKey}`;

    // Add the updated messages to the buffer
    const messageStrings = messages.map(msg => JSON.stringify(msg));

    await redisClient.rPush(bufferKey, messageStrings);
    //why it's second
    logger.info(`Replaced buffer with updated messages for: ${cacheKey}`);
  }

  static async replaceBuffer(usernames, updatedMessages) {
    const sortedUsernames = usernames.sort();
    const cacheKey = sortedUsernames.join("-");
    const bufferKey = `${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:${cacheKey}`;

    await redisClient.del(bufferKey);
    logger.info(`Cleared existing buffer for: ${cacheKey}`);

    this.addAllToBuffer(usernames, updatedMessages);
  }

  //static async flushBufferToDatabase(usernames, bufferKey) {
  //  const messages = await redisClient.lRange(bufferKey, 0, -1);
  //  if (messages.length < 1) {
  //    logger.warn(`No messages found in buffer: ${bufferKey}`);
  //    return;
  //  }
  //  console.log("Messages from redis:");
  //  console.log(messages);

  //  logger.info(
  //    `Flushing ${messages.length} messages from buffer: ${bufferKey}`
  //  );
  //  const parsedMessages = messages.map(msg => JSON.parse(msg));
  //  console.log("Parsed messages from redis:");
  //  console.log(messages);
  //  const messageHistory = await MessageHistory.findOneAndUpdate(
  //    { usernames },
  //    { $push: { messages: { $each: parsedMessages } } },
  //    { upsert: true }
  //  );

  //  logger.info(
  //    `Message history updated in the database for users: ${usernames.join(
  //      ", "
  //    )}`
  //  );

  //  await redisClient.del(bufferKey);
  //  logger.info(`Buffer cleared. Buffer key: ${bufferKey}`);

  //  const cacheKey = usernames.join("-");
  //  await redisClient.hDel(
  //    process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY,
  //    cacheKey
  //  );
  //  logger.info(`Cache key invalidated: ${cacheKey}`);

  //  return messageHistory;
  //}

  //static async flushToDatabase(usernames) {
  //  const sortedUsernames = usernames.sort();
  //  const cacheKey = `${
  //    process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY
  //  }:${sortedUsernames.join("-")}`;

  //  // Get combined message history from Redis
  //  const messageHistory = await redisClient.lRange(cacheKey, 0, -1);

  //  if (messageHistory.messages < 1) {
  //    logger.warn(`No messages found to flush in Redis for: ${cacheKey}`);
  //  }

  //  logger.info(
  //    `Flushing ${messageHistory.length} messages from Redis for: ${cacheKey}`
  //  );

  //  const parsedMessages = messageHistory.map(msg => JSON.parse(msg));

  //  // Save messages to MongoDB
  //  await MessageHistory.findOneAndUpdate(
  //    { usernames: sortedUsernames },
  //    { $push: { messages: { $each: parsedMessages } } },
  //    { new: true, upsert: true }
  //  );

  //  // Clear Redis cache after flushing
  //  await redisClient.del(cacheKey);
  //  logger.info(`Cleared Redis cache for: ${cacheKey}`);
  //}

  static async flushBufferToDatabase(usernames) {
    const sortedUsernames = usernames.sort();
    const cacheKey = `${
      process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY
    }:${sortedUsernames.join("-")}`;

    // Get combined message history from Redis
    const messageHistory = await redisClient.lRange(cacheKey, 0, -1);
    if (messageHistory.length < 1) {
      logger.warn(`No messages found to flush in Redis for: ${cacheKey}`);
      return;
    }

    logger.info(
      `Flushing ${messageHistory.length} messages from Redis for: ${cacheKey}`
    );

    const parsedMessages = messageHistory.map(msg => JSON.parse(msg));

    // Fetch the existing message history from MongoDB
    let existingMessageHistory = await MessageHistory.findOne({
      usernames: sortedUsernames,
    });

    if (!existingMessageHistory) {
      // If no existing history, create a new entry
      existingMessageHistory = new MessageHistory({
        usernames: sortedUsernames,
        messages: [],
      });
    }

    // Create a map of existing messages for easy lookup by _id

    const existingMessagesMap = new Map(
      existingMessageHistory.messages.map(msg => [msg._id.toString(), msg])
    );

    // Update existing messages or add new ones
    parsedMessages.forEach(parsedMessage => {
      const existingMessage = existingMessagesMap.get(parsedMessage._id);
      if (existingMessage) {
        // Update existing message's properties
        Object.assign(existingMessage, parsedMessage);
      } else {
        // Add new message if not found in existing messages
        existingMessageHistory.messages.push(parsedMessage);
      }
    });

    // Save updated message history to MongoDB
    await existingMessageHistory.save();

    // Clear Redis cache after flushing
    await redisClient.del(cacheKey);
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
    const sortedUsernames = usernames.sort();
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
