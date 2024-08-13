import { io } from "../index.js";
import redisClient from "../utils/redisClient.js";

class SocketService {
  static async setupSocketConnection() {
    io.on("connection", async socket => {
      console.log("Player connected with socket ID:", socket.id);
      let savedUsername;

      socket.on("online-ping", async username => {
        savedUsername = username;
        const gameData = [];

        //await this.storeGameData(savedUsername, gameData);
        await this.connectUser(savedUsername, socket.id);

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

  static async storeGameData(username, gameData) {
    await redisClient.hSet(
      process.env.REDIS_USER_GAMES_HASH_KEY,
      username,
      JSON.stringify(gameData)
    );
  }

  static async getGameData(username) {
    const data = await redisClient.hGet(
      process.env.REDIS_USER_GAMES_HASH_KEY,
      username
    );
    return data ? JSON.parse(data) : [];
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

  static async getOnlineUsernames() {
    return await redisClient.hKeys(process.env.REDIS_USER_SOCKET_HASH_KEY);
  }
}

export default SocketService;
