import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { getLogger } from "./utils/logger.js";

import {
  connectToMongoDB,
  disconnectFromMongoDB,
} from "./utils/mongooseClient.js";
import redisClient from "./utils/redisClient.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { serviceWhitelistMiddleware } from "./middleware/serviceWhitelistMiddleware.js";

import userInternalRouter from "./routes/userInternalRoutes.js";
import userPublicRouter from "./routes/userPublicRoutes.js";

const logger = getLogger("Main");

dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use("/api/users", userPublicRouter);

  app.use(
    "/api/users/internal",
    serviceWhitelistMiddleware,
    userInternalRouter
  );

  app.use(errorHandler);
  app.use(notFound);

  const PORT = process.env.PORT || 3011;

  await connectToMongoDB();
  await redisClient.connect();

  app.listen(PORT, () => {
    logger.info(
      `auth-repository-service is running in ${process.env.NODE_ENV} mode on port ${PORT}`
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
