import MessageHistory from "../models/MessageHistory.js";

class MessageHistoryService {
  async addMessage(usernames, message) {
    const messageHistory = await MessageHistory.findOne({ usernames });
    if (messageHistory) {
      const updatedMessageHistory = await MessageHistory.findOneAndUpdate(
        { usernames },
        { $push: { messages: message } },
        { new: true }
      );
      return updatedMessageHistory;
    }

    const addedMessageHistory = await MessageHistory.create({
      usernames,
      messages: [message],
    });

    return addedMessageHistory;
  }

  async getMessageHistory(usernames) {
    const messageHistory = await MessageHistory.findOne({ usernames });
    return messageHistory.messages || [];
  }

  async getUnreadMessagesCount(usernames, requestingUsername) {
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

  async getAllUnreadMessagesCount(requestingUsername) {
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

  async markAsRead(usernames, requestingUsername) {
    const messageHistory = await MessageHistory.findOne({
      usernames: { $all: usernames },
    });
    console.log("messageHistory:", messageHistory);
    if (messageHistory) {
      const messages = messageHistory.messages;
      console.log("messages:", messages);
      for (let i = 0; i < messages.length; i++) {
        if (!messages[i].message) {
          console.warn(
            `Skipping message ${i} because it has no message field.`
          );
          continue;
        }
        console.log("messages[i].username:", messages[i].username);
        console.log("requestingUsername:", requestingUsername);
        if (
          messages[i].username !== requestingUsername &&
          messages[i].readAt === undefined
        ) {
          console.log("Marking message as read");
          messages[i].readAt = new Date();
        }
      }

      await messageHistory.save();
      return messageHistory;
    }
  }
}

export default new MessageHistoryService();
