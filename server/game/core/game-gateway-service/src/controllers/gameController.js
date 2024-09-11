import asyncHandler from "express-async-handler";

import { getLogger } from "../utils/logger.js";
const logger = getLogger("GameController");

import ActiveGamesService from "../services/activeGamesService.js";
import TicTacToeGameService from "../services/ticTacToe/gameService.js";

// @desc   Get data of active games
// @route  GET /api/game/games/:username
// @access Protected
export const getActiveGames = asyncHandler(async (req, res) => {
  const { username } = req.params;

  try {
    logger.info(`Fetching active games for user: ${username}`);
    const activeGames = await ActiveGamesService.getActiveGames(username);
    return res.status(200).json({ activeGames });
  } catch (error) {
    logger.error(
      `Error getting active games for user: ${username} - ${error.message}`
    );
    return res.status(500).json({ message: "Internal server error." });
  }
});

// @desc   Get a specific game
// @route  GET /api/:gameName?player1Username=:player1&player2Username=:player2
// @access Protected
export const getGame = async (req, res) => {
  try {
    const { gameName } = req.params;
    const { player1Username, player2Username } = req.query;

    if (!player1Username || !player2Username) {
      logger.warn(
        `Both usernames must be specified: ${player1Username}, ${player2Username}`
      );
      return res
        .status(400)
        .json({ message: "Both usernames must be specified." });
    }

    logger.info(
      `Fetching game: ${gameName} for players ${player1Username} and ${player2Username}`
    );

    switch (gameName) {
      case "tic-tac-toe":
        const gameData = await TicTacToeGameService.getGame(
          player1Username,
          player2Username
        );

        if (!gameData) {
          logger.warn(
            `Game not found for users: ${player1Username}, ${player2Username}`
          );
          return res
            .status(404)
            .json({ message: "Game not found for the specified users." });
        }

        logger.info(
          `Game data retrieved successfully for users: ${player1Username}, ${player2Username}`
        );
        return res.status(200).json({ game: gameData });

      default:
        logger.warn(`Unsupported game type: ${gameName}`);
        return res
          .status(400)
          .json({ message: `Game type ${gameName} is not supported.` });
    }
  } catch (err) {
    logger.error(`Error retrieving game data: ${err.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};
