import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import redisClient from "./utils/redisClient.js";
import {
  connectToMongoDB,
  disconnectFromMongoDB,
} from "./utils/mongooseClient.js";
import { getLogger } from "./utils/logger.js";
const logger = getLogger("Main");

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { serviceWhitelistMiddleware } from "./middleware/serviceWhitelistMiddleware.js";

import messageHistoryRouter from "./routes/messageHistoryRoutes.js";
import unreadRouter from "./routes/unreadRoutes.js";
import MessageBufferService from "./services/messageBufferService.js";

dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use(
    "/api/messageHistories",
    serviceWhitelistMiddleware,
    messageHistoryRouter
  );
  app.use("/api/unread", serviceWhitelistMiddleware, unreadRouter);

  app.use(errorHandler);
  app.use(notFound);

  const PORT = process.env.PORT || 3021;

  await connectToMongoDB();
  await redisClient.connect();

  await MessageBufferService.subscribeToPeriodicFlush();

  app.listen(PORT, () => {
    logger.info(
      `chat-repository-service is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
}

main()
  .then(async () => {
    logger.info("Main function executed successfully.");
  })
  .catch(async err => {
    logger.error(`Application startup error: ${err.message}`);
    await disconnectFromMongoDB();
    redisClient.quit();
    process.exit(1);
  });
