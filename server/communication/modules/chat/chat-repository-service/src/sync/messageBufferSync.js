import redisClient from "../utils/redisClient.js";
import MessageHistory from "../models/MessageHistory.js";

class MessageBufferSync {
  static async addToBuffer(usernames, message) {
    const sortedUsernames = usernames.sort();
    const cacheKey = sortedUsernames.join("-");
    const bufferKey = `${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:${cacheKey}`;

    await redisClient.rPush(bufferKey, JSON.stringify(message));
    console.log(`Message added to buffer. Buffer key: ${bufferKey}`);

    const bufferSize = await redisClient.lLen(bufferKey);
    console.log(`Current buffer size for ${bufferKey}: ${bufferSize}`);

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
    console.log(
      `Flushing ${messages.length} messages from buffer: ${bufferKey}`
    );

    if (messages.length > 0) {
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

      return messageHistory;
    } else {
      console.log(`No messages found in buffer: ${bufferKey}`);
    }
  }

  static async flushAllBuffers() {
    const keys = await redisClient.keys(
      `${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:*`
    );
    console.log(`Found ${keys.length} buffers to flush.`);

    for (const bufferKey of keys) {
      const usernames = bufferKey
        .replace(`${process.env.REDIS_MESSAGE_HISTORY_BUFFER_KEY}:`, "")
        .split("-");
      console.log(`Flushing buffer for users: ${usernames.join(", ")}`);
      await this.flushBufferToDatabase(usernames, bufferKey);
    }
  }
}

setInterval(async () => {
  console.log("Periodic buffer flush started.");
  await MessageBufferSync.flushAllBuffers();
  console.log("Periodic buffer flush completed.");
}, 180000);

export default MessageBufferSync;
