import { DeleteUser, connectUserToChat } from '../chat/chat.controller.js'
import { io } from '../index.js'
const onlineUsernames = new Set()

export const getOnlineUsernames = async (req, res, next) => {
	try {
		if (onlineUsernames.size === 0) {
			return res.status(200).json({ onlineUsernames: [] }) // Sending an empty array if no users are online
		}

		const usernamesToSend = Array.from(onlineUsernames)
		return res.status(200).json({ onlineUsernames: usernamesToSend })
	} catch (err) {
		console.log(err)
		res.status(500).send(err)
	}
}

export const connectOnline = () => {
	io.on('connection', async socket => {
		console.log('user connected')
		let savedUsername

		socket.on('online-ping', async username => {
			savedUsername = username

			// Online logic
			onlineUsernames.add(savedUsername)
			console.log(`Online users after ${savedUsername} connected:`, onlineUsernames)
			socket.emit('online-users', Array.from(onlineUsernames))

			socket.broadcast.emit(`user-connection`, savedUsername, true)

			//Chat logic
			socket.on('on-chat-open', async receiverUsername => {
				console.log(receiverUsername)
				const { data } = await connectUserToChat(savedUsername, socket, receiverUsername)
				const { messageHistory } = data
				console.log(messageHistory)
				socket.emit('update-chat', messageHistory, receiverUsername)
			})
		})

		socket.on('disconnect', async () => {
			if (savedUsername) {
				onlineUsernames.delete(savedUsername)
				console.log(`Online users after ${savedUsername} disconnected:`, onlineUsernames)
				socket.broadcast.emit('user-connection', savedUsername, false)

				await DeleteUser(socket.id)
			}
		})
	})
}
