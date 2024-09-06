import express from "express";
import { getOnlineUsernames } from "../controllers/onlineController.js";

const router = express.Router();

router.get("/onlineUsernames", getOnlineUsernames);

export default router;
