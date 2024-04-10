import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getUsers } from "./users.controller.js";

const router = express.Router();

router.route("/").get(protect, getUsers);

export default router;
