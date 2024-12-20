import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { getLogger } from "./utils/logger.js";

import { connectProducer, disconnectProducer } from "./utils/kafkaProducer.js";
import {
  connectToMongoDB,
  disconnectFromMongoDB,
} from "./utils/mongooseClient.js";
import redisClient from "./utils/redisClient.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const logger = getLogger("Main");

dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRouter);

  app.use("/api/users", userRouter);

  app.use(errorHandler);
  app.use(notFound);

  const PORT = process.env.PORT || 3010;

  await connectToMongoDB();
  await redisClient.connect();
  await connectProducer();

  app.listen(PORT, () => {
    logger.info(
      `auth-service is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
}

main()
  .then(async () => {
    logger.info("Main function executed successfully.");
  })
  .catch(async (err) => {
    logger.error(`Application startup error: ${err.message}`);
    await disconnectFromMongoDB();
    redisClient.quit();
    await disconnectProducer();
    process.exit(1);
  });
