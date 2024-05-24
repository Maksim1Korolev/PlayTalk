import axios from "axios";

const AUTH_REPOSITORY_URL = process.env.AUTH_REPOSITORY_URL;

class UserService {
  static getUsers = async () => {
    try {
      const response = await axios.get(`${AUTH_REPOSITORY_URL}/users`);
      return response.data.users;
    } catch (err) {
      console.error("Failed to fetch users from AuthRepositoryServer", err);
      throw err;
    }
  };

  static addUser = async user => {
    try {
      await axios.post(`${AUTH_REPOSITORY_URL}/users`, { user });
    } catch (err) {
      console.error("Failed to add user to AuthRepositoryServer", err);
      throw err;
    }
  };

  static deleteUser = async userId => {
    try {
      await axios.delete(`${AUTH_REPOSITORY_URL}/users/${userId}`);
    } catch (err) {
      console.error("Failed to delete user from AuthRepositoryServer", err);
      throw err;
    }
  };

  static getUserByUsername = async username => {
    try {
      const response = await axios.get(
        `${AUTH_REPOSITORY_URL}/users/username/${username}`
      );
      return response.data;
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
      const response = await axios.get(
        `${AUTH_REPOSITORY_URL}/users/id/${userId}`
      );
      return response.data;
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
      const response = await axios.put(
        `${AUTH_REPOSITORY_URL}/users/${user._id}`,
        user
      );
      return response.data;
    } catch (err) {
      console.error("Failed to update user in AuthRepositoryServer", err);
      throw err;
    }
  };
}

export default UserService;
