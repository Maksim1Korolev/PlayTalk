import { hash, verify } from "argon2";
import asyncHandler from "express-async-handler";

import { generateToken } from "./generate.token.js";
import UserService from "../services/UserService.js";

// @desc   Auth user
// @route  POST /api/users/login
// @access Public

export const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await UserService.getUserByUsername(username);

  try {
    const isValidPassword = await verify(user.password, password);
    if (user && isValidPassword) {
      const token = generateToken(user.id);
      res.json({ user, token });
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(401);
    throw new Error("Username or password is incorrect");
  }
});

// @desc   Register user
// @route  POST /api/users/register
// @access Public

export const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await UserService.getUserByUsername(username);

  if (existingUser) {
    res.status(400);
    throw new Error("Username already taken");
  }

  const user = await UserService.addUser({
    username,
    password: await hash(password),
  });
  console.log("ERSGERGESRGEGERGERG");
  console.log(user);
  const token = generateToken(user._id);

  res.json({ user, token });
});
