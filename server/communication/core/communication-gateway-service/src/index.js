import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import chatRouter from "./chat/chat.routes.js";
import { connectOnline } from "./online/online.controller.js";
import onlineRouter from "./online/online.routes.js";

dotenv.config();

const app = express();

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {},
});

await connectOnline();

const PORT = process.env.PORT || 3000;

async function main() {
  app.use(cors());
  app.use(express.json());
  app.use("/api/online", onlineRouter);
  app.use("/api/chat", chatRouter);
}

server.listen(PORT, () => {
  console.log(
    `communication-gateway-service is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

main();
