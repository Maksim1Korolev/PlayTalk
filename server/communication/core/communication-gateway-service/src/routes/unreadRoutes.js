import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import {
  getAllUnreadMessageCounts,
  readAllUnreadMessages,
} from "../controllers/unreadController.js";

const router = express.Router();

//TODO:RealTime unread problems
router
  .route("/markAsRead/:requestingUsername")
  .post(protect, readAllUnreadMessages);
router
  .route("/getAll/:requestingUsername")
  .get(protect, getAllUnreadMessageCounts);

export default router;
