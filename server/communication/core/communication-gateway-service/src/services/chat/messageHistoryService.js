import axios from "axios";

const chatRepositoryServiceUrl = process.env.CHAT_REPOSITORY_SERVICE_URL;
const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
const serviceName = "communication_gateway_service";

class MessageHistoryService {
  ///////////////messageHistories
  static async getMessageHistory(usernames) {
    const query = usernames
      .map(u => `usernames=${encodeURIComponent(u)}`)
      .join("&");
    const url = `${chatRepositoryServiceUrl}/messageHistories/messageHistory?${query}`;

    return await axios.get(url, {
      headers: {
        [internalServiceHeaderKey]: serviceName,
      },
    });
  }

  static async addMessageToHistory(usernames, message) {
    const url = `${chatRepositoryServiceUrl}/messageHistories/messages/message`;

    return await axios.post(
      url,
      {
        usernames,
        message,
      },
      {
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      }
    );
  }

  ///////////////unread
  static async getAllUnreadMessageCounts(requestingUsername) {
    const url = `${chatRepositoryServiceUrl}/unread/getAll/${requestingUsername}`;

    return await axios.get(url, {
      headers: {
        [internalServiceHeaderKey]: serviceName,
      },
    });
  }

  static async getUnreadMessagesCount(requestingUsername, usernames) {
    console.log("requestingUsername", requestingUsername);

    const url = `${chatRepositoryServiceUrl}/unread/${requestingUsername}?usernames=${usernames.join(
      ","
    )}`;

    try {
      const response = await axios.get(url, {
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      });
      console.log("response.data", response.data);

      return response.data;
    } catch (error) {
      console.error(`Error fetching unread messages count: ${error.message}`);
    }
  }

  static async readAllUnreadMessages(requestingUsername, usernames) {
    console.log(
      "sending request to chat-repository-service to mark messages as read"
    );

    const url = `${chatRepositoryServiceUrl}/unread/markAsRead/${requestingUsername}`;

    return await axios.post(
      url,
      { usernames },
      {
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      }
    );
  }
}

export default MessageHistoryService;
