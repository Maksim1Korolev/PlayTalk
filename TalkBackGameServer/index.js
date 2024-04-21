import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectToGameLobby } from "./connection/connection.controller.js";

dotenv.config();

const app = express();

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {},
});

connectToGameLobby();

const PORT = process.env.PORT || 4200;

async function main() {
  app.use(cors());
  app.use(express.json());

  // const __dirname = path.resolve();
  //app.use('/uploads', express.static(path.join(__dirname, '/uploads/')))
}

server.listen(PORT, () => {
  console.log(`server running in on port ${PORT}`);
});

main();
