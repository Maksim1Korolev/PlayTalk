import asyncHandler from 'express-async-handler'

const userSockets = new Map()

// @desc   Get user socket id from username
// @route  GET /api/chat/
// @access Public
export const getReceiverSocketId = asyncHandler(async (req, res) => {
	const receiverSocketId = userSockets.get(req.params.username)

	return res.json(receiverSocketId)
})

export const addToMap = asyncHandler(async (req, res) => {
	const { username, socketId } = req.body
	return res.json(userSockets.set(username, socketId))
})

export const removeFromMap = asyncHandler(async (req, res) => {
	const usernameToDisconnect = [...userSockets.entries()].find(
		([, v]) => v === req.params.socketId
	)?.[0]

	if (usernameToDisconnect) {
		userSockets.delete(usernameToDisconnect)
		return res.status(200)
	}
})
