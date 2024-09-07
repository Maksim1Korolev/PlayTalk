import { io } from "../index.js";
import redisClient from "../utils/redisClient.js";
import { handleInviteSubscriptions } from "./socketGameSessionHandler.js";
import handleTicTacToeSubscriptions from "./ticTacToe/socketSubs.js";

class SocketService {
  static async setupSocketConnection() {
    io.on("connection", async socket => {
      const user = socket.request.user;

      if (!user) {
        socket.disconnect(true);
        return;
      }

      console.log(`${user.username} connected with socket ID: ${socket.id}`);
      const savedUsername = user.username;

      socket.on("online-ping", async () => {
        await this.connectUser(savedUsername, socket.id);
        await handleInviteSubscriptions(socket, savedUsername);
        await handleTicTacToeSubscriptions(socket, savedUsername);

        console.log(
          `User ${savedUsername} connected with socket ID ${socket.id}. Current online users:`,
          await this.getOnlineUsernames()
        );
        socket.broadcast.emit(
          "player-connection",
          { username: savedUsername },
          true
        );
      });

      socket.on("disconnect", async () => {
        if (savedUsername) {
          await this.disconnectUser(savedUsername, socket.id);

          console.log(
            `Socket ID ${socket.id} for user ${savedUsername} disconnected.`
          );

          const remainingSockets = await this.getUserSockets(savedUsername);
          if (remainingSockets.length === 0) {
            socket.broadcast.emit(
              "player-connection",
              { username: savedUsername },
              false
            );
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
