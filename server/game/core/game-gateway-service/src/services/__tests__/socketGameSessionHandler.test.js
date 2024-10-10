import { io } from "../../index.js";
import {
  handleInviteSubscriptions,
  endGame,
} from "../socketGameSessionHandler.js";

import SocketService from "../socketService.js";
import ActiveGamesService from "../activeGamesService.js";
import TicTacToeGameService from "../ticTacToe/gameService.js";

jest.mock("../activeGamesService.js");
jest.mock("../ticTacToe/gameService.js");
jest.mock("../socketService.js", () => ({
  getUserSockets: jest.fn(),
}));

describe("SocketGameSessionHandler", () => {
  let socket, mockUser;

  beforeEach(() => {
    SocketService.getUserSockets.mockResolvedValue([]);
    jest.clearAllMocks();
    socket = {
      on: jest.fn(),
      id: "socket123",
    };
    mockUser = { username: "testUser" };
    socket.request = { user: mockUser };
  });

  describe("handleInviteSubscriptions", () => {
    describe("handleInviteSubscriptions", () => {
      it("should set up 'send-game-invite' listener but not call io.to() if no sockets are found", async () => {
        await handleInviteSubscriptions(socket, mockUser.username);

        const eventHandler = socket.on.mock.calls.find(
          ([event]) => event === "send-game-invite"
        )[1];
        expect(eventHandler).toBeDefined();

        const gameInvitePayload = {
          receiverUsername: "receiver",
          gameName: "tic-tac-toe",
        };
        await eventHandler(gameInvitePayload);

        expect(SocketService.getUserSockets).toHaveBeenCalledWith("receiver");
        expect(io.to).not.toHaveBeenCalled();
      });
    });

    it("should set up 'accept-game' listener", async () => {
      await handleInviteSubscriptions(socket, mockUser.username);

      const eventHandler = socket.on.mock.calls.find(
        ([event]) => event === "accept-game"
      )[1];
      expect(eventHandler).toBeDefined();

      const gameAcceptPayload = {
        opponentUsername: "opponent",
        gameName: "tic-tac-toe",
      };
      await eventHandler(gameAcceptPayload);

      expect(ActiveGamesService.addActiveGame).toHaveBeenCalledWith(
        mockUser.username,
        "opponent",
        "tic-tac-toe"
      );
      expect(TicTacToeGameService.startGame).toHaveBeenCalledWith(
        mockUser.username,
        "opponent"
      );
      expect(io.to).toHaveBeenCalled();
      expect(io.emit).toHaveBeenCalledWith("start-game", {
        opponentUsername: "opponent",
        gameName: "tic-tac-toe",
      });
    });
  });

  describe("endGame", () => {
    it("should notify both users and remove the active game", async () => {
      SocketService.getUserSockets
        .mockResolvedValueOnce(["socket123"])
        .mockResolvedValueOnce(["socket456"]);

      const gamePayload = {
        username1: "player1",
        username2: "player2",
        gameName: "tic-tac-toe",
        winnerUsername: "player1",
      };

      await endGame(
        gamePayload.username1,
        gamePayload.username2,
        gamePayload.gameName,
        gamePayload.winnerUsername
      );

      expect(SocketService.getUserSockets).toHaveBeenCalledWith("player1");
      expect(SocketService.getUserSockets).toHaveBeenCalledWith("player2");

      expect(io.to).toHaveBeenCalledWith(["socket123"]);
      expect(io.emit).toHaveBeenCalledWith("end-game", {
        opponentUsername: "player2",
        gameName: "tic-tac-toe",
        winner: "player1",
      });

      expect(io.to).toHaveBeenCalledWith(["socket456"]);
      expect(io.emit).toHaveBeenCalledWith("end-game", {
        opponentUsername: "player1",
        gameName: "tic-tac-toe",
        winner: "player1",
      });

      expect(ActiveGamesService.removeActiveGame).toHaveBeenCalledWith(
        "player1",
        "player2",
        "tic-tac-toe"
      );
    });
  });
});
