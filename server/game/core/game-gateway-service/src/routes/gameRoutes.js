import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { getActiveGames, getGame } from "../controllers/gameController.js";

const router = express.Router();

router.route("/games").get(protect, getActiveGames);
router.route("/:gameName").get(protect, getGame);

export default router;
