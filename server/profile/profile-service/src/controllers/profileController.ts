import { NextFunction, Request, Response } from "express";

import { getLogger } from "../utils/logger";

import ProfileService from "../services/profileService";

const logger = getLogger("ProfileController");

// @desc   Get profiles
// @route  GET /api/profiles
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

// @desc   Get profile by username
// @route  GET /api/profiles/:username
// @access Public
export const getProfileByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username } = req.params;

  try {
    const profile = await ProfileService.getProfileByUsername(username);

    if (profile) {
      logger.info(`Fetched profile by username: ${username}`);
      res.json({ profile });
    } else {
      logger.warn(`Profile with username ${username} not found`);
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    logger.error(
      `Error fetching profile by username ${username}: ${error.message}`
    );
    res.status(500).json({ error: error.message });
  }
};
