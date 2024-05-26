import express from "express";
import {
  getAllUnreadMessageCounts,
  readAllUnreadMessage,
} from "./chat.controller.js";

const router = express.Router();

router.get("/unread/:requestingUsername", getAllUnreadMessageCounts);
router.post("/markAsRead/:requestingUsername", readAllUnreadMessage);

export default router;
