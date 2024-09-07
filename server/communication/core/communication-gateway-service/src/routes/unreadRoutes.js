import express from "express";

import {
  getAllUnreadMessageCounts,
  readAllUnreadMessages,
} from "../controllers/unreadController.js";

const router = express.Router();

//TODO:RealTime unread problems
router.post("/markAsRead/:requestingUsername", readAllUnreadMessages);
router.get("/getAll/:requestingUsername", getAllUnreadMessageCounts);

export default router;
