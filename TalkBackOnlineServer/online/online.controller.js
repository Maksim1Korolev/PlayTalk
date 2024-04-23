import { DeleteUser, connectUserToChat } from '../chat/chat.controller.js'
import { io } from '../index.js'

export const connectOnline = () => {
	const onlineUsers = new Set()

	io.on('connection', async socket => {
		console.log('user connected')
		let savedUsername

		socket.on('online-ping', async username => {
			savedUsername = username

			// Online logic
			onlineUsers.add(savedUsername)
			console.log(`Online users after ${savedUsername} connected:`, onlineUsers)
			socket.emit('online-users', Array.from(onlineUsers))

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
				onlineUsers.delete(savedUsername)
				console.log(`Online users after ${savedUsername} disconnected:`, onlineUsers)
				socket.broadcast.emit('user-connection', savedUsername, false)

				await DeleteUser(socket.id)
			}
		})
	})
}
