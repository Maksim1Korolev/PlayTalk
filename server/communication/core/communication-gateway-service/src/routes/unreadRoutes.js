import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { getAllUnreadMessageCounts } from "../controllers/unreadController.js";

const router = express.Router();

router.route("/getAll").get(protect, getAllUnreadMessageCounts);

export default router;
