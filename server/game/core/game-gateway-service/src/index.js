import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import { getLogger } from "./utils/logger.js";

import redisClient from "./utils/redisClient.js";

import { socketAuthMiddleware } from "./middleware/authMiddleware.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import SocketService from "./services/socketService.js";

import gameRouter from "./routes/gameRoutes.js";
import onlineRouter from "./routes/onlineRoutes.js";

const logger = getLogger("Main");

dotenv.config();

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {},
});

io.engine.use(socketAuthMiddleware);

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
    logger.info(
      `game-gateway-service is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
}

main()
  .then(async () => {
    logger.info("Main function executed successfully.");
  })
  .catch(async err => {
    logger.error(`Application startup error: ${err.message}`);
    redisClient.quit();
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  });

async function clearSocketCache() {
  try {
    await redisClient.del(process.env.REDIS_USER_SOCKET_KEY);
    await redisClient.del(process.env.REDIS_USER_GAMES_KEY);
    logger.info("Cleared socket ID and active games cache in Redis");
  } catch (err) {
    logger.error(
      `Error clearing socket ID and active games cache in Redis: ${err.message}`
    );
  }
}
