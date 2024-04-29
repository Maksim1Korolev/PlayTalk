import express from "express";
import { getBusyUsernames } from "./connection.controller.js";

const router = express.Router();

router.get("/busyUsernames", getBusyUsernames);

export default router;
