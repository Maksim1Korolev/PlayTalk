import express from "express";

import { registerRateLimiter } from "../middleware/rateLimiter.js";

import { authUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

router.route("/login").post(authUser);
router.route("/register").post(registerRateLimiter, registerUser);

export default router;
