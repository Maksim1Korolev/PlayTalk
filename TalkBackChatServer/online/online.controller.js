import asyncHandler from 'express-async-handler'

import MessageHistoryService from '../service/MessageHistoryService.js'

const userSockets = new Map()

// @desc   Add message to Message History
//         return Socket ids
// @route  POST /messages/message
// @access Public
export const addMessageToHistory = asyncHandler(async (req, res) => {
	const { usernames, message } = req.body

	console.log(usernames)

	MessageHistoryService.addMessage(usernames, message)

	const receiversSocketIds = []
	usernames.map(username => {
		const currentUserSockets = userSockets.get(username)
		if (currentUserSockets) {
			currentUserSockets.map(socketId => receiversSocketIds.push(socketId))
		}
	})

	return res.json({ receiversSocketIds })
})

// @desc   Add user to chat lobby's map of SocketIds
// @route  POST /addToChatLobby
// @access Public
export const addToMap = asyncHandler(async (req, res) => {
	const { senderUsername, senderSocketId, receiverUsername } = req.body

	const socketIds = userSockets.get(senderUsername) || []

	if (!socketIds.includes(senderSocketId)) {
		socketIds.push(senderSocketId)
		userSockets.set(senderUsername, socketIds)
	}
	const usernames = [senderUsername, receiverUsername].sort()

	const messageHistory = await MessageHistoryService.getMessageHistory(usernames)

	return res.json({ messageHistory: messageHistory })
})

// @desc   Remove user from chat lobby's map
// @route  DELETE /:socketId
// @access Public
export const removeFromMap = asyncHandler(async (req, res) => {
	const usernameToDisconnect = [...userSockets.entries()].find(
		([, v]) => v === req.params.socketId
	)?.[0]

	if (usernameToDisconnect) {
		userSockets.delete(usernameToDisconnect)
		return res.status(200)
	}
})
