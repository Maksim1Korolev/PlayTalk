import express from "express";
import {
  getAllUnreadMessageCount,
  getUnreadMessageCount,
  markAsRead,
} from "../controllers/unreadController.js";

const router = express.Router();

router.route("/getAll/:requestingUsername").get(getAllUnreadMessageCount);
router.route("/:requestingUsername").get(getUnreadMessageCount);
router.route("/markAsRead/:requestingUsername").post(markAsRead);

export default router;
