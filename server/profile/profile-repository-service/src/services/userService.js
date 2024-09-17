import mongoose from "mongoose";

import User from "../schemas/User.js";
import { getLogger } from "../utils/logger.ts";
import redisClient from "../utils/redisClient.ts";
import S3 from "../utils/s3Client.ts";
const logger = getLogger("UserService");

class UserService {
  static async getAvatarUrl(avatarFileName) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || "testforavatars",
      Key: avatarFileName,
      Expires: 3600, // 1 hour expiration for presigned URL
    };
    return S3.getSignedUrlPromise("getObject", params);
  }

  // Return users with avatar URLs
  static async getUsers() {
    const cachedUsers = await redisClient.get(process.env.REDIS_USERS_KEY);
    if (cachedUsers) {
      logger.info("Fetched users from Redis cache.");
      return JSON.parse(cachedUsers);
    }

    const users = await User.find(); // Exclude password
    const usersWithAvatars = await Promise.all(
      users.map(async user => {
        const avatarUrl = await UserService.getAvatarUrl(user.avatarFileName);
        return { ...user.toObject(), avatarUrl };
      })
    );

    await redisClient.set(
      process.env.REDIS_USERS_KEY,
      JSON.stringify(usersWithAvatars),
      {
        EX: 3600,
      }
    );
    logger.info("Fetched users from database and cached in Redis.");
    return usersWithAvatars;
  }

  static async addUser(user) {
    const newUser = await User.create(user);
    await redisClient.del(process.env.REDIS_USERS_KEY);
    logger.info(`Added new user: ${newUser._id}`);
    return newUser;
  }

  static async deleteUser(id) {
    if (!id) {
      throw new Error("Invalid user ID");
    }

    const deletedUser = await User.findByIdAndDelete(id);
    await redisClient.del(process.env.REDIS_USERS_KEY);
    logger.info(`Deleted user: ${id}`);
    return deletedUser;
  }

  static async getUserByUsername(username) {
    const cacheKey = `user:username:${username}`;
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
  }

  static async getUserById(id) {
    const cacheKey = `user:id:${id}`;
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
  }

  static async updateUser(user) {
    if (!user._id) {
      throw new Error("Invalid user ID");
    }

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
  }
}

export default UserService;
