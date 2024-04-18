import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {},
});

io.on("connection", async (socket) => {
  console.log("user connected");
  let savedUsername;

  socket.on("online-ping", async (username) => {
    savedUsername = username;

    // OnLine logic
    onlineUsers.add(savedUsername);
    console.log(`Online users after ${savedUsername} connected:`, onlineUsers);
    socket.emit("online-users", Array.from(onlineUsers));

    socket.broadcast.emit(`user-connection`, savedUsername, true);

    //Chat logic
    await PostUser(username, socket.id);

    socket.on(
      "send-message",
      async ({ senderUsername, receiverUsername, message }) => {
        const { data: receiverSocketId } = await GetUserId(receiverUsername);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit(`receive-message`, {
            senderUsername,
            message,
          });
        }
      }
      //else {
      //	console.log(`Receiver ${receiverUsername} is not available.`)
      //	socket.emit('receiver-not-available', `${receiverUsername} is not available.`)
      //}
    );
  });

  socket.on("disconnect", async () => {
    if (savedUsername) {
      onlineUsers.delete(savedUsername);
      console.log(
        `Online users after ${savedUsername} disconnected:`,
        onlineUsers
      );
      socket.broadcast.emit("user-connection", savedUsername, false);

      await DeleteUser(socket.id);
    }
  });
});

const PostUser = async (username, socketId) => {
  return await axios
    .post(`${process.env.CHAT_SERVER_URL}/addToChatLobby`, {
      username,
      socketId,
    })
    .catch((e) => {
      console.log("Server is not connected or returns an error");
    });
};
const GetUserId = async (receiverUsername) => {
  return await axios
    .get(`${process.env.CHAT_SERVER_URL}/${receiverUsername}`)
    .catch((e) => {
      console.log("Server is not connected or returns an error");
    });
};
const DeleteUser = async (socketId) => {
  return await axios
    .delete(`${process.env.CHAT_SERVER_URL}/${socketId}`)
    .catch(() => {
      console.log("Server is not connected or returns an error");
    });
};

const PORT = process.env.PORT || 4000;
const onlineUsers = new Set();

async function main() {
  app.use(cors());
  app.use(express.json());

  // const __dirname = path.resolve();
  //app.use('/uploads', express.static(path.join(__dirname, '/uploads/')))
}

server.listen(PORT, () => {
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

main();
