import { DeleteUser, GetMessageHistory, GetUserIds, PostUser } from '../chat/chat.controller.js'
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

export const connectOnline = async () => {
	const onlineUsers = new Set()

	io.on('connection', async socket => {
		console.log('User connected')
		let savedUsername

		socket.on('online-ping', async username => {
			savedUsername = username

      // Online logic
      onlineUsers.add(savedUsername);
      console.log(
        `Online users after ${savedUsername} connected:`,
        onlineUsers
      );
      socket.emit("online-users", Array.from(onlineUsers));

      socket.broadcast.emit(`user-connection`, savedUsername, true);

			// Chat logic
			try {
				await PostUser(savedUsername, socket.id)
				console.log('PostUser call succeeded. Continuing with the rest of the code.')
			} catch (error) {
				console.error('Error in PostUser:', error)
				return
			}

			socket.on('on-chat-open', async receiverUsername => {
				try {
					const { data } = await GetMessageHistory([username, receiverUsername])
					if (data) {
						const { messageHistory } = data
						socket.emit('update-chat', messageHistory, receiverUsername)
					}
				} catch (error) {
					console.error('Error in connectUserToChat:', error)
				}
			})
		})

		socket.on('send-message', async ({ senderUsername, receiverUsername, message }) => {
			const usernames = [senderUsername, receiverUsername]
			usernames.sort()
			try {
				const { data } = await GetUserIds(usernames, message)
				const { receiversSocketIds } = data

				io.to(receiversSocketIds).emit(`receive-message`, {
					senderUsername,
					message,
				})
			} catch (error) {
				console.log('Error receiving userIds: ' + error)
			}
		})

		socket.on('disconnect', async () => {
			if (savedUsername) {
				onlineUsernames.delete(savedUsername)
				console.log(`Online users after ${savedUsername} disconnected:`, onlineUsers)
				socket.broadcast.emit('user-connection', savedUsername, false)

				try {
					await DeleteUser(socket.id)
				} catch (error) {
					console.error('Error in DeleteUser:', error)
				}
			}
		})
	})
}
