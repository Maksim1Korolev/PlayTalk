import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { io } from "../index.js";
//import UserService from "../services/userService.js";

export const protect = asyncHandler(async (req, res, next) => {
  // let token;
  // if (req.headers.authorization?.startsWith("Bearer")) {
  //   token = req.headers.authorization.split(" ")[1];
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   const userFound = await UserService.getUserById(decoded.userId);
  //   if (userFound) {
  //     req.user = userFound;
  //     next();
  //   } else {
  //     res.status(401);
  //     throw new Error("Not authorized");
  //   }
  // }
  // if (!token) {
  //   res.status(401);
  //   throw new Error("Not authorized, You don't have token");
  // }
});

// io.engine.use((req, res, next) => {
//   const isHandshake = req._query.sid === undefined;
//   if (!isHandshake) {
//     return next();
//   }

//   const header = req.headers["authorization"];

//   if (!header) {
//     return next(new Error("no token"));
//   }

//   if (!header.startsWith("bearer ")) {
//     return next(new Error("invalid token"));
//   }

//   const token = header.substring(7);

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return next(new Error("invalid token"));
//     }
//     const userFound = await UserService.getUserById(decoded.userId);
//     if (userFound) {
//       req.user = userFound;
//       next();
//     } else {
//       res.status(401);
//       throw new Error("Not authorized");
//     }
//     req.user = decoded.data;
//     next();
//   });
// });
