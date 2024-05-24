import User from "../models/User.js";
import UserService from "../services/UserService.js";

export const loadLocalData = async () => {
  try {
    const users = await User.find({});
    UserService.loadUsers(users);
    console.log("Local data loaded from MongoDB Atlas");
  } catch (err) {
    console.error("Failed to load local data from MongoDB Atlas", err);
  }
};

export const syncWithAtlas = async () => {
  try {
    const users = UserService.getUsers();
    await User.bulkWrite(
      users.map(user => ({
        updateOne: {
          filter: { _id: user._id },
          update: user,
          upsert: true,
        },
      }))
    );
    console.log("Data synchronized with MongoDB Atlas");
  } catch (err) {
    console.error("Failed to sync data with MongoDB Atlas", err);
  }
};
