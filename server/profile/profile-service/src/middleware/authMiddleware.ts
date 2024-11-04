import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import ProfileService from "../services/profileService"
import { getLogger } from "../utils/logger"
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

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
      logger.warn("Authorization header not found or incorrect format");
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      logger.warn("No token provided in request");
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }

    try {
      // Verify token and ensure it's the correct format
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      if (!decoded.userId) {
        logger.warn(`UserId not found for token: ${token}`);
        return res.status(401).json({ message: "User doesn't have userId" });
      }

      // Find the user by decoded userId
      const userFound = await ProfileService.getProfileById(decoded.userId);

      if (!userFound) {
        logger.warn(`User not found for token: ${token}`);
        return res.status(401).json({ message: "User not found" });
      }

      // Attach the found user to the request object
      req.user = userFound;
      next();
    } catch (error: any) {
      logger.error(`Token verification error: ${error.message}`);
      return res
        .status(500)
        .json({ message: "Error verifying token", error: error.message });
    }
  }
);
