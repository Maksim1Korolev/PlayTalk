import asyncHandler from "express-async-handler";
import UserService from "../services/userService";
// @desc   Get users
// @route  GET /api/users/
// @access Protected
export const getUsers = asyncHandler(async (req, res) => {
  const users = await UserService.getUsers();
  res.json({ users });
});
