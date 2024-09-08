import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import UserService from "../services/userService.js";

export const socketAuthMiddleware = io => {
  io.engine.use((req, res, next) => {
    const isHandshake = req._query.sid === undefined;
    if (!isHandshake) {
      return next();
    }

    const header = req.headers["authorization"];

    if (!header) {
      return next(new Error("No token provided"));
    }

    if (!header.startsWith("Bearer ")) {
      return next(new Error("Invalid token format"));
    }

    const token = header.substring(7);

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next(new Error("Invalid token"));
      }

      try {
        const userFound = await UserService.getUserById(decoded.userId);
        if (userFound) {
          req.user = userFound;
          next();
        } else {
          return next(new Error("User not found"));
        }
      } catch (error) {
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
      const userFound = await UserService.getUserById(decoded.userId);

      if (userFound) {
        req.user = userFound;

        const { requestingUsername } = req.params;

        if (requestingUsername && requestingUsername !== userFound.username) {
          return res
            .status(403)
            .json({ message: "Unauthorized access to this user's data" });
        }

        next();
      } else {
        res.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
});
