import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";

export const getFolderFullPath = folderPath => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return path.join(__dirname, folderPath);
};

class UserService {
  static avatars = [];

  static loadAvatars() {
    const avatarDirectory = getFolderFullPath("../../public/avatars");
    this.avatars = fs.readdirSync(avatarDirectory).map(file => `/${file}`);
    console.log(this.avatars);
  }

  static getRandomAvatar() {
    const randomIndex = Math.floor(Math.random() * this.avatars.length);
    return this.avatars[randomIndex];
  }

  static async addUser({ username, password, avatarFileName }) {
    const user = await User.create({
      username,
      password,
      avatarFileName: avatarFileName || this.getRandomAvatar(),
    });
    //await user.save()
    return user;
  }

  static async getUsers() {
    const users = await User.find();
    return users;
  }
  static async getUserByUsername(username) {
    if (!username) {
      throw new Error("Username is not specified");
    }

    const user = await User.findOne({ username });
    return user;
  }
  static async getUserById(userId) {
    if (!userId) {
      throw new Error("ID is not specified");
    }

    const user = await User.findOne({ _id: userId });
    return user;
  }
  static async updateUser(user) {
    if (!user._id) {
      throw new Error("ID is not specified");
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, user, {
      new: true,
    });

    return updatedUser;
  }
  static async deleteUser(id) {
    if (!id) {
      throw new Error("ID is not specified");
    }

    const deletedUser = await User.findByIdAndDelete(id);

    return deletedUser;
  }
}

export default UserService;
