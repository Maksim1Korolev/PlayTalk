import AWS from "aws-sdk";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { getLogger } from "./utils/logger";
import {
  connectToMongoDB,
  disconnectFromMongoDB,
} from "./utils/mongooseClient";
import redisClient from "./utils/redisClient";

import { errorHandler, notFound } from "./middleware/errorMiddleware";

import profileRouter from "./routes/profileRoutes";

const logger = getLogger("Main");

dotenv.config();
const s3 = new AWS.S3();

const app = express();

async function main() {
  app.use(express.json());
  app.use(cors());

  app.use("/api/profiles", profileRouter);

  app.use(errorHandler);
  app.use(notFound);

  const PORT = process.env.PORT || 3040;

  await connectToMongoDB();
  await redisClient.connect();

  app.listen(PORT, () => {
    logger.info(
      `profile-service is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
}

main()
  .then(async () => {
    logger.info("Main function executed successfully.");
  })
  .catch(async (err: Error) => {
    logger.error(`Application startup error: ${err.message}`);
    await disconnectFromMongoDB();
    redisClient.quit();
    process.exit(1);
  });
