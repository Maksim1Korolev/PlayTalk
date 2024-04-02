import express from 'express'
import { addToMap, getReceiverSocketId, removeFromMap } from './chat.controller.js'

const router = express.Router()

router.route('/:username').get(getReceiverSocketId)
router.route('/addToChatLobby').post(addToMap)
router.route('/:socketId').delete(removeFromMap)

export default router
