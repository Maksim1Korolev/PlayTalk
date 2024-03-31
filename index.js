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

const PORT = process.env.PORT || 4100;

const userSockets = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-chat-lobby", ({ senderUsername, receiverUsername }) => {
    console.log(
      `${senderUsername} joined the chat lobby, intending to chat with ${receiverUsername}`
    );
    userSockets.set(senderUsername, socket.id);

    socket.emit(
      "joined-chat-lobby",
      `Joined chat lobby with ${receiverUsername}`
    );
    console.log(`${senderUsername} successfully joined the chat lobby.`);
  });

  socket.on("request-chat", ({ senderUsername, receiverUsername }) => {
    console.log(
      `${senderUsername} is requesting to start a chat with ${receiverUsername}`
    );
    const receiverSocketId = userSockets.get(receiverUsername);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("chat-request-received", { senderUsername });
      console.log(
        `Chat request from ${senderUsername} forwarded to ${receiverUsername}.`
      );
    } else {
      console.log(`${receiverUsername} is not available to start a chat.`);
      socket.emit(
        "receiver-not-available",
        `${receiverUsername} is not available for chat.`
      );
    }
  });

  socket.on("send-message", ({ senderUsername, receiverUsername, message }) => {
    console.log(
      `${senderUsername} sent a message to ${receiverUsername}: ${message}`
    );
    const receiverSocketId = userSockets.get(receiverUsername);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", {
        senderUsername,
        message,
      });
    } else {
      console.log(`Receiver ${receiverUsername} is not available.`);
      socket.emit(
        "receiver-not-available",
        `${receiverUsername} is not available.`
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id); // Disconnect message with socket.id for debugging
    const usernameToDisconnect = [...userSockets.entries()].find(
      ([, v]) => v === socket.id
    )?.[0];
    if (usernameToDisconnect) {
      userSockets.delete(usernameToDisconnect);
      console.log(
        `${usernameToDisconnect} disconnected and was removed from the chat lobby.`
      );
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
