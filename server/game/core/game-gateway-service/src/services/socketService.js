import { io } from "../index.js";
import redisClient from "../utils/redisClient.js";

class SocketService {
  static async setupSocketConnection() {
    io.on("connection", async socket => {
      console.log("Player connected with socket ID:", socket.id);
      let connectedPlayerData = {
        username: null,
        game: null,
        opponentUsername: null,
      };

      socket.on("online-ping", async username => {
        connectedPlayerData.username = username;

        await this.connectUser(connectedPlayerData, socket.id);

        console.log(
          `User ${connectedPlayerData.username} connected with socket ID ${socket.id}. Current online users:`,
          await this.getOnlineUsernames()
        );
        socket.broadcast.emit("player-connection", connectedPlayerData, true);
      });

      socket.on("disconnect", async () => {
        if (connectedPlayerData.username) {
          await this.disconnectUser(connectedPlayerData, socket.id);

          console.log(
            `Socket ID ${socket.id} for user ${connectedPlayerData.username} disconnected.`
          );

          const remainingSockets = await this.getUserSockets(
            connectedPlayerData.username
          );
          if (remainingSockets.length === 0) {
            socket.broadcast.emit(
              "player-connection",
              connectedPlayerData,
              false
            );
          }
        }
      });
    });
  }

  static async connectUser(playerData, socketId) {
    const userSockets = await this.getUserSockets(playerData.username);
    userSockets.push(socketId);
    await redisClient.hSet(
      process.env.REDIS_USER_SOCKET_HASH_KEY,
      playerData.username,
      JSON.stringify(userSockets)
    );
  }

  static async disconnectUser(playerData, socketId) {
    const userSockets = await this.getUserSockets(playerData.username);
    const updatedSockets = userSockets.filter(id => id !== socketId);

    if (updatedSockets.length > 0) {
      await redisClient.hSet(
        process.env.REDIS_USER_SOCKET_HASH_KEY,
        playerData.username,
        JSON.stringify(updatedSockets)
      );
    } else {
      await redisClient.hDel(
        process.env.REDIS_USER_SOCKET_HASH_KEY,
        playerData.username
      );
    }
  }

  static async getUserSockets(username) {
    const sockets = await redisClient.hGet(
      process.env.REDIS_USER_SOCKET_HASH_KEY,
      username
    );
    return sockets ? JSON.parse(sockets) : [];
  }

  static async getOnlineUsernames() {
    return await redisClient.hKeys(process.env.REDIS_USER_SOCKET_HASH_KEY);
  }
}

export default SocketService;
