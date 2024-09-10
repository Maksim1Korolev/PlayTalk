import axios from "axios";
import redisClient from "../utils/redisClient.js";

const repositoryServiceUrl = `${process.env.AUTH_REPOSITORY_SERVICE_URL}/users`;

class UserService {
  static getUserById = async userId => {
    const cacheKey = `user:id:${userId}`;

    const cachedUser = await redisClient.get(cacheKey);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const url = `${repositoryServiceUrl}/id/${userId}`;
    const response = await axios.get(url);

    const user = response.data.user;

    if (user) {
      await redisClient.set(cacheKey, JSON.stringify(user), {
        EX: 3600,
      });
    }

    return user;
  };
}

export default UserService;
