import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectToGameLobby } from "./connection/connection.controller.js";
import cors from "cors";
import connectionRouter from "./connection/connection.routes.js";
import path from "path";

dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());
  app.use("/api/connection", connectionRouter);

  const __dirname = path.resolve();
  app.use("/public", express.static(path.join(__dirname, "public")));
}
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {},
});

connectToGameLobby();

const PORT = process.env.PORT || 3030;

const mongoURL = process.env.DATABASE_URL;

mongoose
  .connect(mongoURL)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch(err => console.error("Connection error", err));

server.listen(PORT, () => {
  console.log(`game-gateway-service is running on port ${PORT}`);
});

main()
  .then(async () => {})
  .catch(async e => {
    console.error(e);
    await mongoose.disconnect();
    process.exit(1);
  });
