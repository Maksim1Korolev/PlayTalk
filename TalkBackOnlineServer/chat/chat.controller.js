import axios from 'axios'
import { io } from '../index.js'

export const connectUserToChat = async (username, socket, receiverUsername) => {
	socket.on('send-message', async ({ senderUsername, receiverUsername, message }) => {
		const usernames = [senderUsername, receiverUsername]
		usernames.sort()
		const { data } = await GetUserIds(usernames, message)
		const { receiversSocketIds } = data

		if (receiversSocketIds) {
			io.to(receiversSocketIds).emit(`receive-message`, {
				senderUsername,
				message,
			})
		}
	})

	return await PostUser(username, socket.id, receiverUsername)
}

const PostUser = async (senderUsername, senderSocketId, receiverUsername) => {
	return await axios
		.post(`${process.env.CHAT_SERVER_URL}/addToChatLobby`, {
			senderUsername,
			senderSocketId,
			receiverUsername,
		})
		.catch(e => {
			console.log('Server is not connected or returns an error')
		})
}
const GetUserIds = async (usernames, message) => {
	return await axios
		.post(`${process.env.CHAT_SERVER_URL}/messages/message`, {
			usernames,
			message,
		})
		.catch(e => {
			console.log('Server is not connected or returns an error')
		})
}
export const DeleteUser = async socketId => {
	return await axios.delete(`${process.env.CHAT_SERVER_URL}/${socketId}`).catch(() => {
		console.log('Server is not connected or returns an error')
	})
}
