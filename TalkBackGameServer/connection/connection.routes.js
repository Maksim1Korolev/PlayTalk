import express from "express";
import { getBusyUsernames } from "./connection.controller.js";

const router = express.Router();

router.get("/inGameUsernames", getBusyUsernames);

export default router;
