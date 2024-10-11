import { getLogger } from "../utils/logger.js";
const logger = getLogger("ErrorMiddleware");

export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  logger.warn(`404 - ${req.originalUrl} not found.`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  logger.error(`Error: ${err.message} - Stack: ${err.stack}`);
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
