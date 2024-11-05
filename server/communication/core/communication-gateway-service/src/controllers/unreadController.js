import { getLogger } from "../utils/logger.js";

import MessageHistoryService from "../services/chat/messageHistoryService.js";

const logger = getLogger("MessageHistoryController");

// @desc   Get counts of unread messages from all users
// @route  GET /api/unread/getAll
// @access Protected
export const getAllUnreadMessageCounts = async (req, res) => {
  try {
    const requestingUsername = req.user.username;
    logger.info(
      `Fetching unread message counts for user: ${requestingUsername}`
    );

    const { data } =
      await MessageHistoryService.getAllUnreadMessageCounts(requestingUsername);
    return res.status(200).json(data);
  } catch (err) {
    logger.error(`Error retrieving unread message counts: ${err.message}`);
    res.status(500).json({
      message: `Internal server error retrieving unread message counts.`,
    });
  }
};

// @desc   Mark all messages as read between current user and recipient
// @route  POST /api/unread/markAsRead/:recipientUsername
// @access Protected
export const readAllUnreadMessages = async (req, res) => {
  try {
    const requestingUsername = req.user.username;
    const { recipientUsername } = req.params;

    const usernames = Array.from(
      new Set([requestingUsername, recipientUsername])
    );

    logger.info(
      `Marking all unread messages as read between ${requestingUsername} and ${recipientUsername}`
    );

    const { data } = await MessageHistoryService.readAllUnreadMessages(
      requestingUsername,
      usernames
    );

    logger.info(
      `Unread messages marked as read between ${requestingUsername} and ${recipientUsername}`
    );
    return res.status(200).json(data);
  } catch (err) {
    logger.error(`Error marking unread messages as read: ${err.message}`);
    res.status(500).json({
      message: `Internal server error marking unread messages as read.`,
    });
  }
};
