import axios from "axios";

class UserService {
  static repositoryServiceUrl = `${process.env.AUTH_REPOSITORY_SERVICE_URL}/users`;

  static getUsers = async () => {
    const url = this.repositoryServiceUrl;
    const response = await axios.get(url);
    return response.data.users;
  };

  static addUser = async user => {
    const url = this.repositoryServiceUrl;
    const response = await axios.post(url, { user });
    return response.data.user;
  };

  static deleteUser = async userId => {
    const url = `${this.repositoryServiceUrl}/${userId}`;
    const response = await axios.delete(url);
    return response.data.user;
  };

  static getUserByUsername = async username => {
    const response = await axios.get(
      `${this.repositoryServiceUrl}/username/${username}`
    );
    return response.data.user;
  };

  static getUserById = async userId => {
    const url = `${this.repositoryServiceUrl}/id/${userId}`;
    const response = await axios.get(url);
    return response.data.user;
  };

  static updateUser = async user => {
    const url = `${this.repositoryServiceUrl}/${user._id}`;
    const response = await axios.put(url, user);
    return response.data.user;
  };
}

export default UserService;
