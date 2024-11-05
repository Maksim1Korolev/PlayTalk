import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  getAllUnreadMessageCounts,
  readAllUnreadMessages,
} from "../controllers/unreadController.js";

const router = express.Router();

router
  .route("/markAsRead/:recipientUsername")
  .post(protect, readAllUnreadMessages);
router.route("/getAll").get(protect, getAllUnreadMessageCounts);

export default router;
