import { NextFunction, Request, Response } from "express";

import { getLogger } from "../utils/logger";

import ProfileService from "../services/profileService";

const logger = getLogger("ProfileController");

// @desc   Get profiles
// @route  GET /api/users
// @access Public
export const getProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.info("Fetching all profiles");
    const profiles = await ProfileService.getProfiles();

    if (!profiles || profiles.length === 0) {
      logger.warn("No profiles found");
      res.status(404).json({ message: "No profiles found" });
      return;
    }

    logger.info("Profiles fetched successfully");
    res.status(200).json({ profiles });
  } catch (error: any) {
    logger.error(`Error fetching profiles: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc   Add profile
// @route  POST /api/users
// @access Public
export const addProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username } = req.body;

  if (!username) {
    logger.warn("Username missing in add profile request");
    res.status(400).json({ message: "Username is required" });
    return;
  }

  try {
    logger.info(`Attempt to add profile with username: ${username}`);
    const profile = await ProfileService.addProfile(username);

    if (!profile) {
      logger.error("Failed to add profile");
      res.status(500).json({ message: "Failed to add profile" });
      return;
    }

    logger.info(`Profile added successfully: ${username}`);
    res.status(201).json({ profile });
  } catch (error: any) {
    logger.error(
      `Error adding profile for username: ${username} - ${error.message}`
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
