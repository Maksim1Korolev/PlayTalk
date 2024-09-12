import asyncHandler from "express-async-handler";

import { getLogger } from "../utils/logger.js";
const logger = getLogger("UserController");

import UserService from "../services/userService.js";

// @desc   Get users
// @route  GET /api/users
// @access Protected
export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await UserService.getUsers();
    logger.info("Fetched all users");
    res.json({ users });
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
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
    logger.info(`User updated: ${user._id}`);
    res.json({ user: updatedUser });
  } catch (error) {
    logger.error(`Error updating user ${user._id}: ${error.message}`);
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
    logger.info(`User added: ${newUser._id}`);
    res.status(201).json({ user: newUser });
  } catch (error) {
    logger.error(`Error adding user: ${error.message}`);
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
    if (user) {
      logger.info(`Fetched user by username: ${username}`);
      res.json({ user });
    } else {
      logger.warn(`User with username ${username} not found`);
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    logger.error(
      `Error fetching user by username ${username}: ${error.message}`
    );
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
    if (user) {
      logger.info(`Fetched user by ID: ${id}`);
      res.json({ user });
    } else {
      logger.warn(`User with ID ${id} not found`);
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    logger.error(`Error fetching user by ID ${id}: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});
