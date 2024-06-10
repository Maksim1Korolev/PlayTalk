import axios from "axios";

class UserService {
  static repositoryServerUrl = `${process.env.AUTH_REPOSITORY_SERVER_URL}/users`;

  static getUsers = async () => {
    try {
      const url = this.repositoryServerUrl;
      const response = await axios.get(url);
      return response.data.users;
    } catch (err) {
      console.error(
        "Failed to fetch users from auth-repository-service",
        err.message
      );
    }
  };

  static addUser = async user => {
    try {
      const url = this.repositoryServerUrl;
      const response = await axios.post(url, { user });
      return response.data.user;
    } catch (err) {
      console.error(
        "Failed to add user to auth-repository-service",
        err.message
      );
    }
  };

  static deleteUser = async userId => {
    try {
      const url = `${this.repositoryServerUrl}/${userId}`;
      const response = await axios.delete(url);
      return response.data.user;
    } catch (err) {
      console.error(
        "Failed to delete user from auth-repository-service",
        err.message
      );
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
        "Failed to fetch user by username from auth-repository-service",
        err.message
      );
    }
  };

  static getUserById = async userId => {
    try {
      const url = `${this.repositoryServerUrl}/id/${userId}`;
      const response = await axios.get(url);
      console.log("userId");
      console.log("userId");
      console.log("userId");
      console.log(userId);

      return response.data.user;
    } catch (err) {
      console.error(
        "Failed to fetch user by ID from auth-repository-service",
        err.message
      );
    }
  };

  static updateUser = async user => {
    try {
      const url = `${this.repositoryServerUrl}/${user._id}`;
      const response = await axios.put(url, user);
      return response.data.user;
    } catch (err) {
      console.error(
        "Failed to update user in auth-repository-service",
        err.message
      );
    }
  };
}

export default UserService;
