// server/communication-gateway-service/src/services/messageHistoryService.js
import axios from "axios";

class MessageHistoryService {
  ///////////////messageHistories
  static async getMessageHistory(usernames) {
    const query = usernames
      .map(u => `usernames=${encodeURIComponent(u)}`)
      .join("&");
    const url = `${process.env.CHAT_REPOSITORY_SERVICE_URL}/messageHistories/messageHistory?${query}`;
    return await axios.get(url);
  }

  static async addMessageToHistory(usernames, message) {
    const url = `${process.env.CHAT_REPOSITORY_SERVICE_URL}/messageHistories/messages/message`;
    return await axios.post(url, {
      usernames,
      message,
    });
  }

  ///////////////unread
  static async getAllUnreadMessageCounts(requestingUsername) {
    const url = `${process.env.CHAT_REPOSITORY_SERVICE_URL}/unread/getAll/${requestingUsername}`;
    return await axios.get(url);
  }

  static async getUnreadMessagesCount(requestingUsername, usernames) {
    console.log("requestingUsername", requestingUsername);

    const url = `${
      process.env.CHAT_REPOSITORY_SERVICE_URL
    }/unread/${requestingUsername}?usernames=${usernames.join(",")}`;

    try {
      const response = await axios.get(url);
      console.log("response.data", response.data);

      return response.data;
    } catch (error) {
      console.error(`Error fetching unread messages count: ${error.message}`);
    }
  }

  static async readAllUnreadMessages(requestingUsername, usernames) {
    const url = `${process.env.CHAT_REPOSITORY_SERVICE_URL}/unread/markAsRead/${requestingUsername}`;
    return await axios.post(url, { usernames });
  }
}

export default MessageHistoryService;
