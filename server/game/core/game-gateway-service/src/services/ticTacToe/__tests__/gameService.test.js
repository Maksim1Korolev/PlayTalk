import axios from "axios";

import GameService from "../gameService.js";

jest.mock("axios");

describe("GameService", () => {
  const ticTacToeServiceUrl = `${process.env.TIC_TAC_TOE_SERVICE_API_URL}/Game`;
  const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
  const serviceName = "game_gateway_service";

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getGame", () => {
    it("should fetch game data for the given players", async () => {
      const player1Username = "player1";
      const player2Username = "player2";
      const mockGameData = { game: { id: "game123", status: "ongoing" } };
      axios.get.mockResolvedValue({ data: mockGameData });

      const result = await GameService.getGame(
        player1Username,
        player2Username
      );

      const expectedUrl = `${ticTacToeServiceUrl}/game`;
      expect(axios.get).toHaveBeenCalledWith(expectedUrl, {
        params: { player1Username, player2Username },
        headers: { [internalServiceHeaderKey]: serviceName },
      });
      expect(result).toEqual(mockGameData.game);
    });

    it("should throw an error if player usernames are missing", async () => {
      await expect(GameService.getGame(null, "player2")).rejects.toThrow(
        "Both usernames must be specified"
      );
    });
  });

  describe("startGame", () => {
    it("should start a new game for the given players", async () => {
      const player1Username = "player1";
      const player2Username = "player2";
      const mockResponseData = { gameId: "newGameId", status: "started" };
      axios.post.mockResolvedValue({ data: mockResponseData });

      const result = await GameService.startGame(
        player1Username,
        player2Username
      );

      const expectedUrl = `${ticTacToeServiceUrl}/start`;
      expect(axios.post).toHaveBeenCalledWith(expectedUrl, null, {
        params: { player1Username, player2Username },
        headers: { [internalServiceHeaderKey]: serviceName },
      });
      expect(result).toEqual(mockResponseData);
    });

    it("should fetch existing game if startGame returns 400 (game already exists)", async () => {
      const player1Username = "player1";
      const player2Username = "player2";
      const existingGameData = {
        game: { id: "existingGameId", status: "ongoing" },
      };
      axios.post.mockRejectedValueOnce({
        response: { status: 400 },
      });
      axios.get.mockResolvedValueOnce({ data: existingGameData });

      const result = await GameService.startGame(
        player1Username,
        player2Username
      );

      expect(axios.post).toHaveBeenCalledWith(
        `${ticTacToeServiceUrl}/start`,
        null,
        {
          params: { player1Username, player2Username },
          headers: { [internalServiceHeaderKey]: serviceName },
        }
      );
      expect(axios.get).toHaveBeenCalledWith(`${ticTacToeServiceUrl}/game`, {
        params: { player1Username, player2Username },
        headers: { [internalServiceHeaderKey]: serviceName },
      });
      expect(result).toEqual(existingGameData.game);
    });

    it("should throw an error if player usernames are missing", async () => {
      await expect(GameService.startGame(null, "player2")).rejects.toThrow(
        "Both usernames must be specified"
      );
    });
  });

  describe("makeMove", () => {
    it("should make a move for the given players and index", async () => {
      const interactingPlayerUsername = "player1";
      const player2Username = "player2";
      const interactingIndex = 3;
      const mockResponseData = { status: "move accepted" };
      axios.post.mockResolvedValue({ data: mockResponseData });

      const result = await GameService.makeMove(
        interactingPlayerUsername,
        player2Username,
        interactingIndex
      );

      const expectedUrl = `${ticTacToeServiceUrl}/move`;
      expect(axios.post).toHaveBeenCalledWith(expectedUrl, null, {
        params: {
          player1Username: interactingPlayerUsername,
          player2Username,
          interactingPlayerUsername,
          interactingIndex,
        },
        headers: { [internalServiceHeaderKey]: serviceName },
      });
      expect(result).toEqual(mockResponseData);
    });

    it("should throw an error if player usernames are missing", async () => {
      await expect(GameService.makeMove(null, "player2", 1)).rejects.toThrow(
        "Player usernames must be specified"
      );
    });
  });

  describe("surrender", () => {
    it("should surrender the game for the given players", async () => {
      const surrenderedPlayerUsername = "player1";
      const player2Username = "player2";
      const mockResponseData = { status: "player1 surrendered" };
      axios.post.mockResolvedValue({ data: mockResponseData });

      const result = await GameService.surrender(
        surrenderedPlayerUsername,
        player2Username
      );

      const expectedUrl = `${ticTacToeServiceUrl}/surrender`;
      expect(axios.post).toHaveBeenCalledWith(expectedUrl, null, {
        params: {
          player1Username: surrenderedPlayerUsername,
          player2Username,
          surrenderedPlayerUsername,
        },
        headers: { [internalServiceHeaderKey]: serviceName },
      });
      expect(result).toEqual(mockResponseData);
    });

    it("should throw an error if player usernames are missing", async () => {
      await expect(GameService.surrender(null, "player2")).rejects.toThrow(
        "Player usernames must be specified"
      );
    });
  });
});
