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

      const userFound = await UserService.getUserById(decoded.userId);
      if (userFound) {
        req.user = userFound;
        next();
      } else {
        return next(new Error("User not found"));
      }
    });
  });
};