import express from "express";
import { getAllUnreadMessageCounts } from "./chat.controller.js";

const router = express.Router();

router.get("/unread/:requestingUsername", getAllUnreadMessageCounts);

export default router;
