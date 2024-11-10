import express from "express";

import {
  addProfile,
  getProfileByUsername,
  getProfiles,
} from "../controllers/profileController";

const router = express.Router();

router.route("/").post(addProfile);
router.route("/").get(getProfiles);
router.get("/:username", getProfileByUsername);

export default router;
