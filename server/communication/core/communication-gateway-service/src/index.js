import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import chatRouter from "./chat/chat.routes.js";
import onlineRouter from "./connection/connection.routes.js";
import { connectOnline } from "./connection/connection.controller.js";

import redisClient from "./utils/redisClient.js";

dotenv.config();

const app = express();

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {},
});

async function main() {
  await connectOnline();
  await redisClient.connect();

  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());
  //TODO: Rename
  app.use("/api/connection", onlineRouter);
  app.use("/api/chat", chatRouter);

  server.listen(PORT, () => {
    console.log(
      `communication-gateway-service is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
}

main().catch(async e => {
  console.error(e);
  redisClient.quit();
  process.exit(1);
});
