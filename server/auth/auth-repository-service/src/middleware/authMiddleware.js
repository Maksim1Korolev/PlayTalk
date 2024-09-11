import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

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

    if (!userFound) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = userFound;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error verifying token", error: error.message });
  }
});
