import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import router from './online/online.routes.js'

dotenv.config()

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())

app.use('/', router)

const PORT = process.env.PORT || 4100

server.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`)
})
