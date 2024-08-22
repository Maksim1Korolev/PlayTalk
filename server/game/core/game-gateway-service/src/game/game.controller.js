import asyncHandler from "express-async-handler";
import SocketService from "../services/socketService.js";
import TicTacToeGameService from "../services/ticTacToe/gameService.js";

// @desc   Get data of active games
// @route  GET /api/game/games
// @access Public
export const getActiveGames = asyncHandler(async (req, res) => {
  const { username } = req.body;
  try {
    const activeGames = await SocketService.getActiveGames(username);
    return res.status(200).json({ activeGames });
  } catch (error) {
    console.error("Error adding message to history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @desc   Get a specific game
// @route  GET /api/:gameName?player1Username=:player1&player2Username=:player2
// @access Public
export const getGame = async (req, res) => {
  try {
    const { gameName } = req.params;
    const { player1Username, player2Username } = req.query;

    if (!player1Username || !player2Username) {
      return res
        .status(400)
        .json({ message: "Both usernames must be specified." });
    }

    switch (gameName) {
      case "tic-tac-toe":
        const gameData = await TicTacToeGameService.getGame(
          player1Username,
          player2Username
        );

        if (!gameData) {
          return res
            .status(404)
            .json({ message: "Game not found for the specified users." });
        }

        return res.status(200).json({ game: gameData });

      // Other case example
      // case "other-game":
      //   const otherGameData = await OtherGameService.getGame(player1Username, player2Username);
      //   return res.status(200).json({ game: otherGameData });

      default:
        console.log(`Unsupported game type: ${gameName}`);
        return res
          .status(400)
          .json({ message: `Game type ${gameName} is not supported.` });
    }
  } catch (err) {
    console.error("Error retrieving game data:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
