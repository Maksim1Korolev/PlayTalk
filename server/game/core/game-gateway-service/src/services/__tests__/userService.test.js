import axios from "axios";

import redisClient from "../../utils/redisClient.js";
import UserService from "../userService.js";

jest.mock("axios");

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserById", () => {
    const userId = "1234";
    const mockUser = { id: userId, username: "testUser" };
    const redisKey = process.env.REDIS_USERS_ID_KEY;
    const repositoryServiceUrl = `${process.env.AUTH_REPOSITORY_SERVICE_API_URL}/users/internal`;
    const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
    const serviceName = "game_gateway_service";

    it("should throw an error if userId is not provided", async () => {
      await expect(UserService.getUserById(null)).rejects.toThrow(
        "Invalid user ID"
      );
    });

    it("should return cached user if found in Redis", async () => {
      redisClient.hGet.mockResolvedValue(JSON.stringify(mockUser));

      const result = await UserService.getUserById(userId);

      expect(redisClient.hGet).toHaveBeenCalledWith(redisKey, userId);
      expect(result).toEqual(mockUser);
    });

    it("should fetch user from repository service if not cached", async () => {
      redisClient.hGet.mockResolvedValue(null);
      axios.get.mockResolvedValue({ data: { user: mockUser } });

      const result = await UserService.getUserById(userId);

      expect(redisClient.hGet).toHaveBeenCalledWith(redisKey, userId);
      expect(axios.get).toHaveBeenCalledWith(
        `${repositoryServiceUrl}/id/${userId}`,
        {
          headers: {
            [internalServiceHeaderKey]: serviceName,
          },
        }
      );
      expect(redisClient.hSet).toHaveBeenCalledWith(
        redisKey,
        userId,
        JSON.stringify(mockUser),
        { EX: 3600 }
      );
      expect(result).toEqual(mockUser);
    });

    it("should log and throw an error if the repository service request fails", async () => {
      redisClient.hGet.mockResolvedValue(null);
      axios.get.mockRejectedValue(new Error("Repository service error"));

      await expect(UserService.getUserById(userId)).rejects.toThrow(
        "Failed to fetch user data"
      );

      expect(redisClient.hGet).toHaveBeenCalledWith(redisKey, userId);
      expect(axios.get).toHaveBeenCalledWith(
        `${repositoryServiceUrl}/id/${userId}`,
        {
          headers: {
            [internalServiceHeaderKey]: serviceName,
          },
        }
      );
      expect(redisClient.hSet).not.toHaveBeenCalled();
    });
  });
});
