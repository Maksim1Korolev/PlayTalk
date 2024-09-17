import asyncHandler from "express-async-handler";

// @desc   Get users
// @route  GET /api/users/
// @access Protected
export const getUsers = asyncHandler(async (req, res) => {
  const users = await UserService.getUsers();
  res.json({ users });
});



