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

  static async setMessage(usernames, message) {
    const url = `${CHAT_REPOSITORY_SERVICE_URL}/messageHistories/messages/message`;
    return await axios.post(url, {
      usernames,
      message,
    });
  }

  ///////////////unread
  static async getAllUnreadMessageCounts(requestingUsername) {
    const url = `${CHAT_REPOSITORY_SERVICE_URL}/unread/all/${requestingUsername}`;
    return await axios.get(url);
  }

  static async getUnreadMessagesCount(usernames, requestingUsername) {
    const url = `${CHAT_REPOSITORY_SERVICE_URL}/unread/${requestingUsername}`;
    return await axios.get(url, { params: { usernames } });
  }

  static async readAllUnreadMessage(requestingUsername, usernames) {
    const url = `${CHAT_REPOSITORY_SERVICE_URL}/unread/markAsRead/${requestingUsername}`;
    return await axios.post(url, { usernames });
  }

  ///////////////move
  static async postUser(addedUserUsername, addedUserSocketId) {
    const url = `${CHAT_REPOSITORY_SERVICE_URL}/messageHistories/addToChatLobby`;
    return await axios.post(url, {
      addedUserUsername,
      addedUserSocketId,
    });
  }

  static async deleteUser(socketId) {
    const url = `${CHAT_REPOSITORY_SERVICE_URL}/messageHistories/${socketId}`;
    return await axios.delete(url);
  }
}

export default MessageHistoryService;
