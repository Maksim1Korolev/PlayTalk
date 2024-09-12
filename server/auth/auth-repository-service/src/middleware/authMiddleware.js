import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { getLogger } from "../utils/logger.js";
const logger = getLogger("AuthMiddleware");

import UserService from "../services/userService.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userFound = await UserService.getUserById(decoded.userId);

      if (userFound) {
        req.user = userFound;
        next();
      } else {
        logger.warn(`User not found for token: ${token}`);
        res.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      logger.error(`Token verification error: ${error.message}`);
      res
        .status(500)
        .json({ message: "Error verifying token", error: error.message });
    }
  } else {
    logger.warn("Authorization header not found");
    res.status(401).json({ message: "Not authorized, no token provided" });
  }

  if (!token) {
    logger.warn("No token provided in request");
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
});
