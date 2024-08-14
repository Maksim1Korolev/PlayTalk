import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import redisClient from "./utils/redisClient.js";

import unreadRouter from "./unread/unread.routes.js";
import onlineRouter from "./online/online.routes.js";
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

  app.use("/api/online", onlineRouter);
  app.use("/api/unread", unreadRouter);

  const PORT = process.env.PORT || 3000;

  await redisClient.connect();
  await clearSocketCache();

  await SocketService.setupSocketConnection();

  server.listen(PORT, () => {
    console.log(
      `communication-gateway-service is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
}

main().catch(async err => {
  redisClient.quit();
  console.error(err.message);
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
