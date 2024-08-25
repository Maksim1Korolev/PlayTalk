import express from "express";
import { getActiveGames, getGame } from "./game.controller.js";

const router = express.Router();

router.route("/games/:username").get(getActiveGames);
router.route("/:gameName").get(getGame);

export default router;
