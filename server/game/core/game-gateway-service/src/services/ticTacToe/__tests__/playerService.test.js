import axios from "axios";
import PlayerService from "../playerService.js";

jest.mock("axios");

describe("PlayerService", () => {
  const mockUsername = "testUser";
  const mockUrl = `${process.env.TIC_TAC_TOE_REPOSITORY_SERVICE_API_URL}/players/${mockUsername}`;
  const mockHeaders = {
    headers: {
      [process.env.INTERNAL_SERVICE_HEADER]: "game_gateway_service",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPlayer", () => {
    it("should fetch player data successfully when a username is provided", async () => {
      const mockResponse = { data: { username: mockUsername, score: 100 } };
      axios.get.mockResolvedValue(mockResponse);

      const result = await PlayerService.getPlayer(mockUsername);

      expect(axios.get).toHaveBeenCalledWith(mockUrl, mockHeaders);
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if the username is not specified", async () => {
      await expect(PlayerService.getPlayer()).rejects.toThrow(
        "Username is not specified"
      );
      expect(axios.get).not.toHaveBeenCalled();
    });

    it("should handle errors when fetching player data fails", async () => {
      const mockError = new Error("Network Error");
      axios.get.mockRejectedValue(mockError);

      await expect(PlayerService.getPlayer(mockUsername)).rejects.toThrow(
        "Network Error"
      );

      expect(axios.get).toHaveBeenCalledWith(mockUrl, mockHeaders);
    });
  });
});
