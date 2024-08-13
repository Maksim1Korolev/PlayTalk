import express from "express";
import { getActiveGames } from "./game.controller.js";

const router = express.Router();

router.route("/games").get(getActiveGames);

export default router;
