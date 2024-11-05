import asyncHandler from "express-async-handler";

import { getLogger } from "../utils/logger.js";

import MessageHistoryService from "../services/messageHistoryService.js";

const logger = getLogger("MessageHistoryController");

// @desc   Get message history between current user and recipient
// @route  GET /api/messageHistories/:recipientUsername
// @access Protected
export const getMessageHistory = asyncHandler(async (req, res) => {
  const requestingUsername = req.user.username;
  const { recipientUsername } = req.params;

  if (!recipientUsername) {
    logger.warn("Recipient username is missing in request");
    return res.status(400).json({ message: "Recipient username is required." });
  }

  const usernames = [requestingUsername, recipientUsername];
  try {
    logger.info(`Fetching message history for usernames: ${usernames}`);
    const messageHistory =
      await MessageHistoryService.getMessageHistory(usernames);

    return res.json({ messageHistory });
  } catch (err) {
    logger.error(`Error fetching message history: ${err.message}`);
    return res.status(500).json({ message: "Internal server error." });
  }
});
