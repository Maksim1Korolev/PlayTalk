import axios from "axios";
import UserService from "../userService.js";

jest.mock("axios");

describe("UserService", () => {
  const username = "testUser";
  const user = { username, email: "test@example.com" };
  const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
  const serviceName = "auth_service";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addUser", () => {
    it("should add a user successfully", async () => {
      const mockResponse = { data: { user } };
      axios.post.mockResolvedValue(mockResponse);

      const result = await UserService.addUser(user);

      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.AUTH_REPOSITORY_SERVICE_API_URL}/users/internal`,
        { user },
        {
          headers: {
            [internalServiceHeaderKey]: serviceName,
          },
        }
      );
      expect(result).toEqual(user);
    });

    it("should throw an error if adding a user fails", async () => {
      axios.post.mockRejectedValue(new Error("Request failed"));

      await expect(UserService.addUser(user)).rejects.toThrow("Request failed");
    });
  });

  describe("getUserByUsername", () => {
    it("should fetch a user by username successfully", async () => {
      const mockResponse = { data: { user } };
      axios.get.mockResolvedValue(mockResponse);

      const result = await UserService.getUserByUsername(username);

      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.AUTH_REPOSITORY_SERVICE_API_URL}/users/internal/username/${username}`,
        {
          headers: {
            [internalServiceHeaderKey]: serviceName,
          },
        }
      );
      expect(result).toEqual(user);
    });

    it("should throw an error if fetching user by username fails", async () => {
      axios.get.mockRejectedValue(new Error("Request failed"));

      await expect(UserService.getUserByUsername(username)).rejects.toThrow(
        "Request failed"
      );
    });
  });
});
