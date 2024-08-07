import { io } from "../index.js";
import redisClient from "../utils/redisClient.js";

class SocketService {
  static async setupSocketConnection() {
    io.on("connection", async socket => {
      console.log("Player connected with socket ID:", socket.id);
      let savedUsername;

      socket.on("online-ping", async username => {
        savedUsername = username;

        await this.connectUser(savedUsername, socket.id);

        console.log(
          `User ${savedUsername} connected with socket ID ${socket.id}. Current online users:`,
          await this.getAllOnlineUsernames()
        );
        const onlineUsernames = await this.getAllOnlineUsernames();
        socket.emit("online-players", onlineUsernames);
        socket.broadcast.emit("player-connection", savedUsername, true);
      });

      socket.on("disconnect", async () => {
        if (savedUsername) {
          await this.disconnectUser(savedUsername, socket.id);

          console.log(
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
}

export default SocketService;
