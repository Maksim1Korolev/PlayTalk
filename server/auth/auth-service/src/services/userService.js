import axios from "axios";

import { getLogger } from "../utils/logger.js";
const logger = getLogger("UserService");

const repositoryServiceUrl = `${process.env.AUTH_REPOSITORY_SERVICE_URL}/users/internal`;
const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
const serviceName = "auth_service";

class UserService {
  static addUser = async user => {
    logger.info(`Adding user: ${user.username}`);
    const url = repositoryServiceUrl;
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
  };

  static getUserByUsername = async username => {
    logger.info(`Fetching user by username: ${username}`);
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
  };
}

export default UserService;
