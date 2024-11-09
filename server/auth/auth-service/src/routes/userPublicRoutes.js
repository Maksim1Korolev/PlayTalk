import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { getUserByUsername, getUsers } from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(protect, getUsers);
router.route("/username/:username").get(protect, getUserByUsername);

export default router;
