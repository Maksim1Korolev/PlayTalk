import express from "express";
import {} from "./players.controller.js";

const router = express.Router();

router.route("/:username").get(getPlayer);
router.route("/").get(getPlayers);
router.route("/").put(updatePlayers);

export default router;
