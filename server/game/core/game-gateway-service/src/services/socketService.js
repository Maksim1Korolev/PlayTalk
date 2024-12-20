import { getLogger } from "../utils/logger.js";

import { io } from "../index.js";

import redisClient from "../utils/redisClient.js";

import { handleInviteSubscriptions } from "./socketGameSessionHandler.js";
import { handleTicTacToeSubscriptions } from "./ticTacToe/socketSubs.js";

const logger = getLogger("SocketService");

class SocketService {
  static async setupSocketConnection() {
    io.on("connection", async socket => {
      const user = socket.request.user;

      if (!user) {
        logger.warn("Unauthorized socket connection attempt.");
        socket.disconnect(true);
        return;
      }

      logger.info(`${user.username} connected with socket ID: ${socket.id}`);
      const savedUsername = user.username;

      socket.on("online-ping", async () => {
        await this.connectUser(savedUsername, socket.id);

        try {
          await handleInviteSubscriptions(socket, savedUsername);
        } catch (err) {
          logger.error(
            `Error in handleInviteSubscriptions for user ${savedUsername}: ${err.message}`
          );
        }

        try {
          await handleTicTacToeSubscriptions(socket, savedUsername);
        } catch (err) {
          logger.error(
            `Error in handleTicTacToeSubscriptions for user ${savedUsername}: ${err.message}`
          );
          socket.emit("error", {
            message: "Failed to connect to Tic-Tac-Toe.",
          });
        }

        logger.info(
          `Online ping from ${savedUsername}. Current online users: ${await this.getOnlineUsernames()}`
        );
        socket.broadcast.emit("player-connection", savedUsername, true);
      });

      socket.on("disconnect", async () => {
        if (savedUsername) {
          await this.disconnectUser(savedUsername, socket.id);

          logger.info(
            `Socket ID ${socket.id} for user ${savedUsername} disconnected.`
          );

          const remainingSockets = await this.getUserSockets(savedUsername);
          if (remainingSockets.length === 0) {
            socket.broadcast.emit("player-connection", savedUsername, false);
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
    logger.info(`User ${username} connected with socket ID: ${socketId}`);
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
      logger.info(
        `Updated sockets for user ${username}. Remaining sockets: ${updatedSockets}`
      );
    } else {
      await redisClient.hDel(process.env.REDIS_USER_SOCKET_KEY, username);
      logger.info(`All sockets disconnected for user ${username}`);
    }
  }

  static async getUserSockets(username, excludedSocket) {
    const sockets = await redisClient.hGet(
      process.env.REDIS_USER_SOCKET_KEY,
      username
    );

    const socketList = sockets ? JSON.parse(sockets) : [];

    const filteredSockets = excludedSocket
      ? socketList.filter(socketId => socketId !== excludedSocket)
      : socketList;

    return filteredSockets;
  }

  static async getOnlineUsernames() {
    return await redisClient.hKeys(process.env.REDIS_USER_SOCKET_KEY);
  }
}

export default SocketService;
