import asyncHandler from "express-async-handler";

import ProfileService from "../services/profileService";

//TODO: protected?
// @desc   Get users
// @route  GET /api/users/
// @access Public
export const getProfiles = asyncHandler(async (req, res) => {
  const profiles = await ProfileService.getProfiles();
  res.status(200).json({ profiles });
});

//TODO:middleware to check if username in token and in req.body the same?

// @desc   Add users
// @route  POST /api/users/
// @access Public
export const addProfile = asyncHandler(async (req, res) => {
  const profile = await ProfileService.addProfile(req.body.username);
  if (profile) res.status(200).json({ profile });
  else res.status(500);
});
