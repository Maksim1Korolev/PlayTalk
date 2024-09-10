import { hash, verify } from "argon2";
import asyncHandler from "express-async-handler";

import UserService from "../services/userService.js";
import generateToken from "../services/generateToken.js";

// @desc   Auth user
// @route  POST /api/users/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserService.getUserByUsername(username);

    if (!user) {
      res.status(401);
      throw new Error("Username or password is incorrect");
    }

    const isValidPassword = await verify(user.password, password);
    if (!isValidPassword) {
      res.status(401);
      throw new Error("Username or password is incorrect");
    }

    const token = generateToken(user._id, user.username);

    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// @desc   Register user
// @route  POST /api/users/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await UserService.getUserByUsername(username);

    if (existingUser) {
      res.status(400);
      throw new Error("Username already taken");
    }

    const hashedPassword = await hash(password);
    const user = await UserService.addUser({
      username,
      password: hashedPassword,
    });

    const token = generateToken(user._id, user.username);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
