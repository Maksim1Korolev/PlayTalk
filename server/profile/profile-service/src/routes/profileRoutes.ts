import express from "express";

import { addProfile, getProfiles } from "../controllers/profileController";

const router = express.Router();

router.route("/").get(getProfiles);
router.route("/").post(addProfile);

export default router;
