import express from "express";
import {
  addMessageToHistory,
  addToMap,
  getMessageHistory,
  removeFromMap,
} from "./online.controller.js";

const router = express.Router();

router.route("/messages/message").post(addMessageToHistory);
router.route("/addToChatLobby").post(addToMap);
//TODO:Add protect for users that messageHistory belongs to them
router.route("/messageHistory").get(getMessageHistory);
router.route("/:socketId").delete(removeFromMap);

export default router;
