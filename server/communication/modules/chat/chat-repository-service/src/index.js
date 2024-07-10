import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import redisClient from "./utils/redisClient.js";
import {
  connectToMongoDB,
  disconnectFromMongoDB,
} from "./utils/mongooseClient.js";

import messageHistoriesRoutes from "./messageHistories/messageHistories.routes.js";
import unreadRoutes from "./unread/unread.routes.js";

dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use("/api/messageHistories", messageHistoriesRoutes);
  app.use("/api/unread", unreadRoutes);

  const PORT = process.env.PORT || 3021;

  await connectToMongoDB();
  await redisClient.connect();

  app.listen(PORT, () => {
    console.log(`chat-repository-service is running on port ${PORT}`);
  });
}

main().catch(async err => {
  console.error(err.message);
  await disconnectFromMongoDB();
  redisClient.quit();
  process.exit(1);
});
