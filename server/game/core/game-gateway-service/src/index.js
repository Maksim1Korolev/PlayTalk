import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import redisClient from "./utils/redisClient.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { socketAuthMiddleware } from "./middleware/authMiddleware.js";

import gameRouter from "./routes/gameRoutes.js";
import onlineRouter from "./routes/onlineRoutes.js";
import SocketService from "./services/socketService.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {},
});

socketAuthMiddleware(io);

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use("/api/online", onlineRouter);
  app.use("/api/game", gameRouter);

  app.use(errorHandler);
  app.use(notFound);

  const PORT = process.env.PORT || 3030;

  await redisClient.connect();
  await clearSocketCache();

  await SocketService.setupSocketConnection();

  server.listen(PORT, () => {
    console.log(
      `game-gateway-service is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
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
