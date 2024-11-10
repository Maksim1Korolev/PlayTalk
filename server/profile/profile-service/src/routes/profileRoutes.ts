import express from "express";

import {
  getProfileByUsername,
  getProfiles,
} from "../controllers/profileController";

const router = express.Router();

router.route("/").get(getProfiles);
router.get("/:username", getProfileByUsername);

export default router;
