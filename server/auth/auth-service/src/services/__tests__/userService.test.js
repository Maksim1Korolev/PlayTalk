import redisClient from "../../utils/redisClient";

import User from "../../schemas/User";
import UserService from "../userService";

jest.mock("../../schemas/User");

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addUser", () => {
    it("should add a user and clear Redis cache", async () => {
      const mockUser = { _id: "123", username: "testuser" };
      User.create.mockResolvedValue(mockUser);
      redisClient.del.mockResolvedValue();

      const result = await UserService.addUser(mockUser);

      expect(User.create).toHaveBeenCalledWith(mockUser);
      expect(redisClient.del).toHaveBeenCalledWith(
        process.env.REDIS_USERS_USERNAME_KEY
      );
      expect(redisClient.del).toHaveBeenCalledWith(
        process.env.REDIS_USERS_ID_KEY
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw an error if adding a user fails", async () => {
      User.create.mockRejectedValue(new Error("Database error"));

      await expect(
        UserService.addUser({ username: "testuser" })
      ).rejects.toThrow("Failed to add user");
    });
  });

  describe("getUsers", () => {
    it("should fetch users from Redis cache if available", async () => {
      const cachedUser = JSON.stringify({ _id: "123", username: "testuser" });
      redisClient.hGetAll.mockResolvedValue({ testuser: cachedUser });

      const result = await UserService.getUsers();

      expect(redisClient.hGetAll).toHaveBeenCalledWith(
        process.env.REDIS_USERS_USERNAME_KEY
      );
      expect(result).toEqual([{ _id: "123", username: "testuser" }]);
    });

    it("should fetch users from database if Redis cache is empty and cache them", async () => {
      redisClient.hGetAll.mockResolvedValue({});
      const mockUsers = [{ _id: "123", username: "testuser" }];
      User.find.mockResolvedValue(mockUsers);
      redisClient.hSet.mockResolvedValue();

      const result = await UserService.getUsers();

      expect(User.find).toHaveBeenCalledWith({}, "-password");
      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USERS_USERNAME_KEY,
        "testuser",
        JSON.stringify(mockUsers[0])
      );
      expect(result).toEqual(mockUsers);
    });

    it("should throw an error if fetching users fails", async () => {
      redisClient.hGetAll.mockRejectedValue(new Error("Redis error"));

      await expect(UserService.getUsers()).rejects.toThrow(
        "Failed to fetch users"
      );
    });
  });

  describe("getUserByUsername", () => {
    it("should fetch a user from the database if not in Redis cache and cache it", async () => {
      const username = "testuser";
      const mockUser = { _id: "123", username: "testuser" };

      redisClient.hGet.mockResolvedValue(null);

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      redisClient.hSet.mockResolvedValue("OK");

      const result = await UserService.getUserByUsername(username);

      expect(redisClient.hGet).toHaveBeenCalledWith(
        process.env.REDIS_USERS_USERNAME_KEY,
        username
      );
      expect(User.findOne).toHaveBeenCalledWith({ username });
      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USERS_USERNAME_KEY,
        username,
        JSON.stringify(mockUser)
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe("getUserWithPassword", () => {
    it("should fetch a user with password by username", async () => {
      const mockUser = {
        _id: "123",
        username: "testuser",
        password: "hashedPassword",
      };
      User.findOne.mockResolvedValue(mockUser);

      const result = await UserService.getUserWithPassword("testuser");

      expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(result).toEqual(mockUser);
    });

    it("should throw an error if fetching user with password fails", async () => {
      User.findOne.mockRejectedValue(new Error("Database error"));

      await expect(UserService.getUserWithPassword("testuser")).rejects.toThrow(
        "Failed to fetch user with password by username"
      );
    });
  });
});
