import { NextFunction, Request, Response } from "express";
import { getLogger } from "../utils/logger";
const logger = getLogger("ErrorMiddleware");

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  logger.warn(`404 - ${req.originalUrl} not found.`);
  res.status(404);
  next(error);
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  logger.error(`Error: ${err.message} - Stack: ${err.stack}`);
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
