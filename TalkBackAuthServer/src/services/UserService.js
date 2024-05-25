import axios from "axios";

class UserService {
  static repositoryServerUrl = `${process.env.AUTH_REPOSITORY_SERVER_URL}/users`;

  static getUsers = async () => {
    try {
      const url = this.repositoryServerUrl;
      const response = await axios.get(url);
      return response.data.users;
    } catch (err) {
      console.error("Failed to fetch users from AuthRepositoryServer", err);
      throw err;
    }
  };

  static addUser = async user => {
    try {
      const url = this.repositoryServerUrl;
      const response = await axios.post(url, { user });
      return response.data.user;
    } catch (err) {
      console.error("Failed to add user to AuthRepositoryServer", err);
      throw err;
    }
  };

  static deleteUser = async userId => {
    try {
      const url = `${this.repositoryServerUrl}/${userId}`;
      const response = await axios.delete(url);
      return response.data.user;
    } catch (err) {
      console.error("Failed to delete user from AuthRepositoryServer", err);
      throw err;
    }
  };

  static getUserByUsername = async username => {
    try {
      const response = await axios.get(
        `${this.repositoryServerUrl}/username/${username}`
      );
      console.log(`${this.repositoryServerUrl}/username/${username}`);
      return response.data.user;
    } catch (err) {
      console.error(
        "Failed to fetch user by username from AuthRepositoryServer",
        err
      );
      throw err;
    }
  };

  static getUserById = async userId => {
    try {
      const url = `${this.repositoryServerUrl}/id/${userId}`;
      const response = await axios.get(url);

      return response.data.user;
    } catch (err) {
      console.error(
        "Failed to fetch user by ID from AuthRepositoryServer",
        err
      );
      throw err;
    }
  };

  static updateUser = async user => {
    try {
      const url = `${this.repositoryServerUrl}/${user._id}`;
      const response = await axios.put(url, user);
      return response.data.user;
    } catch (err) {
      console.error("Failed to update user in AuthRepositoryServer", err);
      throw err;
    }
  };
}

export default UserService;
