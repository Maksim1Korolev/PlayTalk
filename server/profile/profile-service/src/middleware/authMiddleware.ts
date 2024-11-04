import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { getLogger } from "../utils/logger";

import ProfileService from "../services/profileService";

const logger = getLogger("AuthMiddleware");

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

interface JwtPayload {
  userId: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
    logger.warn("Authorization header not found or incorrect format");
    res.status(401).json({ message: "Not authorized, no token provided" });
    return;
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    logger.warn("No token provided in request");
    res.status(401).json({ message: "Not authorized, no token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded.userId) {
      logger.warn(`UserId not found for token: ${token}`);
      res.status(401).json({ message: "User doesn't have userId" });
      return;
    }

    const userFound = await ProfileService.getProfileById(decoded.userId);

    if (!userFound) {
      logger.warn(`User not found for token: ${token}`);
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = userFound;
    next();
  } catch (error: any) {
    logger.error(`Token verification error: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error verifying token", error: error.message });
  }
};
