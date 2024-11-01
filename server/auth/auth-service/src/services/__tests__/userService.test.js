import mongoose from "mongoose";

import redisClient from "../../utils/redisClient.js";

import User from "../../schemas/User.js";
import UserService from "../userService.js";

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mongoose.Types.ObjectId.isValid = jest.fn(
      id => typeof id === "string" && id.length === 24
    );
  });

  describe("addUser", () => {
    it("should add a user and cache it in Redis", async () => {
      const userData = { username: "testUser" };
      const addedUser = { ...userData, _id: "507f1f77bcf86cd799439011" };

      User.create.mockResolvedValue(addedUser);
      redisClient.hSet.mockResolvedValue();

      const result = await UserService.addUser(userData);

      expect(User.create).toHaveBeenCalledWith({ ...userData });
      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USERS_USERNAME_KEY,
        addedUser.username,
        JSON.stringify(addedUser)
      );
      expect(result).toEqual(addedUser);
    });

    it("should throw an error if adding a user fails", async () => {
      const userData = { username: "testUser" };

      User.create.mockRejectedValue(new Error("Database error"));

      await expect(UserService.addUser(userData)).rejects.toThrow(
        "Failed to add user"
      );
    });
  });

  describe("getUsers", () => {
    it("should return users from Redis cache if available", async () => {
      const cachedUsers = {
        user1: JSON.stringify({ username: "user1" }),
        user2: JSON.stringify({ username: "user2" }),
      };
      redisClient.hGetAll.mockResolvedValue(cachedUsers);

      const result = await UserService.getUsers();

      expect(redisClient.hGetAll).toHaveBeenCalledWith(
        process.env.REDIS_USERS_USERNAME_KEY
      );
      expect(result).toEqual([{ username: "user1" }, { username: "user2" }]);
    });

    it("should fetch users from the database if not cached and cache them in Redis", async () => {
      redisClient.hGetAll.mockResolvedValue({});
      const users = [
        { _id: "507f1f77bcf86cd799439011", username: "user1" },
        { _id: "507f1f77bcf86cd799439012", username: "user2" },
      ];
      User.find.mockResolvedValue(users);
      redisClient.hSet.mockResolvedValue();

      const result = await UserService.getUsers();

      expect(User.find).toHaveBeenCalled();
      for (const user of users) {
        expect(redisClient.hSet).toHaveBeenCalledWith(
          process.env.REDIS_USERS_USERNAME_KEY,
          user.username,
          JSON.stringify(user)
        );
      }
      expect(result).toEqual(users);
    });

    it("should throw an error if fetching users fails", async () => {
      redisClient.hGetAll.mockRejectedValue(new Error("Redis error"));

      await expect(UserService.getUsers()).rejects.toThrow(
        "Failed to fetch users"
      );
    });
  });

  describe("getUserById", () => {
    it("should return a user from Redis cache if available", async () => {
      const cachedUser = JSON.stringify({
        _id: "507f1f77bcf86cd799439011",
        username: "user1",
      });
      redisClient.hGet.mockResolvedValue(cachedUser);

      const result = await UserService.getUserById("507f1f77bcf86cd799439011");

      expect(redisClient.hGet).toHaveBeenCalledWith(
        process.env.REDIS_USERS_ID_KEY,
        "507f1f77bcf86cd799439011"
      );
      expect(result).toEqual(JSON.parse(cachedUser));
    });

    it("should fetch a user from the database if not cached and cache it in Redis", async () => {
      redisClient.hGet.mockResolvedValue(null);
      const user = { _id: "507f1f77bcf86cd799439011", username: "user1" };
      User.findById.mockResolvedValue(user);
      redisClient.hSet.mockResolvedValue();

      const result = await UserService.getUserById("507f1f77bcf86cd799439011");

      expect(User.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USERS_ID_KEY,
        user._id.toString(),
        JSON.stringify(user)
      );
      expect(result).toEqual(user);
    });

    it("should throw an error if user ID is invalid", async () => {
      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      await expect(UserService.getUserById("invalidId")).rejects.toThrow(
        "Invalid user ID"
      );
    });

    it("should throw an error if fetching user by ID fails", async () => {
      redisClient.hGet.mockRejectedValue(new Error("Redis error"));

      await expect(
        UserService.getUserById("507f1f77bcf86cd799439011")
      ).rejects.toThrow("Failed to fetch user by ID");
    });
  });

  describe("getUserByUsername", () => {
    it("should return a user from Redis cache if available", async () => {
      const cachedUser = JSON.stringify({
        _id: "507f1f77bcf86cd799439011",
        username: "user1",
      });
      redisClient.hGet.mockResolvedValue(cachedUser);

      const result = await UserService.getUserByUsername("user1");

      expect(redisClient.hGet).toHaveBeenCalledWith(
        process.env.REDIS_USERS_USERNAME_KEY,
        "user1"
      );
      expect(result).toEqual(JSON.parse(cachedUser));
    });

    it("should fetch a user from the database if not cached and cache it in Redis", async () => {
      redisClient.hGet.mockResolvedValue(null);
      const user = { _id: "507f1f77bcf86cd799439011", username: "user1" };
      User.findOne.mockResolvedValue(user);
      redisClient.hSet.mockResolvedValue();

      const result = await UserService.getUserByUsername("user1");

      expect(User.findOne).toHaveBeenCalledWith({ username: "user1" });
      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USERS_USERNAME_KEY,
        "user1",
        JSON.stringify(user)
      );
      expect(result).toEqual(user);
    });

    it("should throw an error if fetching user by username fails", async () => {
      redisClient.hGet.mockRejectedValue(new Error("Redis error"));

      await expect(UserService.getUserByUsername("user1")).rejects.toThrow(
        "Failed to fetch user by username"
      );
    });
  });

  describe("updateUser", () => {
    it("should update a user and cache the result in Redis", async () => {
      const userData = {
        _id: "507f1f77bcf86cd799439011",
        username: "updatedUser",
      };
      const updatedUser = { ...userData };

      User.findByIdAndUpdate.mockResolvedValue(updatedUser);
      redisClient.hSet.mockResolvedValue();

      const result = await UserService.updateUser(userData);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        userData._id,
        userData,
        { new: true }
      );
      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USERS_USERNAME_KEY,
        updatedUser.username,
        JSON.stringify(updatedUser)
      );
      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USERS_ID_KEY,
        updatedUser._id.toString(),
        JSON.stringify(updatedUser)
      );
      expect(result).toEqual(updatedUser);
    });

    it("should throw an error if updating user fails", async () => {
      User.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

      await expect(
        UserService.updateUser({ _id: "507f1f77bcf86cd799439011" })
      ).rejects.toThrow("Failed to update user");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user and remove it from Redis cache", async () => {
      const user = { _id: "507f1f77bcf86cd799439011", username: "user1" };

      User.findByIdAndDelete.mockResolvedValue(user);
      redisClient.hDel.mockResolvedValue();

      const result = await UserService.deleteUser("507f1f77bcf86cd799439011");

      expect(User.findByIdAndDelete).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011"
      );
      expect(redisClient.hDel).toHaveBeenCalledWith(
        process.env.REDIS_USERS_USERNAME_KEY,
        user.username
      );
      expect(redisClient.hDel).toHaveBeenCalledWith(
        process.env.REDIS_USERS_ID_KEY,
        user._id
      );
      expect(result).toEqual(user);
    });
  });
});
