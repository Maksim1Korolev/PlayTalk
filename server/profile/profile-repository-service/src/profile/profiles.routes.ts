import express from "express";
import { addProfile, getProfiles } from "./profiles.controller";

const router = express.Router();

router.route("/").get(getProfiles);
router.route("/").post(addProfile);

export default router;
