import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";

import redisClient from "./utils/redisClient.js";

import gameRouter from "./game/game.routes.js";
import SocketService from "./services/socketService.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {},
});

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use("/api/game", gameRouter);

  const PORT = process.env.PORT || 3030;

  await redisClient.connect();
  await clearSocketCache();

  await SocketService.setupSocketConnection();

  const mongoURL = process.env.DATABASE_URL;

  mongoose
    .connect(mongoURL)
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.error("Connection error", err.message));

  server.listen(PORT, () => {
    console.log(`game-gateway-service is running on port ${PORT}`);
  });
}

main()
  .then(async () => {})
  .catch(async err => {
    redisClient.quit();
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
  });

async function clearSocketCache() {
  try {
    await redisClient.del(process.env.REDIS_USER_SOCKET_KEY);
    console.log("Cleared socket ID cache in Redis");
  } catch (err) {
    console.error("Error clearing socket ID cache in Redis:", err.message);
  }
}
