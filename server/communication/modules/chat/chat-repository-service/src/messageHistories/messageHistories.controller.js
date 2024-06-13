import asyncHandler from "express-async-handler";
import MessageHistoryService from "../services/MessageHistoryService.js";

const userSockets = new Map();

// @desc   Add message to Message History and update missing message List
//         return Socket ids
// @route  POST /messages/message
// @access Public
export const addMessageToHistory = asyncHandler(async (req, res) => {
  const { usernames, message } = req.body;
  try {
    await MessageHistoryService.addMessage(usernames, message);

    const receiversSocketIds = [];
    usernames.map(username => {
      const currentUserSockets = userSockets.get(username);
      if (currentUserSockets) {
        currentUserSockets.map(socketId => receiversSocketIds.push(socketId));
      }
    });
    console.log(receiversSocketIds);
    return res.status(200).json({ receiversSocketIds });
  } catch (error) {
    console.error("Error adding message to history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @desc   Add user to chat lobby's map of SocketIds
// @route  POST /addToChatLobby
// @access Public
export const addToMap = asyncHandler(async (req, res) => {
  const { addedUserUsername, addedUserSocketId } = req.body;

  if (!addedUserUsername || !addedUserSocketId) {
    return res
      .status(400)
      .json({ message: "Username and socket ID are required." });
  }

  const socketIds = userSockets.get(addedUserUsername) || [];

  if (!socketIds.includes(addedUserSocketId)) {
    socketIds.push(addedUserSocketId);
    userSockets.set(addedUserUsername, socketIds);
    return res.status(201).json({ message: "Socket ID added successfully." });
  } else {
    return res
      .status(304)
      .json({ message: "Socket ID already exists for this user." });
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

  const sortedUsernames = Array.isArray(usernames)
    ? usernames.sort()
    : [usernames].sort();

  try {
    const messageHistory = await MessageHistoryService.getMessageHistory(
      sortedUsernames
    );

    return res.json({ messageHistory });
  } catch (error) {
    console.error("Error fetching message history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @desc   Remove user from chat lobby's map of SocketIds based on socket disconnection
// @route  DELETE /:socketId
// @access Public
export const removeFromMap = asyncHandler(async (req, res) => {
  const { socketId } = req.params;

  try {
    let usernameToDisconnect;
    for (const [username, socketIds] of userSockets.entries()) {
      if (socketIds.includes(socketId)) {
        usernameToDisconnect = username;
        break;
      }
    }

    if (usernameToDisconnect) {
      const socketIds = userSockets.get(usernameToDisconnect);
      const updatedSocketIds = socketIds.filter(id => id !== socketId);

      if (updatedSocketIds.length === 0) {
        userSockets.delete(usernameToDisconnect);
      } else {
        userSockets.set(usernameToDisconnect, updatedSocketIds);
      }
      return res
        .status(200)
        .send("Socket disconnected and user updated or removed as necessary.");
    } else {
      return res.status(404).send("Socket ID not found in user sockets map.");
    }
  } catch (error) {
    console.error("Error removing socket from map:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
