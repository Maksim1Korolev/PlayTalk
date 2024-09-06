import express from "express";
import {
  addMessageToHistory,
  getMessageHistory,
} from "../controllers/messageHistoryController.js";

const router = express.Router();

//TODO:Add protect for users that messageHistory belongs to them
router.route("/messageHistory").get(getMessageHistory);
router.route("/messages/message").post(addMessageToHistory);

export default router;
