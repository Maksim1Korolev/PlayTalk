import {
  PostUser,
  DeleteUser,
  connectUserToChat,
} from "../chat/chat.controller.js";
import { io } from "../index.js";

export const connectOnline = async () => {
  const onlineUsers = new Set();

  io.on("connection", async (socket) => {
    console.log("User connected");
    let savedUsername;

    socket.on("online-ping", async (username) => {
      savedUsername = username;

      // Online logic
      onlineUsers.add(savedUsername);
      console.log(
        `Online users after ${savedUsername} connected:`,
        onlineUsers
      );
      socket.emit("online-users", Array.from(onlineUsers));
      socket.broadcast.emit("user-connection", savedUsername, true);

      // Chat logic
      try {
        await PostUser(savedUsername, socket.id);
        console.log(
          "PostUser call succeeded. Continuing with the rest of the code."
        );
      } catch (error) {
        console.error("Error in PostUser:", error);
        return;
      }

      socket.on("on-chat-open", async (receiverUsername) => {
        try {
          const { data } = await connectUserToChat(
            savedUsername,
            socket,
            receiverUsername
          );
          if (data) {
            const { messageHistory } = data;
            socket.emit("update-chat", messageHistory, receiverUsername);
          }
        } catch (error) {
          console.error("Error in connectUserToChat:", error);
        }
      });
    });

    socket.on("disconnect", async () => {
      if (savedUsername) {
        onlineUsers.delete(savedUsername);
        console.log(
          `Online users after ${savedUsername} disconnected:`,
          onlineUsers
        );
        socket.broadcast.emit("user-connection", savedUsername, false);

        try {
          await DeleteUser(socket.id);
        } catch (error) {
          console.error("Error in DeleteUser:", error);
        }
      }
    });
  });
};
