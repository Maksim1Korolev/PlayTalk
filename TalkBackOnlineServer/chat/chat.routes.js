import express from "express";
import {
  getAllUnreadMessageCounts,
  markAllMessagesAsRead,
} from "./chat.controller.js";

const router = express.Router();

router.get("/unread/:requestingUsername", getAllUnreadMessageCounts);
router.post("/markAsRead/:requestingUsername", markAllMessagesAsRead);

export default router;
