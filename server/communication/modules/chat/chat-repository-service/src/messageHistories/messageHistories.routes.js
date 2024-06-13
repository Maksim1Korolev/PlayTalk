import express from "express";
import {
  addMessageToHistory,
  addToMap,
  getMessageHistory,
  removeFromMap,
} from "./messageHistories.controller.js";

const router = express.Router();

//TODO:Add protect for users that messageHistory belongs to them
router.route("/messageHistory").get(getMessageHistory);
router.route("/messages/message").post(addMessageToHistory);

//Move to comm
router.route("/addToChatLobby").post(addToMap);
router.route("/:socketId").delete(removeFromMap);

export default router;
