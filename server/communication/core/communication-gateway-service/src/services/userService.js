import axios from "axios";

const repositoryServiceUrl = `${process.env.AUTH_REPOSITORY_SERVICE_URL}/users`;

class UserService {
  static getUserById = async userId => {
    const url = `${repositoryServiceUrl}/id/${userId}`;
    const response = await axios.get(url);
    return response.data.user;
  };
}

export default UserService;
