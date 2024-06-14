import { io } from "../index.js";
import redisClient from "../utils/redisClient.js";
import MessageHistoryService from "../services/MessageHistoryService.js";

class SocketService {
  static async connectUser(username, socketId) {
    const userSockets = await this.getUserSockets(username);
    userSockets.push(socketId);
    await redisClient.hSet(
      "usernameSocketIds",
      username,
      JSON.stringify(userSockets)
    );
  }

  static async disconnectUser(username, socketId) {
    const userSockets = await this.getUserSockets(username);
    const updatedSockets = userSockets.filter(id => id !== socketId);

    if (updatedSockets.length > 0) {
      await redisClient.hSet(
        "usernameSocketIds",
        username,
        JSON.stringify(updatedSockets)
      );
    } else {
      await redisClient.hDel("usernameSocketIds", username);
    }
  }

  static async getUserSockets(username) {
    const sockets = await redisClient.hGet("usernameSocketIds", username);
    return sockets ? JSON.parse(sockets) : [];
  }

  static async getAllOnlineUsernames() {
    return await redisClient.hKeys("usernameSocketIds");
  }

  static async handleChatSubscriptions(socket, username) {
    socket.on("on-chat-open", async receiverUsername => {
      try {
        const { data } = await MessageHistoryService.getMessageHistory([
          username,
          receiverUsername,
        ]);
        if (data && data.messageHistory) {
          socket.emit("update-chat", data.messageHistory, receiverUsername);
          console.log(
            `Chat history sent for ${username} and ${receiverUsername}.`
          );
        }
      } catch (err) {
        console.error(
          `Error retrieving chat history for ${username} and ${receiverUsername}: `,
          err.message
        );
      }
    });

    socket.on("on-read-messages", async ({ requestingUsername, usernames }) => {
      try {
        const { data } = await MessageHistoryService.readAllUnreadMessages(
          requestingUsername,
          usernames
        );
        if (data) {
          const otherUserInChat = usernames.find(
            username => username !== requestingUsername
          );
          socket.emit("unread-count-messages", otherUserInChat, 0);
        }
      } catch (err) {
        console.error("An error occurred: ", err.message);
      }
    });

    socket.on(
      "send-message",
      async ({ senderUsername, receiverUsername, message }) => {
        const usernames = [senderUsername, receiverUsername].sort();
        try {
          const { data } = await MessageHistoryService.addMessageToHistory(
            usernames,
            message
          );
          const { receiversSocketIds } = data;
          io.to(receiversSocketIds).emit("receive-message", {
            senderUsername,
            message,
          });
          console.log(
            `Message from ${senderUsername} to ${receiverUsername}: "${message}" delivered to sockets: ${receiversSocketIds?.join(
              ", "
            )}`
          );
        } catch (err) {
          console.error(
            `Error sending message from ${senderUsername} to ${receiverUsername}: `,
            err.message
          );
        }
      }
    );
  }

  static async setupSocketConnection() {
    io.on("connection", async socket => {
      console.log("User connected");
      let savedUsername;

      socket.on("online-ping", async username => {
        savedUsername = username;
        await this.handleChatSubscriptions(socket, savedUsername);

        await this.connectUser(savedUsername, socket.id);

        console.log(
          `User ${savedUsername} connected with socket ID ${socket.id}. Current online users:`,
          await this.getAllOnlineUsernames()
        );
        const onlineUsernames = await this.getAllOnlineUsernames();
        socket.emit("online-users", onlineUsernames);
        socket.broadcast.emit("user-connection", savedUsername, true);

        try {
          await MessageHistoryService.postUser(savedUsername, socket.id);
          console.log(
            `PostUser successful for ${savedUsername} with socket ID ${socket.id}.`
          );
        } catch (error) {
          console.error(
            `Error in PostUser for ${savedUsername} with socket ID ${socket.id}:`,
            error.message
          );
        }
      });

      socket.on("disconnect", async () => {
        if (savedUsername) {
          await this.disconnectUser(savedUsername, socket.id);

          console.log(
            `Socket ID ${socket.id} for user ${savedUsername} disconnected.`
          );

          const remainingSockets = await this.getUserSockets(savedUsername);
          if (remainingSockets.length === 0) {
            socket.broadcast.emit("user-connection", savedUsername, false);
          }

          try {
            await MessageHistoryService.deleteUser(socket.id);
            console.log(
              `DeleteUser called successfully for socket ID ${socket.id}.`
            );
          } catch (error) {
            console.error(
              `Error in DeleteUser for socket ID ${socket.id}:`,
              error.message
            );
          }
        }
      });
    });
  }
}

export default SocketService;
