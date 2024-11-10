import express from "express";

import {
  addMessageToHistory,
  getMessageHistory,
} from "../controllers/messageHistoryController.js";

const router = express.Router();

router.route("/messageHistory").get(getMessageHistory);
router.route("/messages/message").post(addMessageToHistory);

export default router;
