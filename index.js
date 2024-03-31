import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {},
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("user connected");
  let savedUsername;

  socket.on("online-ping", (username) => {
    savedUsername = username;

    onlineUsers.add(savedUsername);
    console.log(`Online users after ${savedUsername} connected:`, onlineUsers);
    socket.emit("online-users", Array.from(onlineUsers));

    socket.broadcast.emit(`user-connection`, savedUsername, true);
  });

  socket.on("disconnect", () => {
    if (savedUsername) {
      onlineUsers.delete(savedUsername);
      console.log(
        `Online users after ${savedUsername} disconnected:`,
        onlineUsers
      );
      socket.broadcast.emit("user-connection", savedUsername, false);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
