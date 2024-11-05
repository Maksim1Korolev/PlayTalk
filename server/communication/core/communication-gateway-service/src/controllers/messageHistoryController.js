import asyncHandler from "express-async-handler";

import { getLogger } from "../utils/logger.js";

import MessageHistoryService from "../services/messageHistoryService.js";

const logger = getLogger("MessageHistoryController");

//TODO:Add routes and implement
// @desc   Get message history for specific users
// @route  GET api/messageHistories/messageHistory
// @access Protected
export const getMessageHistory = asyncHandler(async (req, res) => {
  const usernames = req.query.usernames;
  logger.info(usernames);
  if (!usernames) {
    logger.warn("Usernames are missing in request");
    return res.status(400).json({ message: "Usernames are required." });
  }
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
