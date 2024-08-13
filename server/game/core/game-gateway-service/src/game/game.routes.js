import express from "express";
import { getActiveGames, getGame } from "./game.controller.js";

const router = express.Router();

router.route("/games").get(getActiveGames);
router.route("/:gameName").get(getGame);

export default router;
