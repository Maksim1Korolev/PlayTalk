import express from "express";

import { getActiveGames, getGame } from "../controllers/gameController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/games/:username").get(protect, getActiveGames);
router.route("/:gameName").get(protect, getGame);

export default router;
