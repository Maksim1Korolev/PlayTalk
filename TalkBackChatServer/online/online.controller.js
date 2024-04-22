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
		receiversSocketIds.push(userSockets.get(username))
	})

	return res.json({ receiversSocketIds, message })
})

// @desc   Add user to chat lobby's map
// @route  POST /addToChatLobby
// @access Public
export const addToMap = asyncHandler(async (req, res) => {
	const { username, socketId } = req.body

	const socketIds = userSockets.get(username) || []

	if (!socketIds.includes(socketId)) {
		socketIds.push(socketId)
		userSockets.set(username, socketIds)
	}

	return res.json({ username, socketIds })
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
