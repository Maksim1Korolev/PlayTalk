import express from "express";
import {
  addMessageToHistory,
  addToMap,
  getAllUnreadMessageCount,
  getMessageHistory,
  getUnreadMessageCount,
  markAsRead,
  removeFromMap,
} from "./online.controller.js";

const router = express.Router();

router.route("/messages/message").post(addMessageToHistory);
router.route("/addToChatLobby").post(addToMap);

//TODO:Add protect for users that messageHistory belongs to them
router.route("/messageHistory").get(getMessageHistory);

router.route("/unread/all/:requestingUsername").get(getAllUnreadMessageCount);
router.route("/unread/:requestingUsername").get(getUnreadMessageCount);
router.route("/markAsRead/:requestingUsername").post(markAsRead);
router.route("/:socketId").delete(removeFromMap);

export default router;
