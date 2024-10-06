import axios from "axios";

import { getLogger } from "../utils/logger.js";
const logger = getLogger("UserService");

const repositoryServiceUrl = `${process.env.AUTH_REPOSITORY_SERVICE_URL}/users/internal`;
const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
const serviceName = "auth_service";

class UserService {
  static async addUser(user) {
    logger.info(`Adding user: ${user.username}`);
    const url = repositoryServiceUrl;
    try {
      const response = await axios.post(
        url,
        { user },
        {
          headers: {
            [internalServiceHeaderKey]: serviceName,
          },
        }
      );
      logger.info(`User added successfully: ${user.username}`);
      return response.data.user;
    } catch (error) {
      logger.error(`Error adding user: ${user.username} - ${error.message}`);
      throw error;
    }
  }

  static async getUserByUsername(username) {
    logger.info(`Fetching user by username: ${username}`);
    try {
      const response = await axios.get(
        `${repositoryServiceUrl}/username/${username}`,
        {
          headers: {
            [internalServiceHeaderKey]: serviceName,
          },
        }
      );
      logger.info(`User fetched successfully: ${username}`);
      return response.data.user;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        logger.info(`User not found: ${username}`);
        return null;
      }
      logger.error(
        `Error fetching user by username: ${username} - ${error.message}`
      );
      throw error;
    }
  }
}

export default UserService;
