import express from 'express'
import { getInGameUsernames } from './connection.controller.js'

const router = express.Router()

router.get('/inGameUsernames', getInGameUsernames)

export default router
