import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { getMessageHistory } from "../controllers/messageHistoryController.js";

const router = express.Router();

router.route("/:recipientUsername").get(protect, getMessageHistory);

export default router;
