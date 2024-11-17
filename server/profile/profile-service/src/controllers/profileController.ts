import { NextFunction, Request, Response } from "express";

import { getLogger } from "../utils/logger";

import ProfileService from "../services/profileService";

const logger = getLogger("ProfileController");

interface ApiError extends Error {
  status?: number;
}

// @desc   Get profiles
// @route  GET /api/profiles
// @access Protected
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
  } catch (error: unknown) {
    const apiError = error as ApiError;
    logger.error(`Error fetching profiles: ${apiError.message}`);
    next(apiError);
  }
};

// @desc   Get profile by username
// @route  GET /api/profiles/:username
// @access Protected
export const getProfileByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username } = req.params;

  try {
    logger.info(`Fetching profile for username: ${username}`);

    const profile = await ProfileService.getProfileByUsername(username);

    if (!profile) {
      logger.warn(`Profile not found for username: ${username}`);
      res.status(404).json({ message: "User not found" });
      return;
    }

    logger.info(`Profile fetched for username: ${username}`);
    res.status(200).json({ profile });
  } catch (error: unknown) {
    const apiError = error as ApiError;
    logger.error(
      `Error fetching profile for username ${username}: ${apiError.message}`
    );
    next(apiError);
  }
};
