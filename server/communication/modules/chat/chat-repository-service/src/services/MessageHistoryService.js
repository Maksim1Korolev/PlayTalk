import redisClient from "../utils/redisClient.js";
import MessageHistory from "../models/MessageHistory.js";

class MessageHistoryService {
  static getSortedUsernames(usernames) {
    return usernames.sort();
  }

  ///////////////messageHistories
  static async addMessage(usernames, message) {
    const sortedUsernames = this.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    console.log(`Adding message. Cache key: ${cacheKey}`);

    const messageHistory = await MessageHistory.findOne({
      usernames: sortedUsernames,
    });
    if (messageHistory) {
      const updatedMessageHistory = await MessageHistory.findOneAndUpdate(
        { usernames: sortedUsernames },
        { $push: { messages: message } },
        { new: true }
      );
      await redisClient.hDel(
        process.env.REDIS_MESSAGE_HISTORY_HASH_KEY,
        cacheKey
      );
      console.log(
        `Updated message history. Cache key invalidated: ${cacheKey}`
      );
      return updatedMessageHistory;
    }

    const addedMessageHistory = await MessageHistory.create({
      usernames: sortedUsernames,
      messages: [message],
    });
    await redisClient.hDel(
      process.env.REDIS_MESSAGE_HISTORY_HASH_KEY,
      cacheKey
    );
    console.log(`Added message history. Cache key invalidated: ${cacheKey}`);

    return addedMessageHistory;
  }

  static async getMessageHistory(usernames) {
    const sortedUsernames = this.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    console.log(`Fetching message history. Cache key: ${cacheKey}`);

    const cachedMessageHistory = await redisClient.hGet(
      process.env.REDIS_MESSAGE_HISTORY_HASH_KEY,
      cacheKey
    );
    if (cachedMessageHistory) {
      console.log("Cache hit. Returning cached message history.");
      return JSON.parse(cachedMessageHistory);
    } else {
      console.log("Cache miss. No cached message history found.");
    }

    const messageHistory = await MessageHistory.findOne({
      usernames: sortedUsernames,
    });
    if (messageHistory) {
      await redisClient.hSet(
        process.env.REDIS_MESSAGE_HISTORY_HASH_KEY,
        cacheKey,
        JSON.stringify(messageHistory.messages)
      );
      console.log(`Message history cached. Cache key: ${cacheKey}`);
    }

    return messageHistory ? messageHistory.messages : [];
  }

  ///////////////unread
  static async getUnreadMessagesCount(usernames, requestingUsername) {
    const sortedUsernames = this.getSortedUsernames(usernames);
    const result = await MessageHistory.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          usernames: sortedUsernames,
          "messages.username": { $ne: requestingUsername },
          "messages.readAt": { $exists: false },
        },
      },
      { $count: "unreadCount" },
    ]);

    return result.length > 0 ? result[0].unreadCount : 0;
  }

  static async getAllUnreadMessagesCount(requestingUsername) {
    const result = await MessageHistory.aggregate([
      { $match: { usernames: requestingUsername } },
      { $unwind: "$messages" },
      {
        $match: {
          "messages.username": { $ne: requestingUsername },
          "messages.readAt": { $exists: false },
        },
      },
      {
        $group: {
          _id: "$messages.username",
          unreadCount: { $sum: 1 },
        },
      },
    ]);

    const unreadMessageMap = result.reduce((acc, item) => {
      acc[item._id] = item.unreadCount;
      return acc;
    }, {});

    return unreadMessageMap;
  }

  static async markAsRead(usernames, requestingUsername) {
    const sortedUsernames = this.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    console.log(`Marking messages as read. Cache key: ${cacheKey}`);

    const messageHistory = await MessageHistory.findOne({
      usernames: { $all: sortedUsernames },
    });
    if (messageHistory) {
      const messages = messageHistory.messages;
      let updated = false;
      for (let i = 0; i < messages.length; i++) {
        if (!messages[i].message) {
          console.warn(
            `Skipping message ${i} because it has no message field.`
          );
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
        await messageHistory.save();
        await redisClient.hDel(
          process.env.REDIS_MESSAGE_HISTORY_HASH_KEY,
          cacheKey
        );
        console.log(
          `Messages marked as read. Cache key invalidated: ${cacheKey}`
        );
      } else {
        console.log(
          `No messages to mark as read. Cache key not invalidated: ${cacheKey}`
        );
      }
      return messageHistory;
    }
  }
}

export default MessageHistoryService;
