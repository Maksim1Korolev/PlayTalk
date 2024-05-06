import MessageHistory from "../model/MessageHistory.js";

class MessageHistoryService {
  async addMessage(usernames, message) {
    try {
      const messageHistory = await MessageHistory.findOne({
        usernames: usernames,
      });
      if (messageHistory) {
        const updatedMessageHistory = await MessageHistory.findOneAndUpdate(
          { usernames: usernames },
          {
            $push: { messages: message },
          },
          { new: true }
        );
        return updatedMessageHistory;
      }

      const addedMessageHistory = await MessageHistory.create({
        usernames: usernames,
        messages: [message],
      });

      return addedMessageHistory;
    } catch (error) {
      console.error("Error handling message history:", error);
      throw error;
    }
  }

  async getMessageHistory(usernames) {
    try {
      const messageHistory = await MessageHistory.findOne({
        usernames: usernames,
      });
      return messageHistory.messages || [];
    } catch (error) {
      console.error("Error fetching message history:", error);
      throw error;
    }
  }

  async getUnreadMessagesCount(usernames, requestingUsername) {
    try {
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
    } catch (error) {
      console.error("Error fetching messages Count. Error:", error);
      throw error;
    }
  }

  async getAllUnreadMessagesCount(requestingUsername) {
    try {
      const result = await MessageHistory.aggregate([
        { $match: { usernames: requestingUsername } }, // Filter documents where the array contains the requestingUsername
        { $unwind: "$messages" },
        {
          $match: {
            "messages.username": { $ne: requestingUsername },
            "messages.readAt": { $exists: false },
          },
        },
        {
          $group: {
            _id: "$messages.username", // Group by the sender username
            unreadCount: { $sum: 1 }, // Count unread messages per user
          },
        },
      ]);

      // Convert array to map/object
      const unreadMessageMap = result.reduce((acc, item) => {
        acc[item._id] = item.unreadCount;
        return acc;
      }, {});

      return unreadMessageMap;
    } catch (error) {
      console.error("Error fetching all unread messages count. Error:", error);
      throw error;
    }
  }

  async markAsRead(usernames, requestingUsername) {
    try {
      const result = await MessageHistory.updateMany(
        {
          usernames,
          "messages.username": { $ne: requestingUsername },
          "messages.readAt": { $exists: false },
        },
        { $set: { "messages.$.readAt": new Date() } }
      );
      console.log(result);
      return result;
    } catch (error) {
      console.error("Error To Mark readAt. Error:", error);
      throw error;
    }
  }
}

export default new MessageHistoryService();
