import express from "express";

import { protect } from "../middleware/authMiddleware";

import {
  getProfileByUsername,
  getProfiles,
} from "../controllers/profileController";

const router = express.Router();

router.route("/").get(protect, getProfiles);
router.route("/:username").get(protect, getProfileByUsername);

export default router;
