import axios from "axios";

import { getLogger } from "../utils/logger.js";

import redisClient from "../utils/redisClient.js";

const logger = getLogger("UserService");

const repositoryServiceUrl = `${process.env.AUTH_SERVICE_API_URL}/users/internal`;
const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
const serviceName = "game_gateway_service";

class UserService {
  static async isUserRegistered(username) {
    if (!username) {
      const error = "Invalid username";
      logger.error(error);
      throw new Error(error);
    }

    try {
      const cacheKey = process.env.REDIS_USERS_USERNAME_KEY;
      const cachedUser = await redisClient.hGet(cacheKey, username);

      if (cachedUser) {
        logger.info(`Cache hit for username: ${username}`);
        return true;
      }

      logger.info(
        `Cache miss for username: ${username}, fetching from repository service`
      );

      const url = `${repositoryServiceUrl}/isRegistered/${username}`;
      const response = await axios.get(url, {
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      });

      const userExists = response.data.isRegistered;

      if (userExists) {
        await redisClient.hSet(cacheKey, username, JSON.stringify(userExists), {
          EX: 3600,
        });
        logger.info(
          `User registration status cached for username: ${username}`
        );
      }

      return userExists;
    } catch (error) {
      logger.error(
        `Error checking if user is registered by username: ${username} - ${error.message}`
      );
      throw new Error("Failed to check user registration status");
    }
  }
}

export default UserService;
