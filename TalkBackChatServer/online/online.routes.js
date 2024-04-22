import express from 'express'
import { addMessageToHistory, addToMap, removeFromMap } from './online.controller.js'

const router = express.Router()

router.route('/messages/message').post(addMessageToHistory)
router.route('/addToChatLobby').post(addToMap)
router.route('/:socketId').delete(removeFromMap)

export default router
