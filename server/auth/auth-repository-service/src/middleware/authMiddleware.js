import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import UserService from "../services/userService.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userFound = await UserService.getUserById(decoded.userId);

      if (userFound) {
        req.user = userFound;
        next();
      } else {
        res.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error verifying token", error: error.message });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
});
