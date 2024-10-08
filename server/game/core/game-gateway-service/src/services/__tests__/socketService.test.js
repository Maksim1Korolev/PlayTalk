import SocketService from "../socketService.js";
import { io } from "../../index.js";
import redisClient from "../../utils/redisClient.js";
import { handleInviteSubscriptions } from "../socketGameSessionHandler.js";
import { handleTicTacToeSubscriptions } from "../ticTacToe/socketSubs.js";

jest.mock("../socketGameSessionHandler.js", () => ({
  handleInviteSubscriptions: jest.fn(),
}));
jest.mock("../ticTacToe/socketSubs.js", () => ({
  handleTicTacToeSubscriptions: jest.fn(),
}));

describe("SocketService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("setupSocketConnection", () => {
    let mockSocket, mockUser;

    beforeEach(() => {
      mockUser = { username: "testUser" };
      mockSocket = {
        id: "socket123",
        request: { user: mockUser },
        on: jest.fn(),
        disconnect: jest.fn(),
        emit: jest.fn(),
        broadcast: {
          emit: jest.fn(),
        },
      };

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
      expect(handleInviteSubscriptions).toHaveBeenCalledWith(
        mockSocket,
        mockUser.username
      );
      expect(handleTicTacToeSubscriptions).toHaveBeenCalledWith(
        mockSocket,
        mockUser.username
      );
      expect(mockSocket.broadcast.emit).toHaveBeenCalledWith(
        "player-connection",
        { username: mockUser.username },
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
        "player-connection",
        { username: mockUser.username },
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
