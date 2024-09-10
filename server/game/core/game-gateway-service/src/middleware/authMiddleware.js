import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

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

      const onlineUsernames = await SocketService.getOnlineUsernames();
      const isUserOnline = onlineUsernames.includes(decoded.username);
      let userFound = {
        id: decoded.userId,
        username: decoded.username,
      };

      if (!isUserOnline) {
        userFound = await UserService.getUserById(decoded.userId);
      }

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
