import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import redisClient from "./utils/redisClient.js";
import {
  connectToMongoDB,
  disconnectFromMongoDB,
} from "./utils/mongooseClient.js";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use("/api/users", userRoutes);

  const PORT = process.env.PORT || 3011;

  await connectToMongoDB();

  await redisClient.connect();

  app.listen(PORT, () => {
    console.log(`auth-repository-service is running on port ${PORT}`);
  });
}

main().catch(async err => {
  console.error(err.message);
  await disconnectFromMongoDB();
  redisClient.quit();
  process.exit(1);
});
