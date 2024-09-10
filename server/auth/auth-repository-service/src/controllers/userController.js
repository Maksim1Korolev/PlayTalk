import asyncHandler from "express-async-handler";
import UserService from "../services/userService.js";

// @desc   Get users
// @route  GET /api/users
// @access Protected
export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await UserService.getUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc   Update a user
// @route  PUT /api/users/:id
// @access Protected
export const updateUser = asyncHandler(async (req, res) => {
  const user = req.body;
  try {
    const updatedUser = await UserService.updateUser(user);
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc   Add a user
// @route  POST /api/users/internal
// @access Internal
export const addUser = asyncHandler(async (req, res) => {
  const { user } = req.body;
  try {
    const newUser = await UserService.addUser(user);
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc   Get user by username
// @route  GET /api/users/internal/username/:username
// @access Internal
export const getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  try {
    const user = await UserService.getUserByUsername(username);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc   Get user by ID
// @route  GET /api/users/internal/id/:id
// @access Internal
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserService.getUserById(id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
