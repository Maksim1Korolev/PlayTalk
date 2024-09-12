import mongoose from "mongoose";

import redisClient from "../utils/redisClient.js";
import { getLogger } from "../utils/logger.js";
const logger = getLogger("UserService");

import User from "../schemas/User.js";

class UserService {
  static async getUsers() {
    try {
      const cachedUsers = await redisClient.get(process.env.REDIS_USERS_KEY);
      if (cachedUsers) {
        logger.info("Fetched users from Redis cache.");
        return JSON.parse(cachedUsers);
      }

      const users = await User.find();
      await redisClient.set(
        process.env.REDIS_USERS_KEY,
        JSON.stringify(users),
        {
          EX: 3600,
        }
      );
      logger.info("Fetched users from database and cached in Redis.");
      return users;
    } catch (error) {
      logger.error(`Error fetching users: ${error.message}`);
      throw new Error("Failed to fetch users.");
    }
  }

  static async addUser(user) {
    try {
      const newUser = await User.create(user);
      await redisClient.del(process.env.REDIS_USERS_KEY);
      logger.info(`Added new user: ${newUser._id}`);
      return newUser;
    } catch (error) {
      logger.error(`Error adding user: ${error.message}`);
      throw new Error("Failed to add user.");
    }
  }

  static async deleteUser(id) {
    if (!id) {
      throw new Error("Invalid user ID");
    }

    try {
      const deletedUser = await User.findByIdAndDelete(id);
      await redisClient.del(process.env.REDIS_USERS_KEY);
      logger.info(`Deleted user: ${id}`);
      return deletedUser;
    } catch (error) {
      logger.error(`Error deleting user ${id}: ${error.message}`);
      throw new Error("Failed to delete user.");
    }
  }

  static async getUserByUsername(username) {
    const cacheKey = `user:username:${username}`;
    try {
      const cachedUser = await redisClient.get(cacheKey);
      if (cachedUser) {
        logger.info(`Fetched user ${username} from Redis cache.`);
        return JSON.parse(cachedUser);
      }

      const user = await User.findOne({ username });
      if (user) {
        await redisClient.set(cacheKey, JSON.stringify(user), {
          EX: 3600,
        });
        logger.info(
          `Fetched user ${username} from database and cached in Redis.`
        );
      }
      return user;
    } catch (error) {
      logger.error(
        `Error fetching user by username ${username}: ${error.message}`
      );
      throw new Error("Failed to fetch user by username.");
    }
  }

  static async getUserById(id) {
    const cacheKey = `user:id:${id}`;
    try {
      const cachedUser = await redisClient.get(cacheKey);
      if (cachedUser) {
        logger.info(`Fetched user with ID ${id} from Redis cache.`);
        return JSON.parse(cachedUser);
      }

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
      }

      const user = await User.findById(id);
      if (user) {
        await redisClient.set(cacheKey, JSON.stringify(user), {
          EX: 3600,
        });
        logger.info(
          `Fetched user with ID ${id} from database and cached in Redis.`
        );
      }
      return user;
    } catch (error) {
      logger.error(`Error fetching user by ID ${id}: ${error.message}`);
      throw new Error("Failed to fetch user by ID.");
    }
  }

  static async updateUser(user) {
    if (!user._id) {
      throw new Error("Invalid user ID");
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(user._id, user, {
        new: true,
      });
      await redisClient.del(process.env.REDIS_USERS_KEY);
      if (updatedUser) {
        await redisClient.del(`user:id:${updatedUser._id}`);
        await redisClient.del(`user:username:${updatedUser.username}`);
        logger.info(`Updated user: ${updatedUser._id}`);
      }
      return updatedUser;
    } catch (error) {
      logger.error(`Error updating user ${user._id}: ${error.message}`);
      throw new Error("Failed to update user.");
    }
  }
}

export default UserService;
