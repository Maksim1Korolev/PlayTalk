import express from "express";
import { getPlayer, updatePlayers } from "../controllers/playerController.js";

const router = express.Router();

router.route("/:username").get(getPlayer);
router.route("/").put(updatePlayers);

export default router;
