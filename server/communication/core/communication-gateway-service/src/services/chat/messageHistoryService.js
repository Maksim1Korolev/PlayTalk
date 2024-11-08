import axios from "axios";

import { getLogger } from "../../utils/logger.js";

const logger = getLogger("MessageHistoryService");

const chatServiceApiUrl = process.env.CHAT_SERVICE_API_URL;
const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
const serviceName = "communication_gateway_service";

class MessageHistoryService {
  static async getMessageHistory(usernames) {
    const query = usernames
      .map(u => `usernames=${encodeURIComponent(u)}`)
      .join("&");
    const url = `${chatServiceApiUrl}/messageHistories/messageHistory?${query}`;

    logger.info(`Fetching message history for: ${usernames.join(", ")}`);

    const response = await axios.get(url, {
      headers: {
        [internalServiceHeaderKey]: serviceName,
      },
    });

    return response.data.messageHistory || [];
  }

  static async addMessageToHistory(usernames, message) {
    const url = `${chatServiceApiUrl}/messageHistories/messages/message`;

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
    const url = `${chatServiceApiUrl}/unread/getAll/${requestingUsername}`;
    logger.info(`Fetching all unread message counts for ${requestingUsername}`);
    return await axios.get(url, {
      headers: {
        [internalServiceHeaderKey]: serviceName,
      },
    });
  }

  static async getUnreadMessagesCount(requestingUsername, usernames) {
    const url = `${chatServiceApiUrl}/unread/${requestingUsername}?usernames=${usernames.join(
      ","
    )}`;

    logger.info(
      `Fetching unread message count for ${requestingUsername} and ${usernames.join(
        ", "
      )}`
    );

    const response = await axios.get(url, {
      headers: {
        [internalServiceHeaderKey]: serviceName,
      },
    });

    logger.info("Unread message count response received.");
    return response.data || [];
  }

  static async readAllUnreadMessages(requestingUsername, usernames) {
    const url = `${chatServiceApiUrl}/unread/markAsRead/${requestingUsername}`;

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
