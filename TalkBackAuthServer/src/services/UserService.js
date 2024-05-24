import axios from "axios";

class UserService {
  static getUsers = async () => {
    try {
      const url = `${process.env.AUTH_REPOSITORY_SERVER_URL}/users`;
      const response = await axios.get(url);
      return response.data.users;
    } catch (err) {
      console.error("Failed to fetch users from AuthRepositoryServer", err);
      throw err;
    }
  };

  static addUser = async user => {
    try {
      const url = `${process.env.AUTH_REPOSITORY_SERVER_URL}/users`;
      await axios.post(url, { user });
    } catch (err) {
      console.error("Failed to add user to AuthRepositoryServer", err);
      throw err;
    }
  };

  static deleteUser = async userId => {
    try {
      const url = `${process.env.AUTH_REPOSITORY_SERVER_URL}/users/${userId}`;
      await axios.delete(url);
    } catch (err) {
      console.error("Failed to delete user from AuthRepositoryServer", err);
      throw err;
    }
  };

  static getUserByUsername = async username => {
    try {
      const url = `${process.env.AUTH_REPOSITORY_SERVER_URL}/users/username/${username}`;
      console.log(process.env.AUTH_REPOSITORY_SERVER_URL);
      const response = await axios.get(url);
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
      const url = `${process.env.AUTH_REPOSITORY_SERVER_URL}/users/id/${userId}`;
      const response = await axios.get(url);
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
      const url = `${process.env.AUTH_REPOSITORY_SERVER_URL}/users/${user._id}`;
      const response = await axios.put(url, user);
      return response.data;
    } catch (err) {
      console.error("Failed to update user in AuthRepositoryServer", err);
      throw err;
    }
  };
}

export default UserService;
