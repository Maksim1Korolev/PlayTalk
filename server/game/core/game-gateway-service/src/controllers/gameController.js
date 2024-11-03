import asyncHandler from "express-async-handler";

import { getLogger } from "../utils/logger.js";

import ActiveGamesService from "../services/activeGamesService.js";
import TicTacToeGameService from "../services/ticTacToe/gameService.js";

const logger = getLogger("GameController");

// @desc   Get data of active games
// @route  GET /api/game/games
// @access Protected
export const getActiveGames = asyncHandler(async (req, res) => {
  const { username } = req.user;

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
// @route  GET /api/game/:gameName?opponentUsername=:opponent
// @access Protected
export const getGame = asyncHandler(async (req, res) => {
  const { gameName } = req.params;
  const { username } = req.user;
  const { opponentUsername } = req.query;

  if (!opponentUsername) {
    logger.warn(`Opponent username must be specified`);
    return res
      .status(400)
      .json({ message: "Opponent username must be specified." });
  }

  try {
    logger.info(
      `Fetching game: ${gameName} for players ${username} and ${opponentUsername}`
    );
    let gameData;

    switch (gameName) {
      case "tic-tac-toe":
        gameData = await TicTacToeGameService.getGame(
          username,
          opponentUsername
        );
        console.log(gameData);
        console.log(gameData);

        if (!gameData) {
          logger.warn(
            `Game not found for users: ${username}, ${opponentUsername}`
          );
          return res
            .status(404)
            .json({ message: "Game not found for the specified users." });
        }

        logger.info(
          `Game data retrieved successfully for users: ${username}, ${opponentUsername}`
        );
        return res.status(200).json({ game: gameData });

      default:
        logger.warn(`Unsupported game type: ${gameName}`);
        return res
          .status(400)
          .json({ message: `Game type ${gameName} is not supported.` });
    }
  } catch (error) {
    logger.error(`Error retrieving game data: ${error.message}`);
    return res.status(500).json({ message: "Internal server error." });
  }
});
