import express from "express";
import {
  getAllUnreadMessageCounts,
  readAllUnreadMessages,
} from "./chat.controller.js";

const router = express.Router();

router.get("/unread/:requestingUsername", getAllUnreadMessageCounts);
router.post("/markAsRead/:requestingUsername", readAllUnreadMessages);

export default router;
