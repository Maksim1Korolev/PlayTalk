import axios from "axios";
import { io } from "../index.js";

export const connectUserToChat = async (username, socket, receiverUsername) => {
  socket.on(
    "send-message",
    async ({ senderUsername, receiverUsername, message }) => {
      const usernames = [senderUsername, receiverUsername];
      usernames.sort();
      const { data } = await GetUserIds(usernames, message);
      if (!data) {
        return;
      }

      const { receiversSocketIds } = data;

      io.to(receiversSocketIds).emit(`receive-message`, {
        senderUsername,
        message,
      });
    }
  );

  return (await GetMessageHistory([username, receiverUsername])) || [];
};

export const PostUser = async (addedUserUsername, addedUserSocketId) => {
  return await axios
    .post(`${process.env.CHAT_SERVER_URL}/addToChatLobby`, {
      addedUserUsername,
      addedUserSocketId,
    })
    .catch((e) => {
      console.log("Server is not connected or returns an error");
    });
};
const GetMessageHistory = async (usernames) => {
  const query = usernames
    .map((u) => `usernames=${encodeURIComponent(u)}`)
    .join("&");
  console.log(`Query for GetMessageHistory: ${query}`);
  return await axios
    .get(`${process.env.CHAT_SERVER_URL}/messageHistory?${query}`)
    .catch((e) => {
      console.log("Server is not connected or returns an error", e);
    });
};

const GetUserIds = async (usernames, message) => {
  return await axios
    .post(`${process.env.CHAT_SERVER_URL}/messages/message`, {
      usernames,
      message,
    })
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
