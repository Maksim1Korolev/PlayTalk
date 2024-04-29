import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { connectOnline } from './online/online.controller.js'
import onlineRouter from './online/online.routes.js'

dotenv.config()

const app = express()

const server = http.createServer(app)
export const io = new Server(server, {
	cors: {},
})

connectOnline()

const PORT = process.env.PORT || 4000

async function main() {
	app.use(cors())
	app.use(express.json())
	app.use('/api/online', onlineRouter)

	// const __dirname = path.resolve();
	//app.use('/uploads', express.static(path.join(__dirname, '/uploads/')))
}

server.listen(PORT, () => {
	console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

main()
