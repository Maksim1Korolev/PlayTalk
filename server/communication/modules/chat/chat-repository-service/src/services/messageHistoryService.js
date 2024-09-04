import redisClient from "../utils/redisClient.js";
import MessageBufferSync from "../sync/messageBufferSync.js";
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

    await MessageBufferSync.addToBuffer(sortedUsernames, message);

    //TODO:Remove redis del
    await redisClient.hDel(process.env.REDIS_MESSAGE_HISTORY_KEY, cacheKey);
    console.log(`Cache key invalidated: ${cacheKey}`);
  }

  static async getMessageHistory(usernames) {
    const sortedUsernames = this.getSortedUsernames(usernames);
    const cacheKey = sortedUsernames.join("-");
    console.log(`Fetching message history. Cache key: ${cacheKey}`);

    const cachedMessageHistory = await redisClient.hGet(
      process.env.REDIS_MESSAGE_HISTORY_KEY,
      cacheKey
    );

    const messagesFromBuffer = await MessageBufferSync.getMessagesFromBuffer(
      sortedUsernames
    );

    let combinedMessages = [];

    if (cachedMessageHistory) {
      console.log("Cache hit. Getting cached message history.");

      combinedMessages = JSON.parse(cachedMessageHistory);

      if (messagesFromBuffer.length > 0) {
        console.log("Adding messages from buffer to cached message history.");
        combinedMessages = combinedMessages.concat(messagesFromBuffer);
      }

      return combinedMessages;
    } else {
      console.log("Cache miss. No cached message history found.");
    }

    const messageHistory = await MessageHistory.findOne({
      usernames: sortedUsernames,
    });

    if (messageHistory) {
      combinedMessages = messageHistory.messages;

      if (messagesFromBuffer.length > 0) {
        console.log("Adding messages from buffer to database message history.");
        combinedMessages = combinedMessages.concat(messagesFromBuffer);
      }

      await redisClient.hSet(
        process.env.REDIS_MESSAGE_HISTORY_KEY,
        cacheKey,
        JSON.stringify(combinedMessages)
      );
      console.log(`Message history cached. Cache key: ${cacheKey}`);
    } else if (messagesFromBuffer.length > 0) {
      console.log("Buffer cache hit. Returning messages from buffer.");
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

  // static async markAsRead(usernames, requestingUsername) {
  //   const sortedUsernames = this.getSortedUsernames(usernames);
  //   const cacheKey = sortedUsernames.join("-");
  //   console.log(`Marking messages as read. Cache key: ${cacheKey}`);

  //   const combinedMessages = await this.getMessageHistory(sortedUsernames);

  //   if (!combinedMessages || combinedMessages.length === 0) {
  //     console.log("No messages found to mark as read.");
  //     return;
  //   }

  //   let updated = false;

  //   combinedMessages.forEach(message => {
  //     if (message.username !== requestingUsername && !message.readAt) {
  //       message.readAt = new Date();
  //       updated = true;
  //     }
  //   });

  //   if (updated) {
  //     await MessageHistory.updateOne(
  //       { usernames: { $all: sortedUsernames } },
  //       { $set: { messages: combinedMessages } }
  //     );

  //     await MessageBufferSync.deleteBuffer(sortedUsernames);
  //     await redisClient.hDel(process.env.REDIS_MESSAGE_HISTORY_KEY, cacheKey);
  //     console.log(
  //       `Messages marked as read. Cache key invalidated: ${cacheKey}`
  //     );
  //   } else {
  //     console.log(
  //       `No messages to mark as read. Cache key not invalidated: ${cacheKey}`
  //     );
  //   }

  //   return combinedMessages;
  // }
}

export default MessageHistoryService;
