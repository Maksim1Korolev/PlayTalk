import axios from "axios";

const repositoryServiceUrl = `${process.env.AUTH_REPOSITORY_SERVICE_URL}/users`;

class UserService {
  static addUser = async user => {
    const url = repositoryServiceUrl;
    const response = await axios.post(url, { user });
    return response.data.user;
  };

  static getUserByUsername = async username => {
    const response = await axios.get(
      `${repositoryServiceUrl}/username/${username}`
    );
    return response.data.user;
  };
}

export default UserService;
