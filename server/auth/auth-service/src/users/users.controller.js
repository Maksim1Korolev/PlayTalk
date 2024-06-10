import asyncHandler from "express-async-handler";
import UserService from "../services/UserService.js";

// @desc   Get users
// @route  GET /api/users/
// @access Protected
export const getUsers = asyncHandler(async (req, res) => {
  const users = await UserService.getUsers();
  res.json({ users });
});

// @desc   Add a user
// @route  POST /api/users
// @access Public
export const addUser = asyncHandler(async (req, res) => {
  const { user } = req.body;
  await UserService.addUser(user);
  res.status(201).json({ message: "User added successfully" });
});

// @desc   Delete a user
// @route  DELETE /api/users/:id
// @access Public
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await UserService.deleteUser(id);
  res.status(200).json({ message: "User deleted successfully" });
});

// @desc   Get user by username
// @route  GET /api/users/username/:username
// @access Protected
export const getUserByUsername = asyncHandler(async (req, res) => {
  console.log("a");
  console.log("a");
  console.log("a");
  const { username } = req.params;
  const user = await UserService.getUserByUsername(username);
  res.json(user);
});

// @desc   Get user by ID
// @route  GET /api/users/id/:id
// @access Protected
export const getUserById = asyncHandler(async (req, res) => {
  console.log("a");
  console.log(req.params);
  console.log("lo");
  console.log(id);
  const { id } = req.params;
  const user = await UserService.getUserById(id);
  res.json(user);
});

// @desc   Update a user
// @route  PUT /api/users/:id
// @access Protected
export const updateUser = asyncHandler(async (req, res) => {
  const user = req.body;
  const updatedUser = await UserService.updateUser(user);
  res.json(updatedUser);
});
