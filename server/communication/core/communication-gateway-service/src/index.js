import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import unreadRouter from "./unread/unread.routes.js";
import onlineRouter from "./online/online.routes.js";
import { connectOnline } from "./online/online.controller.js";

import redisClient from "./utils/redisClient.js";

dotenv.config();

const app = express();

//TODO:Move io
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
  app.use("/api/online", onlineRouter);
  app.use("/api/unread", unreadRouter);

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
