import { NextFunction, Request, Response } from "express";

import { getLogger } from "../utils/logger";

import ProfileService from "../services/profileService";

const logger = getLogger("ProfileController");

// @desc   Add profile
// @route  POST /api/profiles
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

//TODO:Update after adjusting profile/auth logic
// @desc   Get profile by username
// @route  GET /api/profiles/:username
// @access Public
export const getProfileByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username } = req.params;

  if (!username) {
    logger.warn("Username is missing in request");
    res.status(400).json({ message: "Username is required" });
    return;
  }

  try {
    logger.info(`Fetching profile with username: ${username}`);
    let profile = await ProfileService.getProfileByUsername(username);

    if (!profile) {
      logger.warn(
        `Profile with username ${username} not found. Creating a new profile.`
      );
      profile = await ProfileService.addProfile(username);

      if (!profile) {
        logger.error(`Failed to create profile for username: ${username}`);
        res.status(500).json({ message: "Failed to create profile" });
        return;
      }

      logger.info(`Profile for username ${username} created successfully`);
      res.status(201).json({ profile });
    } else {
      logger.info(`Profile with username ${username} fetched successfully`);
      res.status(200).json({ profile });
    }
  } catch (error: any) {
    logger.error(
      `Error fetching or creating profile for username ${username}: ${error.message}`
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
