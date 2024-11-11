import ActiveGamesService from "../../services/activeGamesService.js";
import TicTacToeGameService from "../../services/ticTacToe/gameService.js";

import { getActiveGames, getGame } from "../gameController.js";

jest.mock("../../services/activeGamesService.js");
jest.mock("../../services/ticTacToe/gameService.js");

describe("GameController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: { username: "player1" }, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("getActiveGames", () => {
    it("should return active games for the requesting user", async () => {
      const mockActiveGames = [{ id: "game1", name: "tic-tac-toe" }];
      ActiveGamesService.getActiveGames.mockResolvedValueOnce(mockActiveGames);

      await getActiveGames(req, res);

      expect(ActiveGamesService.getActiveGames).toHaveBeenCalledWith("player1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ activeGames: mockActiveGames });
    });

    it("should return 500 if an error occurs while fetching active games", async () => {
      ActiveGamesService.getActiveGames.mockRejectedValueOnce(
        new Error("Database error")
      );

      await getActiveGames(req, res);

      expect(ActiveGamesService.getActiveGames).toHaveBeenCalledWith("player1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });

  describe("getGame", () => {
    beforeEach(() => {
      req.params.gameName = "tic-tac-toe";
    });

    it("should return game data for tic-tac-toe when both players are specified", async () => {
      req.query.opponentUsername = "player2";
      const mockGameData = { id: "game123", status: "ongoing" };
      TicTacToeGameService.getGame.mockResolvedValueOnce(mockGameData);

      await getGame(req, res);

      expect(TicTacToeGameService.getGame).toHaveBeenCalledWith(
        "player1",
        "player2"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ game: mockGameData });
    });

    it("should return 400 if opponent username is missing", async () => {
      req.query.opponentUsername = undefined;

      await getGame(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Opponent username must be specified.",
      });
    });

    it("should return 404 if the game is not found", async () => {
      req.query.opponentUsername = "player2";
      TicTacToeGameService.getGame.mockResolvedValueOnce(null);

      await getGame(req, res);

      expect(TicTacToeGameService.getGame).toHaveBeenCalledWith(
        "player1",
        "player2"
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Game not found for the specified users.",
      });
    });

    it("should return 400 for unsupported game types", async () => {
      req.params.gameName = "unsupported-game";
      req.query.opponentUsername = "player2";

      await getGame(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: `Game type unsupported-game is not supported.`,
      });
    });

    it("should return 500 if an error occurs while fetching game data", async () => {
      req.query.opponentUsername = "player2";
      TicTacToeGameService.getGame.mockRejectedValueOnce(
        new Error("Service error")
      );

      await getGame(req, res);

      expect(TicTacToeGameService.getGame).toHaveBeenCalledWith(
        "player1",
        "player2"
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });
});
