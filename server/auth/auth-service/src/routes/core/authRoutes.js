import express from "express";

import {
  authUser,
  registerUser,
} from "../../controllers/core/authController.js";

const router = express.Router();

router.route("/login").post(authUser);
router.route("/register").post(registerUser);

export const authRoutes = router;
