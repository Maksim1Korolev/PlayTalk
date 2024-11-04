import asyncHandler from "express-async-handler";

import { getLogger } from "../utils/logger.js";

import MessageHistoryService from "../services/messageHistoryService.js";

const logger = getLogger("UnreadController");

// @desc   Get unread Messages count for specific chats
// @route  GET api/unread/:requestingUsername
// @access Internal
export const getUnreadMessageCount = asyncHandler(async (req, res) => {
  try {
    const { requestingUsername } = req.params;
    const { usernames } = req.query;

    if (!requestingUsername) {
      logger.warn(
        "Requesting username missing in unread message count request"
      );
      return res.status(400).json({ message: "Username is required." });
    }
    if (!usernames) {
      logger.warn("Usernames missing in unread message count request");
      return res
        .status(400)
        .json({ message: "Usernames of MessageHistory are required." });
    }

    const usernamesArray = Array.isArray(usernames)
      ? usernames
      : usernames.split(",");

    logger.info(
      `Fetching unread message count for ${requestingUsername} and ${usernamesArray.join(
        ", "
      )}`
    );

    const count = await MessageHistoryService.getUnreadMessagesCount(
      usernamesArray,
      requestingUsername
    );

    return res.json(count);
  } catch (err) {
    logger.error(`Error getting unread message count: ${err.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
});

// @desc   Mark messages as read
// @route  POST api/unread/markAsRead/:requestingUsername
// @access Internal
export const markAsRead = asyncHandler(async (req, res) => {
  try {
    const { requestingUsername } = req.params;
    const { usernames } = req.body;

    if (!requestingUsername) {
      logger.warn("Requesting username missing in markAsRead request");
      return res.status(400).json({ message: "Username is required." });
    }

    if (!usernames) {
      logger.warn("Usernames missing in markAsRead request");
      return res
        .status(401)
        .json({ message: "Usernames of MessageHistory are required." });
    }

    logger.info(
      `Marking messages as read for ${requestingUsername} and ${usernames.join(
        ", "
      )}`
    );

    const result = await MessageHistoryService.markAsRead(
      usernames,
      requestingUsername
    );
    if (result) {
      res.status(200).json({ message: "Messages marked as read." });
    } else {
      res.status(404).json({ message: "Messages not found." });
    }
  } catch (err) {
    logger.error(`Error marking messages as read: ${err.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
});

// @desc   Get all unread messages count for a specific user
// @route  GET api/unread/getAll/:requestingUsername
// @access Internal
export const getAllUnreadMessageCount = asyncHandler(async (req, res) => {
  try {
    const { requestingUsername } = req.params;

    if (!requestingUsername) {
      logger.warn(
        "Requesting username missing in getAllUnreadMessageCount request"
      );
      return res.status(400).json({ message: "Username is required." });
    }

    logger.info(`Fetching all unread message counts for ${requestingUsername}`);
    const count =
      await MessageHistoryService.getAllUnreadMessagesCount(requestingUsername);

    return res.json(count);
  } catch (err) {
    logger.error(`Error getting all unread message count: ${err.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
});
