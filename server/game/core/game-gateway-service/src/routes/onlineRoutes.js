import express from "express";
import { getOnlineUsernames } from "../controllers/onlineController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/onlineUsernames").get(protect, getOnlineUsernames);
router.get("/onlineUsernames", getOnlineUsernames);

export default router;
