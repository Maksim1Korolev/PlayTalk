import { io } from "../index.js";
import redisClient from "../utils/redisClient.js";

const USERNAME_SOCKETS_KEY = "usernameSockets";

class SocketService {
  constructor() {
    this.usernameSockets = new Map();
  }

  async initialize() {
    await redisClient.connect();
  }

  async shutdown() {
    await redisClient.quit();
  }

  async addUserSocket(username, socketId) {
    let userSockets = await redisClient.hget(USERNAME_SOCKETS_KEY, username);
    userSockets = userSockets ? JSON.parse(userSockets) : [];
    if (!userSockets.includes(socketId)) {
      userSockets.push(socketId);
      await redisClient.hset(
        USERNAME_SOCKETS_KEY,
        username,
        JSON.stringify(userSockets)
      );
    }
  }

  async removeUserSocket(username, socketId) {
    let userSockets = await redisClient.hget(USERNAME_SOCKETS_KEY, username);
    userSockets = userSockets ? JSON.parse(userSockets) : [];
    userSockets = userSockets.filter(id => id !== socketId);
    if (userSockets.length === 0) {
      await redisClient.hdel(USERNAME_SOCKETS_KEY, username);
    } else {
      await redisClient.hset(
        USERNAME_SOCKETS_KEY,
        username,
        JSON.stringify(userSockets)
      );
    }
  }

  async getUserSockets(username) {
    let userSockets = await redisClient.hget(USERNAME_SOCKETS_KEY, username);
    return userSockets ? JSON.parse(userSockets) : [];
  }

  async getAllOnlineUsers() {
    const users = await redisClient.hkeys(USERNAME_SOCKETS_KEY);
    return users;
  }

  handleConnection(socket) {
    let savedUsername;

    socket.on("online-ping", async username => {
      savedUsername = username;
      await this.addUserSocket(savedUsername, socket.id);

      const onlineUsers = await this.getAllOnlineUsers();
      io.emit("online-users", onlineUsers);
      io.emit("user-connection", savedUsername, true);

      console.log(
        `User ${savedUsername} connected with socket ID ${socket.id}.`
      );
    });

    socket.on("disconnect", async () => {
      if (savedUsername) {
        await this.removeUserSocket(savedUsername, socket.id);

        const onlineUsers = await this.getAllOnlineUsers();
        io.emit("online-users", onlineUsers);
        io.emit("user-connection", savedUsername, false);

        console.log(
          `User ${savedUsername} disconnected with socket ID ${socket.id}.`
        );
      }
    });
  }

  async connectCommunication() {
    io.on("connection", socket => this.handleConnection(socket));
  }
}

export default new SocketService();
