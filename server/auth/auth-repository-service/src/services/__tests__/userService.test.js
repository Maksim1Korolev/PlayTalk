import redisClient from "../../utils/redisClient.js";
import User from "../../schemas/User.js";
import UserService from "../userService.js";

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    it("should fetch users from Redis cache if available", async () => {
      const cachedUsers = JSON.stringify([{ username: "testUser" }]);
      redisClient.get.mockResolvedValue(cachedUsers);

      const result = await UserService.getUsers();

      expect(redisClient.get).toHaveBeenCalledWith(process.env.REDIS_USERS_KEY);
      expect(result).toEqual([{ username: "testUser" }]);
    });

    it("should fetch users from the database if not cached", async () => {
      redisClient.get.mockResolvedValue(null);
      const users = [{ username: "testUser" }];
      User.find.mockResolvedValue(users);

      const result = await UserService.getUsers();

      expect(redisClient.get).toHaveBeenCalledWith(process.env.REDIS_USERS_KEY);
      expect(User.find).toHaveBeenCalled();
      expect(result).toEqual(users);
      expect(redisClient.set).toHaveBeenCalledWith(
        process.env.REDIS_USERS_KEY,
        JSON.stringify(users),
        { EX: 3600 }
      );
    });
  });

  describe("addUser", () => {
    it("should add a new user and clear the Redis cache", async () => {
      const newUser = { _id: "123", username: "testUser" };
      User.create.mockResolvedValue(newUser);

      const result = await UserService.addUser(newUser);

      expect(User.create).toHaveBeenCalledWith(newUser);
      expect(redisClient.del).toHaveBeenCalledWith(process.env.REDIS_USERS_KEY);
      expect(result).toEqual(newUser);
    });
  });

  describe("deleteUser", () => {
    it("should delete a user and clear the Redis cache", async () => {
      const id = "123";
      const deletedUser = { _id: id, username: "testUser" };
      User.findByIdAndDelete.mockResolvedValue(deletedUser);

      const result = await UserService.deleteUser(id);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(redisClient.del).toHaveBeenCalledWith(process.env.REDIS_USERS_KEY);
      expect(result).toEqual(deletedUser);
    });

    it("should throw an error if no id is provided", async () => {
      await expect(UserService.deleteUser()).rejects.toThrow("Invalid user ID");
    });
  });

  describe("getUserByUsername", () => {
    it("should fetch a user by username from Redis cache if available", async () => {
      const cachedUser = JSON.stringify({ username: "testUser" });
      redisClient.get.mockResolvedValue(cachedUser);

      const result = await UserService.getUserByUsername("testUser");

      expect(redisClient.get).toHaveBeenCalledWith("user:username:testUser");
      expect(result).toEqual({ username: "testUser" });
    });

    it("should fetch a user by username from the database if not cached", async () => {
      redisClient.get.mockResolvedValue(null);
      const user = { username: "testUser" };
      User.findOne.mockResolvedValue(user);

      const result = await UserService.getUserByUsername("testUser");

      expect(redisClient.get).toHaveBeenCalledWith("user:username:testUser");
      expect(User.findOne).toHaveBeenCalledWith({ username: "testUser" });
      expect(redisClient.set).toHaveBeenCalledWith(
        "user:username:testUser",
        JSON.stringify(user),
        { EX: 3600 }
      );
      expect(result).toEqual(user);
    });
  });

  describe("getUserById", () => {
    it("should fetch a user by ID from Redis cache if available", async () => {
      const cachedUser = JSON.stringify({ _id: "123", username: "testUser" });
      redisClient.get.mockResolvedValue(cachedUser);

      const result = await UserService.getUserById("123");

      expect(redisClient.get).toHaveBeenCalledWith("user:id:123");
      expect(result).toEqual({ _id: "123", username: "testUser" });
    });

    it("should fetch a user by ID from the database if not cached", async () => {
      redisClient.get.mockResolvedValue(null);
      const user = { _id: "123", username: "testUser" };
      User.findById.mockResolvedValue(user);

      const result = await UserService.getUserById("123");

      expect(redisClient.get).toHaveBeenCalledWith("user:id:123");
      expect(User.findById).toHaveBeenCalledWith("123");
      expect(redisClient.set).toHaveBeenCalledWith(
        "user:id:123",
        JSON.stringify(user),
        { EX: 3600 }
      );
      expect(result).toEqual(user);
    });

    it("should throw an error if the ID is invalid", async () => {
      await expect(UserService.getUserById("invalidId")).rejects.toThrow(
        "Invalid user ID"
      );
    });
  });

  describe("updateUser", () => {
    it("should update a user and clear the Redis cache", async () => {
      const user = { _id: "123", username: "updatedUser" };
      const updatedUser = { _id: "123", username: "updatedUser" };
      User.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await UserService.updateUser(user);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(user._id, user, {
        new: true,
      });
      expect(redisClient.del).toHaveBeenCalledWith(process.env.REDIS_USERS_KEY);
      expect(redisClient.del).toHaveBeenCalledWith("user:id:123");
      expect(redisClient.del).toHaveBeenCalledWith("user:username:updatedUser");
      expect(result).toEqual(updatedUser);
    });

    it("should throw an error if no ID is provided", async () => {
      await expect(UserService.updateUser({})).rejects.toThrow(
        "Invalid user ID"
      );
    });
  });
});
