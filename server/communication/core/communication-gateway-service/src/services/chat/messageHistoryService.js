import axios from "axios";

import { getLogger } from "../../utils/logger.js";
const logger = getLogger("MessageHistoryService");

const chatRepositoryServiceUrl = process.env.CHAT_REPOSITORY_SERVICE_URL;
const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
const serviceName = "communication_gateway_service";

class MessageHistoryService {
  static async getMessageHistory(usernames) {
    const query = usernames
      .map(u => `usernames=${encodeURIComponent(u)}`)
      .join("&");
    const url = `${chatRepositoryServiceUrl}/messageHistories/messageHistory?${query}`;

    logger.info(`Fetching message history for: ${usernames.join(", ")}`);
    return await axios.get(url, {
      headers: {
        [internalServiceHeaderKey]: serviceName,
      },
    });
  }

  static async addMessageToHistory(usernames, message) {
    const url = `${chatRepositoryServiceUrl}/messageHistories/messages/message`;

    logger.info(
      `Adding message to history for: ${usernames.join(
        ", "
      )}. Message: ${message}`
    );
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

  static async getAllUnreadMessageCounts(requestingUsername) {
    const url = `${chatRepositoryServiceUrl}/unread/getAll/${requestingUsername}`;
    logger.info(`Fetching all unread message counts for ${requestingUsername}`);
    return await axios.get(url, {
      headers: {
        [internalServiceHeaderKey]: serviceName,
      },
    });
  }

  static async getUnreadMessagesCount(requestingUsername, usernames) {
    const url = `${chatRepositoryServiceUrl}/unread/${requestingUsername}?usernames=${usernames.join(
      ","
    )}`;

    logger.info(
      `Fetching unread message count for ${requestingUsername} and ${usernames.join(
        ", "
      )}`
    );

    try {
      const response = await axios.get(url, {
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      });
      logger.info("Unread message count response received.");
      return response.data;
    } catch (error) {
      logger.error(`Error fetching unread messages count: ${error.message}`);
    }
  }

  static async readAllUnreadMessages(requestingUsername, usernames) {
    const url = `${chatRepositoryServiceUrl}/unread/markAsRead/${requestingUsername}`;

    logger.info(
      `Marking messages as read for ${requestingUsername} and ${usernames.join(
        ", "
      )}`
    );

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
