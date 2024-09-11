import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { getLogger } from "../utils/logger.js";
const logger = getLogger("AuthMiddleware");

import UserService from "../services/userService.js";
import SocketService from "../services/socketService.js";

export const socketAuthMiddleware = io => {
  io.engine.use((req, res, next) => {
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
      logger.warn("Invalid token format provided");
      return next(new Error("Invalid token format"));
    }

    const token = header.substring(7);

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        logger.error(`Invalid token: ${err.message}`);
        return next(new Error("Invalid token"));
      }

      try {
        const userFound = await UserService.getUserById(decoded.userId);
        if (userFound) {
          logger.info(`User ${decoded.username} authenticated via socket`);
          req.user = userFound;
          next();
        } else {
          logger.warn(`User not found for ID: ${decoded.userId}`);
          return next(new Error("User not found"));
        }
      } catch (error) {
        logger.error(`Error fetching user: ${error.message}`);
        return next(new Error("Error fetching user"));
      }
    });
  });
};

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      logger.info(`Token verified for user: ${decoded.username}`);

      const onlineUsernames = await SocketService.getOnlineUsernames();
      const isUserOnline = onlineUsernames.includes(decoded.username);
      let userFound = {
        id: decoded.userId,
        username: decoded.username,
      };

      if (!isUserOnline) {
        logger.info(`User ${decoded.username} is not online, fetching from DB`);
        userFound = await UserService.getUserById(decoded.userId);
      }

      if (userFound) {
        req.user = userFound;
        logger.info(`User ${decoded.username} authenticated`);
        next();
      } else {
        logger.warn(`User not found: ${decoded.username}`);
        res.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      logger.error(`Error verifying token for user: ${error.message}`);
      res
        .status(500)
        .json({ message: "Error verifying token", error: error.message });
    }
  } else {
    logger.warn("No token provided in request");
    res.status(401).json({ message: "Not authorized, no token provided" });
  }

  if (!token) {
    logger.warn("Token missing from request headers");
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
});
