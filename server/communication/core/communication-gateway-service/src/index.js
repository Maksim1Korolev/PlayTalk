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

//TODO:Move to .env?
const USER_SOCKET_HASH_KEY = "usernameSocketIds";

//TODO:Do this only in dev mode?
async function clearSocketCache() {
  try {
    await redisClient.del(USER_SOCKET_HASH_KEY);
    console.log("Cleared socket ID cache in Redis");
  } catch (err) {
    console.error("Error clearing socket ID cache in Redis:", err.message);
  }
}

async function main() {
  await redisClient.connect();
  await clearSocketCache();

  //TODO:Rename and move
  await connectOnline();

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
