import asyncHandler from "express-async-handler";

import { getLogger } from "../utils/logger.js";
const logger = getLogger("PlayerController");

import PlayerService from "../services/playerService.js";

// @desc   Get player by username
// @route  GET api/players/:username
// @access Internal
export const getPlayer = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    logger.warn("Username not provided in request.");
    return res.status(400).json({ message: "Username is required." });
  }

  try {
    logger.info(`Fetching player data for: ${username}`);
    const player = await PlayerService.getPlayers([username]);

    if (!player) {
      logger.warn(`Player not found: ${username}`);
      return res.status(404).json({ message: "Player not found." });
    }

    logger.info(`Player data found for: ${username}`);
    return res.json({ player });
  } catch (error) {
    logger.error(
      `Error fetching player data for ${username}: ${error.message}`
    );
    return res.status(500).json({ message: "Internal server error." });
  }
});

// @desc   Update players' properties
// @route  PUT api/players
// @access Internal
export const updatePlayers = asyncHandler(async (req, res) => {
  const { player1NewData, player2NewData } = req.body;

  if (!player1NewData || !player2NewData) {
    logger.warn("Both player data sets are required for update.");
    return res
      .status(400)
      .json({ message: "Player data is required for both players." });
  }

  try {
    logger.info(
      `Updating players: ${player1NewData.username} and ${player2NewData.username}`
    );
    const updatedPlayers = await PlayerService.updatePlayers(
      player1NewData,
      player2NewData
    );

    logger.info("Players updated successfully.");
    return res.json({
      message: "Players updated successfully.",
      updatedPlayers,
    });
  } catch (error) {
    logger.error(`Error updating players: ${error.message}`);
    return res.status(500).json({ message: "Internal server error." });
  }
});
