import { io } from "../index.js";
import redisClient from "../utils/redisClient.js";
import { getLogger } from "../utils/logger.js";
const logger = getLogger("SocketService");

import { handleChatSubscriptions } from "./chat/socketSubs.js";

class SocketService {
  static async setupSocketConnection() {
    io.on("connection", async socket => {
      const user = socket.request.user;

      if (!user) {
        socket.disconnect(true);
        return;
      }

      logger.info(`${user.username} connected with socket ID: ${socket.id}`);
      const savedUsername = user.username;

      socket.on("online-ping", async () => {
        await this.connectUser(savedUsername, socket.id);
        try {
          await handleChatSubscriptions(socket, savedUsername);
        } catch (err) {
          logger.error(
            `Error in handleChatSubscriptions for user ${savedUsername}: ${err.message}`
          );
          socket.emit("error", { message: "Failed to connect to chat." });
        }

        logger.info(
          `Online ping from ${savedUsername}. Current online users: ${await this.getOnlineUsernames()}`
        );
        socket.broadcast.emit("user-connection", savedUsername, true);
      });

      socket.on("disconnect", async () => {
        if (savedUsername) {
          await this.disconnectUser(savedUsername, socket.id);

          logger.info(
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
      process.env.REDIS_USER_SOCKET_KEY,
      username,
      JSON.stringify(userSockets)
    );
  }

  static async disconnectUser(username, socketId) {
    const userSockets = await this.getUserSockets(username);
    const updatedSockets = userSockets.filter(id => id !== socketId);

    if (updatedSockets.length > 0) {
      await redisClient.hSet(
        process.env.REDIS_USER_SOCKET_KEY,
        username,
        JSON.stringify(updatedSockets)
      );
    } else {
      await redisClient.hDel(process.env.REDIS_USER_SOCKET_KEY, username);
    }
  }

  static async getUserSockets(username) {
    const sockets = await redisClient.hGet(
      process.env.REDIS_USER_SOCKET_KEY,
      username
    );
    return sockets ? JSON.parse(sockets) : [];
  }

  static async getOnlineUsernames() {
    return await redisClient.hKeys(process.env.REDIS_USER_SOCKET_KEY);
  }
}

export default SocketService;
