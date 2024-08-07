import { io } from "../index.js";
import redisClient from "../utils/redisClient.js";
import MessageHistoryService from "./messageHistoryService.js";

//TODO:Divide chat and online logic to separate files
class SocketService {
  static async setupSocketConnection() {
    io.on("connection", async socket => {
      console.log("User connected with socket ID:", socket.id);
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
        }
      });
    });
  }

  static async connectUser(username, socketId) {
    const userSockets = await this.getUserSockets(username);
    userSockets.push(socketId);
    await redisClient.hSet(
      process.env.REDIS_USER_SOCKET_HASH_KEY,
      username,
      JSON.stringify(userSockets)
    );
  }

  static async disconnectUser(username, socketId) {
    const userSockets = await this.getUserSockets(username);
    const updatedSockets = userSockets.filter(id => id !== socketId);

    if (updatedSockets.length > 0) {
      await redisClient.hSet(
        process.env.REDIS_USER_SOCKET_HASH_KEY,
        username,
        JSON.stringify(updatedSockets)
      );
    } else {
      await redisClient.hDel(process.env.REDIS_USER_SOCKET_HASH_KEY, username);
    }
  }

  static async getUserSockets(username) {
    const sockets = await redisClient.hGet(
      process.env.REDIS_USER_SOCKET_HASH_KEY,
      username
    );
    return sockets ? JSON.parse(sockets) : [];
  }

  static async getAllOnlineUsernames() {
    return await redisClient.hKeys(process.env.REDIS_USER_SOCKET_HASH_KEY);
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
          //TODO:Check need
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
          await MessageHistoryService.addMessageToHistory(usernames, message);
          const receiversSocketIds = await this.getUserSockets(
            receiverUsername
          );

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
}

export default SocketService;
