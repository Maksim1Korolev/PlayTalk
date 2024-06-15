import asyncHandler from "express-async-handler";
import MessageHistoryService from "../services/MessageHistoryService.js";

// @desc   Add message to Message History and update missing message List
//         return Socket ids
// @route  POST /messages/message
// @access Public
export const addMessageToHistory = asyncHandler(async (req, res) => {
  const { usernames, message } = req.body;
  try {
    await MessageHistoryService.addMessage(usernames, message);

    return res
      .status(200)
      .json({ message: "Message successfully added to message history." });
  } catch (error) {
    console.error("Error adding message to history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @desc   Get message history for specific users
// @route  GET /messageHistory
// @access Public
export const getMessageHistory = asyncHandler(async (req, res) => {
  const usernames = req.query.usernames;
  if (!usernames) {
    return res.status(400).json({ message: "Usernames are required." });
  }
  try {
    const messageHistory = await MessageHistoryService.getMessageHistory(
      usernames
    );

    return res.json({ messageHistory });
  } catch (error) {
    console.error("Error fetching message history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
