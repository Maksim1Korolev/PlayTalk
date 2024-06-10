import axios from "axios";

class UserService {
  static repositoryServiceUrl = `${process.env.AUTH_REPOSITORY_SERVICE_URL}/users`;

  static getUsers = async () => {
    try {
      const url = this.repositoryServiceUrl;
      const response = await axios.get(url);
      return response.data.users;
    } catch (err) {
      console.error(
        "Failed to fetch users from auth-repository-service, error:",
        err.message
      );
    }
  };

  static addUser = async user => {
    try {
      const url = this.repositoryServiceUrl;
      const response = await axios.post(url, { user });
      return response.data.user;
    } catch (err) {
      console.error(
        "Failed to add user to auth-repository-service, error:",
        err.message
      );
    }
  };

  static deleteUser = async userId => {
    try {
      const url = `${this.repositoryServiceUrl}/${userId}`;
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
      console.log("this.repositoryServiceUrl");
      console.log(this.repositoryServiceUrl);
      const response = await axios.get(
        `${this.repositoryServiceUrl}/username/${username}`
      );
      console.log(`${this.repositoryServiceUrl}/username/${username}`);
      return response.data.user;
    } catch (err) {
      console.error(
        "Failed to fetch user by username from auth-repository-service, error:",
        err.message
      );
    }
  };

  static getUserById = async userId => {
    try {
      const url = `${this.repositoryServiceUrl}/id/${userId}`;
      const response = await axios.get(url);
      console.log("userId");
      console.log("userId");
      console.log("userId");
      console.log(userId);

      return response.data.user;
    } catch (err) {
      console.error(
        "Failed to fetch user by ID from auth-repository-service, error:",
        err.message
      );
    }
  };

  static updateUser = async user => {
    try {
      const url = `${this.repositoryServiceUrl}/${user._id}`;
      const response = await axios.put(url, user);
      return response.data.user;
    } catch (err) {
      console.error(
        "Failed to update user in auth-repository-service, error:",
        err.message
      );
    }
  };
}

export default UserService;
