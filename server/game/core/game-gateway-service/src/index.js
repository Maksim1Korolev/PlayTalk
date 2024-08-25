import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
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
  server.listen(PORT, () => {
    console.log(`game-gateway-service is running on port ${PORT}`);
  });
}

main()
  .then(async () => {})
  .catch(async err => {
    redisClient.quit();
    console.error(err);
    process.exit(1);
  });

async function clearSocketCache() {
  try {
    await redisClient.del(process.env.REDIS_USER_SOCKET_KEY);
    await redisClient.del(process.env.REDIS_USER_GAMES_KEY);
    console.log("Cleared socket ID and active games cache in Redis");
  } catch (err) {
    console.error(
      "Error clearing socket ID and active games cache in Redis:",
      err.message
    );
  }
}
