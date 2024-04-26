import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectToGameLobby } from "./connection/connection.controller.js";
import cors from "cors";
import connectionRouter from "./connection/connection.routes.js";

dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());
  app.use("/api/connection", connectionRouter);
}
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {},
});

connectToGameLobby();

const PORT = process.env.PORT || 4200;

const mongoURL = process.env.DATABASE_URL;

mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Connection error", err));

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

main()
  .then(async () => {})
  .catch(async (e) => {
    console.error(e);
    await mongoose.disconnect();
    process.exit(1);
  });
