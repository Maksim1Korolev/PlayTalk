import { getLogger } from "../utils/logger.js";

const logger = getLogger("ErrorMiddleware");

export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  logger.warn(`404 Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  logger.error(`Error: ${err.message}`, {
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
