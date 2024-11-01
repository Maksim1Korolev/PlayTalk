import axios from "axios";

import { getLogger } from "../utils/logger.js";

import redisClient from "../utils/redisClient.js";

const logger = getLogger("UserService");

const repositoryServiceUrl = `${process.env.AUTH_SERVICE_API_URL}/users/internal`;
const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
const serviceName = "game_gateway_service";

class UserService {
  static async getUserById(userId) {
    if (!userId) {
      const error = "Invalid user ID";
      logger.error(error);
      throw new Error(error);
    }

    try {
      const cachedUser = await redisClient.hGet(
        process.env.REDIS_USERS_ID_KEY,
        userId
      );
      if (cachedUser) {
        logger.info(`Cache hit for user ID: ${userId}`);
        return JSON.parse(cachedUser);
      }

      logger.info(
        `Cache miss for user ID: ${userId}, fetching from repository service`
      );
      const url = `${repositoryServiceUrl}/id/${userId}`;
      const response = await axios.get(url, {
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      });

      const user = response.data.user;

      if (user) {
        await redisClient.hSet(
          process.env.REDIS_USERS_ID_KEY,
          userId,
          JSON.stringify(user),
          {
            EX: 3600,
          }
        );
        logger.info(`User data cached for ID: ${userId}`);
      }

      return user;
    } catch (error) {
      logger.error(`Error fetching user by ID: ${userId} - ${error.message}`);
      throw new Error("Failed to fetch user data");
    }
  }
}

export default UserService;
