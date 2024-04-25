import asyncHandler from "express-async-handler";

import MessageHistoryService from "../service/MessageHistoryService.js";

const userSockets = new Map();

// @desc   Add message to Message History
//         return Socket ids
// @route  POST /messages/message
// @access Public
export const addMessageToHistory = asyncHandler(async (req, res) => {
  const { usernames, message } = req.body;
  MessageHistoryService.addMessage(usernames, message);

  const receiversSocketIds = [];
  usernames.map((username) => {
    const currentUserSockets = userSockets.get(username);
    if (currentUserSockets) {
      currentUserSockets.map((socketId) => receiversSocketIds.push(socketId));
    }
  });
  return res.json({ receiversSocketIds });
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

  const messageHistory = await MessageHistoryService.getMessageHistory(
    sortedUsernames
  );

  return res.json({ messageHistory });
});

// @desc   Remove user from chat lobby's map of SocketIds based on socket disconnection
// @route  DELETE /:socketId
// @access Public
export const removeFromMap = asyncHandler(async (req, res) => {
  const { socketId } = req.params;

  // Find the user associated with the socketId
  let usernameToDisconnect;
  for (const [username, socketIds] of userSockets.entries()) {
    if (socketIds.includes(socketId)) {
      usernameToDisconnect = username;
      break;
    }
  }

  // If user found, proceed to modify their socketIds
  if (usernameToDisconnect) {
    // Get the current list of socketIds for the user
    const socketIds = userSockets.get(usernameToDisconnect);
    // Filter out the socketId that is to be disconnected
    const updatedSocketIds = socketIds.filter((id) => id !== socketId);

    if (updatedSocketIds.length === 0) {
      // If no socketIds are left, remove the user from the map
      userSockets.delete(usernameToDisconnect);
    } else {
      // Otherwise, update the user's socketIds in the map
      userSockets.set(usernameToDisconnect, updatedSocketIds);
    }
    return res
      .status(200)
      .send("Socket disconnected and user updated or removed as necessary.");
  } else {
    // If no user was associated with the socketId, send an error response
    return res.status(404).send("Socket ID not found in user sockets map.");
  }
});
