import { getLogger } from "../utils/logger.js";

import MessageHistoryService from "../services/chat/messageHistoryService.js";

const logger = getLogger("MessageHistoryController");

// @desc   Get counts of unread messages from all users
// @route  GET /api/unread/getAll
// @access Protected
export const getAllUnreadMessageCounts = async (req, res) => {
  try {
    const { requestingUsername } = req.params;
    logger.info(
      `Fetching unread message counts for user: ${requestingUsername}`
    );

    const { data } =
      await MessageHistoryService.getAllUnreadMessageCounts(requestingUsername);
    return res.status(200).json(data);
  } catch (err) {
    logger.error(`Error retrieving unread message counts: ${err.message}`);
    res.status(500).json({
      message: `Internal server error retrieving UnreadMessageCounts.`,
    });
  }
};

// @desc   Mark all messages as read
// @route  POST /api/unread/markAsRead
// @access Protected
export const readAllUnreadMessages = async (req, res) => {
  try {
    const { requestingUsername } = req.params;
    const { usernames } = req.body;

    logger.info(
      `Marking all unread messages as read for ${requestingUsername} with ${usernames}`
    );

    const { data } = await MessageHistoryService.readAllUnreadMessages(
      requestingUsername,
      usernames
    );

    logger.info(`Unread messages marked as read for ${requestingUsername}`);
    return res.status(200).json(data);
  } catch (err) {
    logger.error(`Error marking unread messages as read: ${err.message}`);
    res.status(500).json({
      message: `Internal server error posting previously unread messages.`,
    });
  }
};
