import express from "express";
import { getUsers, getUserByUsername } from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getUsers);
router.route("/username/:username").get(protect, getUserByUsername);

export default router;
