import asyncHandler from "express-async-handler";

import MessageHistoryService from "../services/messageHistoryService.js";

// @desc   Get unread Messages count for specific chats
// @route  GET api/unread/:requestingUsername
// @access Internal
export const getUnreadMessageCount = asyncHandler(async (req, res) => {
  try {
    const { requestingUsername } = req.params;
    const { usernames } = req.query;

    if (!requestingUsername) {
      return res.status(400).json({ message: "Username is required." });
    }
    if (!usernames) {
      return res
        .status(400)
        .json({ message: "Usernames of MessageHistory are required." });
    }

    const usernamesArray = Array.isArray(usernames)
      ? usernames
      : usernames.split(",");

    const count = await MessageHistoryService.getUnreadMessagesCount(
      usernamesArray,
      requestingUsername
    );

    return res.json(count);
  } catch (err) {
    console.error("Error getting unread message count: ", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// @desc   Get unread Messages count for specific chats
// @route  GET api/unread/markAsRead/:requestingUsername
// @access Internal
export const markAsRead = asyncHandler(async (req, res) => {
  try {
    const { requestingUsername } = req.params;

    const { usernames } = req.body;
    if (!requestingUsername) {
      return res.status(400).json({ message: "Username is required." });
    }

    if (!usernames) {
      return res
        .status(401)
        .json({ message: "Usernames of MessageHistory are required." });
    }

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
    console.error("Error marking messages as read: ", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// @desc   Get unread Messages count for specific chats
// @route  GET api/unread/:requestingUsername
// @access Internal
export const getAllUnreadMessageCount = asyncHandler(async (req, res) => {
  try {
    const { requestingUsername } = req.params;

    if (!requestingUsername) {
      return res.status(400).json({ message: "Username is required." });
    }

    const count = await MessageHistoryService.getAllUnreadMessagesCount(
      requestingUsername
    );

    return res.json(count);
  } catch (err) {
    console.error("Error getting all unread message count: ", err);
    res.status(500).json({ message: "Internal server error." });
  }
});
