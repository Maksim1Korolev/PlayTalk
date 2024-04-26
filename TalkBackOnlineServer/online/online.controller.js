import {
  PostUser,
  DeleteUser,
  GetUserIds,
  GetMessageHistory,
} from "../chat/chat.controller.js";
import { io } from "../index.js";

const onlineUserMappings = new Map();

export const getOnlineUsernames = async (req, res, next) => {
  try {
    const onlineUsernames = Array.from(onlineUserMappings.keys());
    return res.status(200).json({ onlineUsernames });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const connectOnline = async () => {
  io.on("connection", async (socket) => {
    console.log("User connected");
    let savedUsername;

    socket.on("online-ping", async (username) => {
      savedUsername = username;

      if (!onlineUserMappings.has(savedUsername)) {
        onlineUserMappings.set(savedUsername, new Set());
      }
      onlineUserMappings.get(savedUsername).add(socket.id);

      console.log(
        `User ${savedUsername} connected with socket ID ${socket.id}. Current online users:`,
        Array.from(onlineUserMappings.keys())
      );
      socket.emit("online-users", Array.from(onlineUserMappings.keys()));
      socket.broadcast.emit("user-connection", savedUsername, true);

      try {
        await PostUser(savedUsername, socket.id);
        console.log(
          `PostUser successful for ${savedUsername} with socket ID ${socket.id}.`
        );
      } catch (error) {
        console.error(
          `Error in PostUser for ${savedUsername} with socket ID ${socket.id}:`,
          error
        );
      }
    });

    socket.on("on-chat-open", async (receiverUsername) => {
      try {
        const data = await GetMessageHistory([savedUsername, receiverUsername]);
        if (data && data.messageHistory) {
          socket.emit("update-chat", data.messageHistory, receiverUsername);
          console.log(
            `Chat history sent for ${savedUsername} and ${receiverUsername}.`
          );
        }
      } catch (error) {
        console.error(
          `Error retrieving chat history for ${savedUsername} and ${receiverUsername}:`,
          error
        );
      }
    });

    socket.on(
      "send-message",
      async ({ senderUsername, receiverUsername, message }) => {
        const usernames = [senderUsername, receiverUsername].sort();
        try {
          const { receiversSocketIds } = await GetUserIds(usernames);
          io.to(receiversSocketIds).emit("receive-message", {
            senderUsername,
            message,
          });
          console.log(
            `Message from ${senderUsername} to ${receiverUsername}: "${message}" delivered to sockets: ${receiversSocketIds.join(
              ", "
            )}`
          );
        } catch (error) {
          console.error(
            `Error sending message from ${senderUsername} to ${receiverUsername}:`,
            error
          );
        }
      }
    );

    socket.on("disconnect", async () => {
      if (savedUsername && onlineUserMappings.has(savedUsername)) {
        const sockets = onlineUserMappings.get(savedUsername);
        sockets.delete(socket.id);

        console.log(
          `Socket ID ${socket.id} for user ${savedUsername} disconnected. Remaining sockets: ${sockets.size}`
        );

        if (sockets.size === 0) {
          onlineUserMappings.delete(savedUsername);
          console.log(
            `All sockets for ${savedUsername} are disconnected. Removing from online users.`
          );
          socket.broadcast.emit("user-connection", savedUsername, false);
        }

        try {
          await DeleteUser(socket.id);
          console.log(
            `DeleteUser called successfully for socket ID ${socket.id}.`
          );
        } catch (error) {
          console.error(
            `Error in DeleteUser for socket ID ${socket.id}:`,
            error
          );
        }
      }
    });
  });
};
