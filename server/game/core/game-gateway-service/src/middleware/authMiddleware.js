import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { getLogger } from "../utils/logger.js";

import SocketService from "../services/socketService.js";
import UserService from "../services/userService.js";

const logger = getLogger("AuthMiddleware");

export const socketAuthMiddleware = (req, res, next) => {
  const isHandshake = req._query.sid === undefined;

  if (!isHandshake) {
    return next();
  }

  const header = req.headers["authorization"];

  if (!header) {
    logger.warn("No token provided during socket handshake");
    return next(new Error("No token provided"));
  }

  if (!header.startsWith("Bearer ")) {
    logger.warn("Invalid token format in socket handshake");
    return next(new Error("Invalid token format"));
  }

  const token = header.substring(7);

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
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

    const onlineUsernames = await SocketService.getOnlineUsernames();
    const isUserOnline = onlineUsernames.includes(decoded.username);

    if (!isUserOnline) {
      const isRegistered = await UserService.isUserRegistered(decoded.username);

      if (!isRegistered) {
        logger.warn(`User not registered: ${decoded.username}`);

        return res.status(401).json({ message: "User not registered" });
      }
      logger.info(`User is offline but registered: ${decoded.username}`);
    } else {
      logger.info(`User is online: ${decoded.username}`);
    }

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
