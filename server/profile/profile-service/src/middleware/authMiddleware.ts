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

export const protect = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
      logger.warn("Authorization header missing or incorrect format");
      res.status(401).json({ message: "Not authorized, no token provided" });
      return;
    }

    const token = authorizationHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedToken;
      logger.info(`Token verified for user: ${decoded.username}`);

      req.user = { id: decoded.userId, username: decoded.username };

      logger.info(`Access granted to user: ${decoded.username}`);
      next();
    } catch (error: any) {
      logger.error(`Error verifying token: ${error.message}`);
      res
        .status(500)
        .json({ message: "Error verifying token", error: error.message });
      return;
    }
  }
);
