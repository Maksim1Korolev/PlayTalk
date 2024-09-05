import redisClient from "../utils/redisClient.js";
import MessageHistory from "../models/MessageHistory.js";

class MessageBufferSync {
  static async addToBuffer(usernames, message) {
    const sortedUsernames = usernames.sort();
    const cacheKey = sortedUsernames.join("-");
    const bufferKey = `${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:${cacheKey}`;

    await redisClient.rPush(bufferKey, JSON.stringify(message));

    const bufferSize = await redisClient.lLen(bufferKey);
    const threshold = parseInt(process.env.MESSAGE_BUFFER_THRESHOLD) || 10;

    if (bufferSize >= threshold) {
      console.log(
        `Buffer size threshold reached. Flushing buffer to database.`
      );
      await this.flushBufferToDatabase(sortedUsernames, bufferKey);
    }
  }

  static async flushBufferToDatabase(usernames, bufferKey) {
    const messages = await redisClient.lRange(bufferKey, 0, -1);
    if (messages.length > 0) {
      console.log(
        `Flushing ${messages.length} messages from buffer: ${bufferKey}`
      );
      const parsedMessages = messages.map(msg => JSON.parse(msg));

      const messageHistory = await MessageHistory.findOneAndUpdate(
        { usernames },
        { $push: { messages: { $each: parsedMessages } } },
        { new: true, upsert: true }
      );

      console.log(
        `Message history updated in the database for users: ${usernames.join(
          ", "
        )}`
      );

      await redisClient.del(bufferKey);
      console.log(`Buffer cleared. Buffer key: ${bufferKey}`);

      const cacheKey = usernames.join("-");
      await redisClient.hDel(process.env.REDIS_MESSAGE_HISTORY_KEY, cacheKey);
      console.log(`Cache key invalidated: ${cacheKey}`);

      return messageHistory;
    } else {
      console.log(`No messages found in buffer: ${bufferKey}`);
    }
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
        await this.flushBufferToDatabase(usernames, bufferKey);
      }
    }

    return buffersFlushed;
  }

  static async subscribeToPeriodicFlush() {
    const MESSAGE_BUFFER_FLUSH_INTERVAL =
      parseInt(process.env.MESSAGE_BUFFER_FLUSH_INTERVAL) || 60000;

    setInterval(async () => {
      const flushed = await this.flushAllBuffers();
      if (flushed) {
        console.log("Periodic buffer flush executed.");
      }
    }, MESSAGE_BUFFER_FLUSH_INTERVAL);
  }

  static async getMessagesFromBuffer(usernames) {
    const sortedUsernames = usernames.sort();
    const cacheKey = sortedUsernames.join("-");
    const bufferKey = `${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:${cacheKey}`;

    const messages = await redisClient.lRange(bufferKey, 0, -1);

    if (messages.length > 0) {
      console.log(
        `Fetched ${messages.length} messages from buffer: ${bufferKey}`
      );
      return messages.map(msg => JSON.parse(msg));
    } else {
      console.log(`No messages found in buffer: ${bufferKey}`);
      return [];
    }
  }

  static async markMessagesAsReadInBuffer(usernames, requestingUsername) {
    const sortedUsernames = usernames.sort();
    const cacheKey = sortedUsernames.join("-");
    const bufferKey = `${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:${cacheKey}`;

    const messages = await redisClient.lRange(bufferKey, 0, -1);

    if (messages.length > 0) {
      const updatedMessages = messages.map(msg => {
        const parsedMessage = JSON.parse(msg);
        if (
          parsedMessage.username !== requestingUsername &&
          !parsedMessage.readAt
        ) {
          parsedMessage.readAt = new Date();
        }
        return JSON.stringify(parsedMessage);
      });

      await redisClient.del(bufferKey);
      await redisClient.rPush(bufferKey, ...updatedMessages);

      console.log(`Marked messages as read in buffer: ${bufferKey}`);
    }
  }
}

export default MessageBufferSync;
