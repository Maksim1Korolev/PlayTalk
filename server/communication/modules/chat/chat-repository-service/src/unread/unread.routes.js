import express from "express";
import {
  getAllUnreadMessageCount,
  getUnreadMessageCount,
  markAsRead,
} from "./unread.controller.js";

const router = express.Router();

router.route("/all/:requestingUsername").get(getAllUnreadMessageCount);
router.route("/:requestingUsername").get(getUnreadMessageCount);
router.route("/markAsRead/:requestingUsername").post(markAsRead);

export default router;
