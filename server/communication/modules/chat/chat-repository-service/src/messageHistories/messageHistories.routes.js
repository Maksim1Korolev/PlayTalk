import express from "express";
import {
  addMessageToHistory,
  addToMap,
  getAllUnreadMessageCount,
  getMessageHistory,
  getUnreadMessageCount,
  markAsRead,
  removeFromMap,
} from "./messageHistories.controller.js";

const router = express.Router();

//TODO:Add protect for users that messageHistory belongs to them
router.route("/messageHistory").get(getMessageHistory);
// ren /messageHistory/
router.route("/messages/message").post(addMessageToHistory);

router.route("/unread/all/:requestingUsername").get(getAllUnreadMessageCount);
router.route("/unread/:requestingUsername").get(getUnreadMessageCount);
//add /unread/
router.route("/markAsRead/:requestingUsername").post(markAsRead);

//Move to comm
router.route("/addToChatLobby").post(addToMap);
router.route("/:socketId").delete(removeFromMap);

export default router;
