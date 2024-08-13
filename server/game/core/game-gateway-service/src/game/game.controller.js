import asyncHandler from "express-async-handler";
import SocketService from "../services/socketService.js";

// @desc   Get data of active games
// @route  GET /game/games
// @access Public
export const getGamesData = asyncHandler(async (req, res) => {
  const { username } = req.body;
  try {
    const activeGames = await SocketService.getActiveGames(username);
    return res.status(200).json({ activeGames });
  } catch (error) {
    console.error("Error adding message to history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
