import SocketService from "../socketService.js";
import { io } from "../../index.js";
import redisClient from "../../utils/redisClient.js";
import { handleChatSubscriptions } from "../chat/socketSubs.js";

import { setupMockSocketAndUser } from "../../__mocks__/io.js";

jest.mock("../chat/socketSubs.js", () => ({
  handleChatSubscriptions: jest.fn(),
}));

describe("SocketService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("setupSocketConnection", () => {
    let mockSocket, mockUser;

    beforeEach(() => {
      ({ mockSocket, mockUser } = setupMockSocketAndUser());
      jest.clearAllMocks();
      io.on.mockImplementation((event, callback) => {
        if (event === "connection") {
          callback(mockSocket);
        }
      });
    });

    it("should disconnect unauthorized socket connections", async () => {
      mockSocket.request.user = null;

      await SocketService.setupSocketConnection();

      expect(mockSocket.disconnect).toHaveBeenCalledWith(true);
    });

    it("should set up event handlers for authorized socket connections", async () => {
      await SocketService.setupSocketConnection();

      expect(mockSocket.on).toHaveBeenCalledWith(
        "online-ping",
        expect.any(Function)
      );
      expect(mockSocket.on).toHaveBeenCalledWith(
        "disconnect",
        expect.any(Function)
      );
    });

    it("should handle 'online-ping' event correctly", async () => {
      redisClient.hGet.mockResolvedValue(null);

      await SocketService.setupSocketConnection();

      const onlinePingHandler = mockSocket.on.mock.calls.find(
        call => call[0] === "online-ping"
      )[1];
      await onlinePingHandler();

      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USER_SOCKET_KEY,
        mockUser.username,
        JSON.stringify([mockSocket.id])
      );
      expect(handleChatSubscriptions).toHaveBeenCalledWith(
        mockSocket,
        mockUser.username
      );
      expect(mockSocket.broadcast.emit).toHaveBeenCalledWith(
        "user-connection",
        mockUser.username,
        true
      );
    });

    it("should handle 'disconnect' event correctly", async () => {
      redisClient.hGet
        .mockResolvedValueOnce(JSON.stringify([mockSocket.id]))
        .mockResolvedValueOnce(JSON.stringify([]));

      await SocketService.setupSocketConnection();

      const disconnectHandler = mockSocket.on.mock.calls.find(
        call => call[0] === "disconnect"
      )[1];

      expect(disconnectHandler).toBeDefined();

      await disconnectHandler();

      expect(redisClient.hDel).toHaveBeenCalledWith(
        process.env.REDIS_USER_SOCKET_KEY,
        mockUser.username
      );

      expect(redisClient.hSet).not.toHaveBeenCalled();

      expect(mockSocket.broadcast.emit).toHaveBeenCalledWith(
        "user-connection",
        mockUser.username,
        false
      );
    });

    it("should not emit disconnect if there are other sockets", async () => {
      redisClient.hGet.mockResolvedValue(
        JSON.stringify([mockSocket.id, "socket456"])
      );

      await SocketService.setupSocketConnection();

      const disconnectHandler = mockSocket.on.mock.calls.find(
        call => call[0] === "disconnect"
      )[1];
      await disconnectHandler();

      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USER_SOCKET_KEY,
        mockUser.username,
        JSON.stringify(["socket456"])
      );

      expect(redisClient.hDel).not.toHaveBeenCalled();

      expect(mockSocket.broadcast.emit).not.toHaveBeenCalled();
    });
  });

  describe("connectUser", () => {
    it("should add the socket ID to the user's list and store it in Redis", async () => {
      redisClient.hGet.mockResolvedValue(JSON.stringify(["socket123"]));

      await SocketService.connectUser("testUser", "socket456");

      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USER_SOCKET_KEY,
        "testUser",
        JSON.stringify(["socket123", "socket456"])
      );
    });
  });

  describe("disconnectUser", () => {
    it("should remove the socket ID and update the user's sockets in Redis", async () => {
      redisClient.hGet.mockResolvedValue(
        JSON.stringify(["socket123", "socket456"])
      );

      await SocketService.disconnectUser("testUser", "socket123");

      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_USER_SOCKET_KEY,
        "testUser",
        JSON.stringify(["socket456"])
      );
    });

    it("should delete the user from Redis if there are no more sockets", async () => {
      redisClient.hGet.mockResolvedValue(JSON.stringify(["socket123"]));

      await SocketService.disconnectUser("testUser", "socket123");

      expect(redisClient.hDel).toHaveBeenCalledWith(
        process.env.REDIS_USER_SOCKET_KEY,
        "testUser"
      );
    });
  });

  describe("getUserSockets", () => {
    it("should return an empty array if no sockets are found", async () => {
      redisClient.hGet.mockResolvedValue(null);

      const result = await SocketService.getUserSockets("testUser");

      expect(result).toEqual([]);
    });

    it("should return a list of sockets for the user", async () => {
      const sockets = ["socket123", "socket456"];
      redisClient.hGet.mockResolvedValue(JSON.stringify(sockets));

      const result = await SocketService.getUserSockets("testUser");

      expect(result).toEqual(sockets);
    });
  });

  describe("getOnlineUsernames", () => {
    it("should return the list of online usernames from Redis", async () => {
      const usernames = ["user1", "user2"];
      redisClient.hKeys.mockResolvedValue(usernames);

      const result = await SocketService.getOnlineUsernames();

      expect(result).toEqual(usernames);
    });
  });
});
