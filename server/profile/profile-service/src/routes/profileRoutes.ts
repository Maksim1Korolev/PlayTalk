import express from "express";

import {
  addProfile,
  getProfileByUsername,
  getProfiles,
  isProfileRegistered,
} from "../controllers/profileController";

const router = express.Router();

router.route("/").post(addProfile);
router.route("/").get(getProfiles);
router.get("/:username", getProfileByUsername);
router.get("/isRegistered/:username", isProfileRegistered);

export default router;
