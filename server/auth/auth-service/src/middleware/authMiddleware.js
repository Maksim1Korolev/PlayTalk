import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { getLogger } from "../utils/logger.js";

const logger = getLogger("AuthMiddleware");

export const protect = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
    logger.warn("Authorization header missing or incorrect format");
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info(`Token verified for user: ${decoded.username}`);

    req.user = { id: decoded.userId, username: decoded.username };

    logger.info(`Access granted to user: ${decoded.username}`);
    next();
  } catch (error) {
    logger.error(`Error verifying token: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Error verifying token", error: error.message });
  }
});
