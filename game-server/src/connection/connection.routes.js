import express from "express";
import { getUsersGameStatuses } from "./connection.controller.js";

const router = express.Router();

router.get("/usersGameStatuses", getUsersGameStatuses);

export default router;
