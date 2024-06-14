import redisClient from "../utils/redisClient.js";
import User from "../models/User.js";
import mongoose from "mongoose";

class UserService {
  static USERS_CACHE_KEY = "users";

  static async getUsers() {
    const cachedUsers = await redisClient.get(this.USERS_CACHE_KEY);
    if (cachedUsers) {
      return JSON.parse(cachedUsers);
    }

    const users = await User.find();
    await redisClient.set(this.USERS_CACHE_KEY, JSON.stringify(users), {
      EX: 3600,
    });
    return users;
  }

  static async addUser(user) {
    const newUser = await User.create(user);
    await redisClient.del(this.USERS_CACHE_KEY);
    return newUser;
  }

  static async deleteUser(id) {
    if (!id) {
      throw new Error("Invalid user ID");
    }
    const deletedUser = await User.findByIdAndDelete(id);
    await redisClient.del(this.USERS_CACHE_KEY);
    return deletedUser;
  }

  static async getUserByUsername(username) {
    const cacheKey = `user:username:${username}`;
    const cachedUser = await redisClient.get(cacheKey);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await User.findOne({ username });
    if (user) {
      await redisClient.set(cacheKey, JSON.stringify(user), {
        EX: 3600,
      });
    }
    return user;
  }

  static async getUserById(id) {
    const cacheKey = `user:id:${id}`;
    const cachedUser = await redisClient.get(cacheKey);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(id);
    if (user) {
      await redisClient.set(cacheKey, JSON.stringify(user), {
        EX: 3600,
      });
    }
    return user;
  }

  static async updateUser(user) {
    if (!user._id) {
      throw new Error("Invalid user ID");
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, user, {
      new: true,
    });
    await redisClient.del(this.USERS_CACHE_KEY);
    if (updatedUser) {
      await redisClient.del(`user:id:${updatedUser._id}`);
      await redisClient.del(`user:username:${updatedUser.username}`);
    }
    return updatedUser;
  }
}

export default UserService;
