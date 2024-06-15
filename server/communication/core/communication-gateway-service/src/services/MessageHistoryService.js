// server/communication-gateway-service/src/services/messageHistoryService.js
import axios from "axios";

const CHAT_REPOSITORY_SERVICE_URL = process.env.CHAT_REPOSITORY_SERVICE_URL;

class MessageHistoryService {
  ///////////////messageHistories
  static async getMessageHistory(usernames) {
    const query = usernames
      .map(u => `usernames=${encodeURIComponent(u)}`)
      .join("&");
    const url = `${CHAT_REPOSITORY_SERVICE_URL}/messageHistories/messageHistory?${query}`;
    return await axios.get(url);
  }

  static async addMessageToHistory(usernames, message) {
    const url = `${CHAT_REPOSITORY_SERVICE_URL}/messageHistories/messages/message`;
    return await axios.post(url, {
      usernames,
      message,
    });
  }

  ///////////////unread
  static async getAllUnreadMessageCounts(requestingUsername) {
    const url = `${CHAT_REPOSITORY_SERVICE_URL}/unread/getAll/${requestingUsername}`;
    return await axios.get(url);
  }

  static async getUnreadMessagesCount(usernames, requestingUsername) {
    const url = `${CHAT_REPOSITORY_SERVICE_URL}/unread/${requestingUsername}`;
    return await axios.get(url, { params: { usernames } });
  }

  static async readAllUnreadMessages(requestingUsername, usernames) {
    const url = `${CHAT_REPOSITORY_SERVICE_URL}/unread/markAsRead/${requestingUsername}`;
    return await axios.post(url, { usernames });
  }
}

export default MessageHistoryService;
