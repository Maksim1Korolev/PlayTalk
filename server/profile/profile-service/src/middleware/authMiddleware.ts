import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";

import { getLogger } from "../utils/logger";

const logger = getLogger("AuthMiddleware");

interface DecodedToken extends JwtPayload {
  userId: string;
  username: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

interface ApiError extends Error {
  status?: number;
}

export const protect = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      logger.warn("Authorization header missing or incorrect format");
      res.status(401).json({ message: "Not authorized, no token provided" });
      return;
    }

    const token = authorizationHeader.split(" ")[1];

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error("JWT secret is not defined in environment variables");
      res
        .status(500)
        .json({ message: "Internal server error, misconfigured JWT secret" });
      return;
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

      logger.info(`Token verified for user: ${decoded.username}`);
      req.user = { id: decoded.userId, username: decoded.username };

      logger.info(`Access granted to user: ${decoded.username}`);
      next();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      logger.error(`Error verifying token: ${apiError.message}`);
      next(apiError);
    }
  }
);
