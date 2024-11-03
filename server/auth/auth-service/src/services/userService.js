import mongoose from "mongoose";

import { getLogger } from "../utils/logger.js";

import redisClient from "../utils/redisClient.js";

import User from "../schemas/User.js";

const logger = getLogger("UserService");

class UserService {
  static async addUser(user) {
    try {
      const addedUser = await User.create({ ...user });

      await redisClient.hSet(
        process.env.REDIS_USERS_USERNAME_KEY,
        addedUser.username,
        JSON.stringify(addedUser)
      );

      logger.info(`User added: ${addedUser.username}`);
      return addedUser;
    } catch (error) {
      logger.error(`Error adding user: ${error.message}`);
      throw new Error("Failed to add user");
    }
  }

  static async getUsers() {
    try {
      const cachedUsers = await redisClient.hGetAll(
        process.env.REDIS_USERS_USERNAME_KEY
      );

      if (cachedUsers && Object.keys(cachedUsers).length > 0) {
        logger.info("Fetched users from Redis cache.");
        return Object.values(cachedUsers).map(user => {
          const { password, ...userWithoutPassword } = JSON.parse(user);
          return userWithoutPassword;
        });
      }

      const users = await User.find({}, "-password");
      for (const user of users) {
        await redisClient.hSet(
          process.env.REDIS_USERS_USERNAME_KEY,
          user.username,
          JSON.stringify(user)
        );
      }
      logger.info("Fetched users from database and cached in Redis.");
      return users;
    } catch (error) {
      logger.error(`Error fetching users: ${error.message}`);
      throw new Error("Failed to fetch users");
    }
  }

  static async getUserById(id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      const error = "Invalid user ID";
      logger.error(error);
      throw new Error(error);
    }

    try {
      const cachedUser = await redisClient.hGet(
        process.env.REDIS_USERS_ID_KEY,
        id
      );

      if (cachedUser) {
        logger.info(`Cache hit for user with ID: ${id}`);
        const { password, ...userWithoutPassword } = JSON.parse(cachedUser);
        return userWithoutPassword;
      }

      const user = await User.findById(id).select("-password");
      if (user) {
        await redisClient.hSet(
          process.env.REDIS_USERS_ID_KEY,
          user._id.toString(),
          JSON.stringify(user)
        );
        logger.info(`Fetched and cached user with ID: ${id}`);
      }
      return user;
    } catch (error) {
      logger.error(`Error fetching user by ID: ${error.message}`);
      throw new Error("Failed to fetch user by ID");
    }
  }

  static async getUserByUsername(username) {
    try {
      const cachedUser = await redisClient.hGet(
        process.env.REDIS_USERS_USERNAME_KEY,
        username
      );

      if (cachedUser) {
        logger.info(`Cache hit for user: ${username}`);
        const { password, ...userWithoutPassword } = JSON.parse(cachedUser);
        return userWithoutPassword;
      }

      const user = await User.findOne({ username }).select("-password");
      if (user) {
        await redisClient.hSet(
          process.env.REDIS_USERS_USERNAME_KEY,
          username,
          JSON.stringify(user)
        );
        logger.info(`Fetched and cached user: ${username}`);
      }

      return user;
    } catch (error) {
      logger.error(`Error fetching user by username: ${error.message}`);
      throw new Error("Failed to fetch user by username");
    }
  }

  static async updateUser(user) {
    if (!user._id) {
      const error = "Invalid user ID";
      logger.error(error);
      throw new Error(error);
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(user._id, user, {
        new: true,
      }).select("-password");

      if (updatedUser) {
        await redisClient.hSet(
          process.env.REDIS_USERS_USERNAME_KEY,
          updatedUser.username,
          JSON.stringify(updatedUser)
        );
        await redisClient.hSet(
          process.env.REDIS_USERS_ID_KEY,
          updatedUser._id.toString(),
          JSON.stringify(updatedUser)
        );
        logger.info(`Updated and cached user: ${updatedUser.username}`);
      }

      return updatedUser;
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      throw new Error("Failed to update user");
    }
  }

  static async deleteUser(id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      const error = "Invalid user ID";
      logger.error(error);
      throw new Error(error);
    }

    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (deletedUser) {
        await redisClient.hDel(
          process.env.REDIS_USERS_USERNAME_KEY,
          deletedUser.username
        );
        await redisClient.hDel(process.env.REDIS_USERS_ID_KEY, deletedUser._id);
        logger.info(`Deleted user: ${deletedUser.username}`);
      }
      return deletedUser;
    } catch (error) {
      logger.error(`Error deleting user: ${error.message}`);
      throw new Error("Failed to delete user");
    }
  }
}

export default UserService;
