import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { getLogger } from "../utils/logger.js";

import UserService from "../services/userService.js";

const logger = getLogger("AuthMiddleware");

export const protect = asyncHandler(async (req, res, next) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userFound = await UserService.getUserById(decoded.userId);

    if (!userFound) {
      logger.warn(`User not found for token: ${token}`);
      return res.status(401).json({ message: "User not found" });
    }

    req.user = userFound;
    next();
  } catch (error) {
    logger.error(`Token verification error: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error verifying token", error: error.message });
  }
});
