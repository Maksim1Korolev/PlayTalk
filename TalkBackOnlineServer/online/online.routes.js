import express from 'express'
import { getOnlineUsernames } from './online.controller.js'

const router = express.Router()

router.get('/onlineUsernames', getOnlineUsernames)

export default router
