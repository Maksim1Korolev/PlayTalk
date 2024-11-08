import express from "express";

import {
  addProfile,
  getProfileByUsername,
  getProfiles,
} from "../controllers/profileController";

const router = express.Router();

router.route("/").get(getProfiles);
router.get("/:username", getProfileByUsername);
router.route("/").post(addProfile);

export default router;
