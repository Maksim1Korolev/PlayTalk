import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { getLogger } from "../utils/logger.js";
const logger = getLogger("AuthMiddleware");

import UserService from "../services/userService.js";
import SocketService from "../services/socketService.js";

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

    try {
      const userFound = await UserService.getUserById(decoded.userId);
      if (userFound) {
        req.user = userFound;
        logger.info(
          `Socket handshake successful for user: ${userFound.username}`
        );
        next();
      } else {
        logger.warn(
          `User not found during socket handshake: userId ${decoded.userId}`
        );
        return next(new Error("User not found"));
      }
    } catch (error) {
      logger.error(
        `Error fetching user during socket handshake: ${error.message}`
      );
      return next(new Error("Error fetching user"));
    }
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

    let userFound;

    if (isUserOnline) {
      userFound = {
        id: decoded.userId,
        username: decoded.username,
      };
    } else {
      userFound = await UserService.getUserById(decoded.userId);
      if (!userFound) {
        logger.warn(`User not found: userId ${decoded.userId}`);
        return res.status(401).json({ message: "User not found" });
      }
      logger.info(`User fetched from UserService: ${userFound.username}`);
    }

    if (req.params.username && req.params.username !== userFound.username) {
      logger.warn(`Unauthorized access attempt by user: ${userFound.username}`);
      return res
        .status(403)
        .json({ message: "Unauthorized access to this user's data" });
    }

    const { player1Username, player2Username } = req.query;
    if (player1Username || player2Username) {
      if (
        userFound.username !== player1Username &&
        userFound.username !== player2Username
      ) {
        logger.warn(
          `Unauthorized access attempt to data by user: ${userFound.username}`
        );
        return res
          .status(403)
          .json({ message: "Unauthorized access to this data" });
      }
    }

    req.user = userFound;
    logger.info(`Access granted to user: ${userFound.username}`);
    next();
  } catch (error) {
    logger.error(`Error verifying token: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Error verifying token", error: error.message });
  }
});
