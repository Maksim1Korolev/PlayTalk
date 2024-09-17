import AWS from "aws-sdk";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { errorHandler, notFound } from "./middleware/errorMiddleware";
import userRouter from "./profile/users.routes";
import { getLogger } from "./utils/logger";
import {
  connectToMongoDB,
  disconnectFromMongoDB,
} from "./utils/mongooseClient";
import redisClient from "./utils/redisClient";

const logger = getLogger("Main");

const s3 = new AWS.S3();
dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  //app.use("/api/online", onlineRouter);

  app.use(errorHandler);
  app.use(notFound);
  app.use("/api/users", userRouter);

  const PORT = process.env.PORT || 3000;

  await connectToMongoDB();
  await redisClient.connect();

  app.listen(PORT, () => {
    logger.info(
      `profile-repository-service is running in ${process.env.NODE_ENV} mode on port ${PORT}`
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

app.get("/", (req, res) => {
  res.send("Hello, world!");
});
