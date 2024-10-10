import axios from "axios";
import GameService from "../gameService.js";

jest.mock("axios");

describe("GameService", () => {
  const mockPlayer1 = "player1";
  const mockPlayer2 = "player2";
  const mockGameUrl = process.env.TIC_TAC_TOE_SERVICE_URL;
  const mockHeaders = {
    headers: {
      [process.env.INTERNAL_SERVICE_HEADER]: "game_gateway_service",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGame", () => {
    it("should fetch game data when both usernames are provided", async () => {
      const mockResponse = { data: { gameId: 1, status: "in-progress" } };
      axios.get.mockResolvedValue(mockResponse);

      const result = await GameService.getGame(mockPlayer1, mockPlayer2);

      expect(axios.get).toHaveBeenCalledWith(
        `${mockGameUrl}/Game/game`,
        expect.objectContaining({
          params: {
            player1Username: mockPlayer1,
            player2Username: mockPlayer2,
          },
          ...mockHeaders,
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if either username is missing", async () => {
      await expect(GameService.getGame(null, mockPlayer2)).rejects.toThrow(
        "Both usernames must be specified"
      );
      expect(axios.get).not.toHaveBeenCalled();
    });

    it("should handle errors when fetching game data fails", async () => {
      const mockError = new Error("Network Error");
      axios.get.mockRejectedValue(mockError);

      await expect(
        GameService.getGame(mockPlayer1, mockPlayer2)
      ).rejects.toThrow("Network Error");

      expect(axios.get).toHaveBeenCalledWith(
        `${mockGameUrl}/Game/game`,
        expect.objectContaining({
          params: {
            player1Username: mockPlayer1,
            player2Username: mockPlayer2,
          },
          ...mockHeaders,
        })
      );
    });
  });

  describe("startGame", () => {
    it("should start a game when both usernames are provided", async () => {
      const mockResponse = { data: { gameId: 1, status: "started" } };
      axios.post.mockResolvedValue(mockResponse);

      const result = await GameService.startGame(mockPlayer1, mockPlayer2);

      expect(axios.post).toHaveBeenCalledWith(
        `${mockGameUrl}/Game/start`,
        null,
        expect.objectContaining({
          params: {
            player1Username: mockPlayer1,
            player2Username: mockPlayer2,
          },
          ...mockHeaders,
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if either username is missing", async () => {
      await expect(GameService.startGame(mockPlayer1, null)).rejects.toThrow(
        "Both usernames must be specified"
      );
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("should handle errors when starting a game fails", async () => {
      const mockError = new Error("Network Error");
      axios.post.mockRejectedValue(mockError);

      await expect(
        GameService.startGame(mockPlayer1, mockPlayer2)
      ).rejects.toThrow("Network Error");

      expect(axios.post).toHaveBeenCalledWith(
        `${mockGameUrl}/Game/start`,
        null,
        expect.objectContaining({
          params: {
            player1Username: mockPlayer1,
            player2Username: mockPlayer2,
          },
          ...mockHeaders,
        })
      );
    });
  });

  describe("makeMove", () => {
    const mockIndex = 2;

    it("should make a move when all parameters are provided", async () => {
      const mockResponse = { data: { moveResult: "Success" } };
      axios.post.mockResolvedValue(mockResponse);

      const result = await GameService.makeMove(
        mockPlayer1,
        mockPlayer2,
        mockIndex
      );

      expect(axios.post).toHaveBeenCalledWith(
        `${mockGameUrl}/Game/move`,
        null,
        expect.objectContaining({
          params: {
            player1Username: mockPlayer1,
            player2Username: mockPlayer2,
            interactingPlayerUsername: mockPlayer1,
            interactingIndex: mockIndex,
          },
          ...mockHeaders,
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if either player username is missing", async () => {
      await expect(
        GameService.makeMove(null, mockPlayer2, mockIndex)
      ).rejects.toThrow("Player usernames must be specified");

      expect(axios.post).not.toHaveBeenCalled();
    });

    it("should handle errors when making a move fails", async () => {
      const mockError = new Error("Network Error");
      axios.post.mockRejectedValue(mockError);

      await expect(
        GameService.makeMove(mockPlayer1, mockPlayer2, mockIndex)
      ).rejects.toThrow("Network Error");

      expect(axios.post).toHaveBeenCalledWith(
        `${mockGameUrl}/Game/move`,
        null,
        expect.objectContaining({
          params: {
            player1Username: mockPlayer1,
            player2Username: mockPlayer2,
            interactingPlayerUsername: mockPlayer1,
            interactingIndex: mockIndex,
          },
          ...mockHeaders,
        })
      );
    });
  });

  describe("surrender", () => {
    it("should allow a player to surrender", async () => {
      const mockResponse = { data: { result: "Surrendered" } };
      axios.post.mockResolvedValue(mockResponse);

      const result = await GameService.surrender(mockPlayer1, mockPlayer2);

      expect(axios.post).toHaveBeenCalledWith(
        `${mockGameUrl}/Game/surrender`,
        null,
        expect.objectContaining({
          params: {
            player1Username: mockPlayer1,
            player2Username: mockPlayer2,
            surrenderedPlayerUsername: mockPlayer1,
          },
          ...mockHeaders,
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if either player username is missing", async () => {
      await expect(GameService.surrender(mockPlayer1, null)).rejects.toThrow(
        "Player usernames must be specified"
      );
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("should handle errors when surrendering fails", async () => {
      const mockError = new Error("Network Error");
      axios.post.mockRejectedValue(mockError);

      await expect(
        GameService.surrender(mockPlayer1, mockPlayer2)
      ).rejects.toThrow("Network Error");

      expect(axios.post).toHaveBeenCalledWith(
        `${mockGameUrl}/Game/surrender`,
        null,
        expect.objectContaining({
          params: {
            player1Username: mockPlayer1,
            player2Username: mockPlayer2,
            surrenderedPlayerUsername: mockPlayer1,
          },
          ...mockHeaders,
        })
      );
    });
  });
});
