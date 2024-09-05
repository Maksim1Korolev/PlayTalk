import axios from "axios";

const repositoryServiceUrl = `${process.env.AUTH_REPOSITORY_SERVICE_URL}/users`;

export class UserService {
  static getUsers = async () => {
    const url = repositoryServiceUrl;
    const response = await axios.get(url);
    return response.data.users;
  };

  static addUser = async user => {
    const url = repositoryServiceUrl;
    const response = await axios.post(url, { user });
    return response.data.user;
  };

  static deleteUser = async userId => {
    const url = `${repositoryServiceUrl}/${userId}`;
    const response = await axios.delete(url);
    return response.data.user;
  };

  static getUserByUsername = async username => {
    const response = await axios.get(
      `${repositoryServiceUrl}/username/${username}`
    );
    return response.data.user;
  };

  static getUserById = async userId => {
    const url = `${repositoryServiceUrl}/id/${userId}`;
    const response = await axios.get(url);
    return response.data.user;
  };

  static updateUser = async user => {
    const url = `${repositoryServiceUrl}/${user._id}`;
    const response = await axios.put(url, user);
    return response.data.user;
  };
}
