import axios from "axios";

const repositoryServiceUrl = `${process.env.AUTH_REPOSITORY_SERVICE_URL}/users/internal`;
const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
const serviceName = "auth_service";

class UserService {
  static addUser = async user => {
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
    return response.data.user;
  };

  static getUserByUsername = async username => {
    const response = await axios.get(
      `${repositoryServiceUrl}/username/${username}`,
      {
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      }
    );

    return response.data.user;
  };
}

export default UserService;
