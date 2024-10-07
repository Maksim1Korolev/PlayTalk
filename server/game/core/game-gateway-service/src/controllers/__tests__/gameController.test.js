import { getActiveGames, getGame } from "../gameController.js";
import ActiveGamesService from "../../services/activeGamesService.js";
import TicTacToeGameService from "../../services/ticTacToe/gameService.js";

jest.mock("../../services/activeGamesService.js");
jest.mock("../../services/ticTacToe/gameService.js");

describe("GameController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getActiveGames", () => {
    it("should return 200 and the active games for a user", async () => {
      req.params.username = "testUser";
      const mockActiveGames = [{ gameId: "1" }, { gameId: "2" }];
      ActiveGamesService.getActiveGames.mockResolvedValue(mockActiveGames);

      await getActiveGames(req, res, next);

      expect(ActiveGamesService.getActiveGames).toHaveBeenCalledWith(
        "testUser"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ activeGames: mockActiveGames });
    });

    it("should return 500 if there is an error fetching active games", async () => {
      req.params.username = "testUser";
      ActiveGamesService.getActiveGames.mockRejectedValue(
        new Error("Error fetching games")
      );

      await getActiveGames(req, res, next);

      expect(ActiveGamesService.getActiveGames).toHaveBeenCalledWith(
        "testUser"
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });

  describe("getGame", () => {
    it("should return 400 if both usernames are not provided", async () => {
      req.params.gameName = "tic-tac-toe";
      req.query.player1Username = "player1";

      await getGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Both usernames must be specified.",
      });
    });

    it("should return 200 and game data if game is found", async () => {
      req.params.gameName = "tic-tac-toe";
      req.query.player1Username = "player1";
      req.query.player2Username = "player2";
      const mockGameData = { gameId: "1", status: "ongoing" };
      TicTacToeGameService.getGame.mockResolvedValue(mockGameData);

      await getGame(req, res, next);

      expect(TicTacToeGameService.getGame).toHaveBeenCalledWith(
        "player1",
        "player2"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ game: mockGameData });
    });

    it("should return 404 if game is not found", async () => {
      req.params.gameName = "tic-tac-toe";
      req.query.player1Username = "player1";
      req.query.player2Username = "player2";
      TicTacToeGameService.getGame.mockResolvedValue(null);

      await getGame(req, res, next);

      expect(TicTacToeGameService.getGame).toHaveBeenCalledWith(
        "player1",
        "player2"
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Game not found for the specified users.",
      });
    });

    it("should return 400 if the game type is unsupported", async () => {
      req.params.gameName = "unsupported-game";
      req.query.player1Username = "player1";
      req.query.player2Username = "player2";

      await getGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Game type unsupported-game is not supported.",
      });
    });

    it("should return 500 if there is an error retrieving game data", async () => {
      req.params.gameName = "tic-tac-toe";
      req.query.player1Username = "player1";
      req.query.player2Username = "player2";
      TicTacToeGameService.getGame.mockRejectedValue(
        new Error("Error retrieving game data")
      );

      await getGame(req, res, next);

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
