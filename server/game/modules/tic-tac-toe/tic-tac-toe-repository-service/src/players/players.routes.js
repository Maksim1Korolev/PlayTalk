import express from "express";
import { getPlayer, getPlayers, updatePlayers } from "./players.controller.js";

const router = express.Router();

router.route("/:username").get(getPlayer);
router.route("/").get(getPlayers).put(updatePlayers);

export default router;
