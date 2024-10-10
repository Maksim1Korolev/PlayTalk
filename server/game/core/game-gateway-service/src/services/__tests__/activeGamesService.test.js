import redisClient from "../../utils/redisClient.js";
import ActiveGamesService from "../activeGamesService.js";

describe("ActiveGamesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addActiveGame", () => {
    it("should add a new active game for both players", async () => {
      const mockUsername = "player1";
      const mockOpponentUsername = "player2";
      const mockGame = "tic-tac-toe";

      redisClient.hGet.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

      await ActiveGamesService.addActiveGame(
        mockUsername,
        mockOpponentUsername,
        mockGame
      );

      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USER_GAMES_KEY,
        mockUsername,
        JSON.stringify({ [mockOpponentUsername]: [mockGame] })
      );

      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USER_GAMES_KEY,
        mockOpponentUsername,
        JSON.stringify({ [mockUsername]: [mockGame] })
      );
    });

    it("should append a game if the opponent already exists in active games", async () => {
      const mockUsername = "player1";
      const mockOpponentUsername = "player2";
      const mockGame = "tic-tac-toe";

      const currentGamesForPlayer1 = {
        [mockOpponentUsername]: ["tic-tac-toe"],
      };
      const currentGamesForPlayer2 = { [mockUsername]: ["tic-tac-toe"] };

      redisClient.hGet
        .mockResolvedValueOnce(JSON.stringify(currentGamesForPlayer1))
        .mockResolvedValueOnce(JSON.stringify(currentGamesForPlayer2));

      await ActiveGamesService.addActiveGame(
        mockUsername,
        mockOpponentUsername,
        mockGame
      );

      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USER_GAMES_KEY,
        mockUsername,
        JSON.stringify({ [mockOpponentUsername]: ["tic-tac-toe", mockGame] })
      );

      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USER_GAMES_KEY,
        mockOpponentUsername,
        JSON.stringify({ [mockUsername]: ["tic-tac-toe", mockGame] })
      );
    });
  });

  describe("removeActiveGame", () => {
    it("should remove an active game for both players", async () => {
      const mockUsername = "player1";
      const mockOpponentUsername = "player2";
      const mockGame = "tic-tac-toe";

      const currentGamesForPlayer1 = { [mockOpponentUsername]: [mockGame] };
      const currentGamesForPlayer2 = { [mockUsername]: [mockGame] };

      redisClient.hGet
        .mockResolvedValueOnce(JSON.stringify(currentGamesForPlayer1))
        .mockResolvedValueOnce(JSON.stringify(currentGamesForPlayer2));

      await ActiveGamesService.removeActiveGame(
        mockUsername,
        mockOpponentUsername,
        mockGame
      );

      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USER_GAMES_KEY,
        mockUsername,
        JSON.stringify({})
      );

      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USER_GAMES_KEY,
        mockOpponentUsername,
        JSON.stringify({})
      );
    });

    it("should remove only the specified game and leave other active games intact", async () => {
      const mockUsername = "player1";
      const mockOpponentUsername = "player2";
      const mockGame = "tic-tac-toe";

      const currentGamesForPlayer1 = {
        [mockOpponentUsername]: [mockGame, "another-game"],
      };
      const currentGamesForPlayer2 = {
        [mockUsername]: [mockGame, "another-game"],
      };

      redisClient.hGet
        .mockResolvedValueOnce(JSON.stringify(currentGamesForPlayer1))
        .mockResolvedValueOnce(JSON.stringify(currentGamesForPlayer2));

      await ActiveGamesService.removeActiveGame(
        mockUsername,
        mockOpponentUsername,
        mockGame
      );

      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USER_GAMES_KEY,
        mockUsername,
        JSON.stringify({ [mockOpponentUsername]: ["another-game"] })
      );

      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USER_GAMES_KEY,
        mockOpponentUsername,
        JSON.stringify({ [mockUsername]: ["another-game"] })
      );
    });
  });

  describe("getActiveGames", () => {
    it("should return active games for a user from Redis", async () => {
      const mockUsername = "player1";
      const mockGames = { player2: ["tic-tac-toe"] };

      redisClient.hGet.mockResolvedValue(JSON.stringify(mockGames));

      const result = await ActiveGamesService.getActiveGames(mockUsername);

      expect(redisClient.hGet).toHaveBeenCalledWith(
        process.env.REDIS_USER_GAMES_KEY,
        mockUsername
      );
      expect(result).toEqual(mockGames);
    });

    it("should return an empty object if no games are found", async () => {
      const mockUsername = "player1";

      redisClient.hGet.mockResolvedValue(null);

      const result = await ActiveGamesService.getActiveGames(mockUsername);

      expect(redisClient.hGet).toHaveBeenCalledWith(
        process.env.REDIS_USER_GAMES_KEY,
        mockUsername
      );
      expect(result).toEqual({});
    });
  });
});
