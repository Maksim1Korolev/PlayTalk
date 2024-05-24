import User from "../models/User.js";

let localUsers = [];

export const loadLocalData = async () => {
  try {
    localUsers = await User.find({});
    console.log("Local data loaded from MongoDB Atlas");
  } catch (err) {
    console.error("Failed to load local data from MongoDB Atlas", err);
  }
};

export const saveLocalData = user => {
  localUsers.push(user);
};

export const syncWithAtlas = async () => {
  try {
    await User.insertMany(localUsers, { ordered: false, upsert: true });
    console.log("Data synchronized with MongoDB Atlas");
    localUsers = [];
  } catch (err) {
    console.error("Failed to sync data with MongoDB Atlas", err);
  }
};

export const addUser = user => {
  localUsers.push(user);
  saveLocalData(user);
};

export const deleteUser = userId => {
  localUsers = localUsers.filter(user => user._id.toString() !== userId);
};

export const getUsers = () => {
  return localUsers;
};
