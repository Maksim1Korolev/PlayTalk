import express from "express";
import { getOnlineUsernames } from "./connection.controller.js";

const router = express.Router();

router.get("/onlineUsernames", getOnlineUsernames);

export default router;
