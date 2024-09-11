import asyncHandler from "express-async-handler";
import MessageHistoryService from "../services/messageHistoryService.js";

// @desc   Add message to Message History and update missing message List
//         return Socket ids
// @route  POST api/messageHistories/messages/message
// @access Internal
export const addMessageToHistory = asyncHandler(async (req, res) => {
  const { usernames, message } = req.body;
  try {
    await MessageHistoryService.addMessage(usernames, message);

    return res
      .status(200)
      .json({ message: "Message successfully added to message history." });
  } catch (err) {
    console.error("Error adding message to history:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// @desc   Get message history for specific users
// @route  GET api/messageHistories/messageHistory
// @access Internal
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
  } catch (err) {
    console.error("Error fetching message history:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});
