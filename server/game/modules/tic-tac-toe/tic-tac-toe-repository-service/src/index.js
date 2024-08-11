import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import redisClient from "./utils/redisClient.js";
import {
  connectToMongoDB,
  disconnectFromMongoDB,
} from "./utils/mongooseClient.js";

import players from "./players/players.routes.js";

dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use("/api/players", players);

  const PORT = process.env.PORT || 8082;

  await connectToMongoDB();

  await redisClient.connect();

  app.listen(PORT, () => {
    console.log(`tic-tac-toe-repository-service is running on port ${PORT}`);
  });
}

main().catch(async err => {
  console.error(err.message);
  await disconnectFromMongoDB();
  redisClient.quit();
  process.exit(1);
});
