import { hash, verify } from "argon2";
import asyncHandler from "express-async-handler";

import { getLogger } from "../utils/logger.js";

import generateToken from "../services/generateToken.js";
import UserService from "../services/userService.js";

const logger = getLogger("AuthController");

// @desc   Auth user
// @route  POST /api/users/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  try {
    logger.info(`Authentication attempt for user: ${username}`);
    const user = await UserService.getUserByUsername(username);

    if (!user) {
      logger.warn(`Failed login attempt for user: ${username}`);
      res.status(401);
      throw new Error("Username or password is incorrect");
    }

    const isValidPassword = await verify(user.password, password);
    if (!isValidPassword) {
      logger.warn(`Invalid password for user: ${username}`);
      res.status(401);
      throw new Error("Username or password is incorrect");
    }

    const token = generateToken(user._id, user.username);
    logger.info(`User authenticated successfully: ${username}`);
    res.json({ token });
  } catch (error) {
    logger.error(`Error authenticating user: ${username} - ${error.message}`);
    res.status(401).json({ message: error.message });
  }
});

// @desc   Register user
// @route  POST /api/users/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    logger.warn("Username or password missing in registration request");
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  logger.info(`Registration attempt for user: ${username}`);

  try {
    const existingUser = await UserService.getUserByUsername(username);

    if (existingUser) {
      logger.warn(`Username already taken: ${username}`);
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await hash(password);
    const user = await UserService.addUser({
      username,
      password: hashedPassword,
    });

    const token = generateToken(user._id, user.username);
    logger.info(`User registered successfully: ${username}`);
    return res.status(201).json({ token });
  } catch (error) {
    logger.error(`Error registering user: ${username}: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
});
