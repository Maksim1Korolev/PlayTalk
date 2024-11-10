import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { getLogger } from "../utils/logger.js";

const logger = getLogger("AuthMiddleware");

export const socketAuthMiddleware = (req, res, next) => {
  const isHandshake = req._query.sid === undefined;

  if (!isHandshake) {
    return next();
  }

  const header = req.headers["authorization"];

  if (!header || !header.startsWith("Bearer ")) {
    logger.warn("Invalid or missing token during socket handshake");
    return next(new Error("Invalid or missing token"));
  }

  const token = header.substring(7);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error("Invalid token during socket handshake");
      return next(new Error("Invalid token"));
    }

    req.user = { id: decoded.userId, username: decoded.username };
    logger.info(`Socket handshake successful for user: ${decoded.username}`);
    next();
  });
};

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
