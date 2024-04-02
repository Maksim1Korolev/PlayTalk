import axios from 'axios'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

dotenv.config()

const app = express()

const server = http.createServer(app)
export const io = new Server(server, {
	cors: {},
})
io.on('connection', socket => {
	console.log('user connected')
	let savedUsername

	socket.on('online-ping', username => {
		savedUsername = username

		// OnLine logic
		onlineUsers.add(savedUsername)
		console.log(`Online users after ${savedUsername} connected:`, onlineUsers)
		socket.emit('online-users', Array.from(onlineUsers))

		socket.broadcast.emit(`user-connection`, savedUsername, true)

		//Chat logic

		axios.post(`${process.env.CHAT_SERVER_URL}/addToChatLobby`, {
			username,
			socketId: socket.id,
		})

		socket.on('send-message', async ({ senderUsername, receiverUsername, message }) => {
			const receiverSocketId = await axios.post(`${process.env.CHAT_SERVER_URL}/send-message`, {
				senderUsername,
				receiverUsername,
				message,
			})

			if (receiverSocketId) {
				io.to(receiverSocketId).emit('receive-message', {
					senderUsername,
					message,
				})
			}
			//else {
			//	console.log(`Receiver ${receiverUsername} is not available.`)
			//	socket.emit('receiver-not-available', `${receiverUsername} is not available.`)
			//}
		})
	})

	socket.on('disconnect', () => {
		if (savedUsername) {
			onlineUsers.delete(savedUsername)
			console.log(`Online users after ${savedUsername} disconnected:`, onlineUsers)
			socket.broadcast.emit('user-connection', savedUsername, false)

			axios.delete(`${process.env.CHAT_SERVER_URL}/${socket.id}`)
		}
	})
})

const PORT = process.env.PORT || 4000
const onlineUsers = new Set()

async function main() {
	app.use(cors())
	app.use(express.json())

	const __dirname = path.resolve()

	//app.use('/uploads', express.static(path.join(__dirname, '/uploads/')))
}

app.listen(
	PORT,
	console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold)
)

main()

server.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`)
})
