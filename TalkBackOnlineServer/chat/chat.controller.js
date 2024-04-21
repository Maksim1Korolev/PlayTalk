import axios from "axios";
import { io } from "../index.js";

export const connectUserToChat = async (username, socket) => {
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
  );
};

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
export const DeleteUser = async (socketId) => {
  return await axios
    .delete(`${process.env.CHAT_SERVER_URL}/${socketId}`)
    .catch(() => {
      console.log("Server is not connected or returns an error");
    });
};
