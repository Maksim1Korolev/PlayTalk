import User from "../../models/User.js";

class UserService {
  async addUser(user) {
    const addedUser = await User.create({ ...user });
    return addedUser;
  }

  async getUsers() {
    const users = await User.find();
    return users;
  }
  async getUserByUsername(username) {
    if (!username) {
      throw new Error("Username is not specified");
    }

    const user = await User.findOne({ username: username });
    return user;
  }
  async getUserById(userId) {
    if (!userId) {
      throw new Error("ID is not specified");
    }

    const user = await User.findOne({ _id: userId });
    return user;
  }
  async updateUser(user) {
    if (!user._id) {
      throw new Error("ID is not specified");
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, user, {
      new: true,
    });

    return updatedUser;
  }
  async deleteUser(id) {
    if (!id) {
      throw new Error("ID is not specified");
    }

    const deletedUser = await User.findByIdAndDelete(id);

    return deletedUser;
  }
}

export default new UserService();
