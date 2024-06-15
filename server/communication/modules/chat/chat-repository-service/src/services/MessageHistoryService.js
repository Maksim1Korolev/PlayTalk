import redisClient from "../utils/redisClient.js";
import MessageHistory from "../models/MessageHistory.js";

class MessageHistoryService {
  //TODO:Move to .env?
  static MESSAGE_HISTORY_HASH_KEY = "messageHistory";

  static getCacheKey(usernames) {
    const sortedUsernames = usernames.sort().join("-");
    return `${this.MESSAGE_HISTORY_HASH_KEY}:${sortedUsernames}`;
  }

  ///////////////messageHistories
  static async addMessage(usernames, message) {
    const cacheKey = this.getCacheKey(usernames);

    const messageHistory = await MessageHistory.findOne({ usernames });
    if (messageHistory) {
      const updatedMessageHistory = await MessageHistory.findOneAndUpdate(
        { usernames },
        { $push: { messages: message } },
        { new: true }
      );
      await redisClient.hDel(cacheKey, "messages");
      return updatedMessageHistory;
    }

    const addedMessageHistory = await MessageHistory.create({
      usernames,
      messages: [message],
    });
    await redisClient.hDel(cacheKey, "messages");

    return addedMessageHistory;
  }

  static async getMessageHistory(usernames) {
    const cacheKey = this.getCacheKey(usernames);
    const cachedMessageHistory = await redisClient.hGet(cacheKey, "messages");
    console.log("Checking cached MessageHistory:");
    console.log(cachedMessageHistory);
    if (cachedMessageHistory) {
      return JSON.parse(cachedMessageHistory);
    }

    const messageHistory = await MessageHistory.findOne({ usernames });
    if (messageHistory) {
      await redisClient.hSet(
        cacheKey,
        "messages",
        JSON.stringify(messageHistory.messages)
      );
    }

    return messageHistory ? messageHistory.messages : [];
  }

  ///////////////unread
  static async getUnreadMessagesCount(usernames, requestingUsername) {
    const result = await MessageHistory.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          usernames,
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
    const cacheKey = this.getCacheKey(usernames);
    const messageHistory = await MessageHistory.findOne({
      usernames: { $all: usernames },
    });
    if (messageHistory) {
      const messages = messageHistory.messages;
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
        }
      }

      await messageHistory.save();
      await redisClient.hDel(cacheKey, "messages");
      return messageHistory;
    }
  }
}

export default MessageHistoryService;
