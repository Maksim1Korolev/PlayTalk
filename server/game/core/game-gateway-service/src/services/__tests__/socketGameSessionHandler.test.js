import { io } from "../../index.js";

import { setupMockSocketAndUser } from "../../__mocks__/io.js";
import ActiveGamesService from "../activeGamesService.js";
import {
  endGame,
  handleInviteSubscriptions,
} from "../socketGameSessionHandler.js";
import SocketService from "../socketService.js";
import TicTacToeGameService from "../ticTacToe/gameService.js";

jest.mock("../activeGamesService.js");
jest.mock("../socketService.js");
jest.mock("../ticTacToe/gameService.js");

describe("SocketGameSessionHandler", () => {
  let mockSocket, username, opponentUsername, gameName;

  beforeEach(() => {
    jest.clearAllMocks();
    ({ mockSocket, username } = setupMockSocketAndUser());
    opponentUsername = "player2";
    gameName = "tic-tac-toe";
  });

  describe("handleInviteSubscriptions", () => {
    it("should handle 'send-game-invite' event and send invite to receiver", async () => {
      SocketService.getUserSockets.mockResolvedValue(["socket1"]);
      await handleInviteSubscriptions(mockSocket, username);

      const sendInviteHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "send-game-invite"
      )[1];
      await sendInviteHandler({ receiverUsername: opponentUsername, gameName });

      expect(SocketService.getUserSockets).toHaveBeenCalledWith(
        opponentUsername
      );
      expect(io.to).toHaveBeenCalledWith(["socket1"]);
      expect(io.emit).toHaveBeenCalledWith("receive-game-invite", {
        senderUsername: username,
        gameName,
      });
    });

    it("should handle 'accept-game' event and start game connection", async () => {
      ActiveGamesService.addActiveGame.mockResolvedValue();
      TicTacToeGameService.startGame.mockResolvedValue();
      SocketService.getUserSockets.mockResolvedValue(["socket1"]);

      await handleInviteSubscriptions(mockSocket, username);
      const acceptGameHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "accept-game"
      )[1];
      await acceptGameHandler({ opponentUsername, gameName });

      expect(ActiveGamesService.addActiveGame).toHaveBeenCalledWith(
        username,
        opponentUsername,
        gameName
      );
      expect(TicTacToeGameService.startGame).toHaveBeenCalledWith(
        username,
        opponentUsername
      );
      expect(io.to).toHaveBeenCalledWith(["socket1"]);
      expect(io.emit).toHaveBeenCalledWith("start-game", {
        opponentUsername,
        gameName,
      });
    });
  });

  describe("endGame", () => {
    it("should handle ending a game and notify both players", async () => {
      const winnerUsername = username;
      const user1Sockets = ["socket1"];
      const user2Sockets = ["socket2"];

      SocketService.getUserSockets
        .mockResolvedValueOnce(user1Sockets)
        .mockResolvedValueOnce(user2Sockets);

      await endGame(username, opponentUsername, gameName, winnerUsername);

      expect(ActiveGamesService.removeActiveGame).toHaveBeenCalledWith(
        username,
        opponentUsername,
        gameName
      );
      expect(io.to).toHaveBeenCalledWith(user1Sockets);
      expect(io.emit).toHaveBeenCalledWith("end-game", {
        opponentUsername,
        gameName,
        winner: winnerUsername,
      });
      expect(io.to).toHaveBeenCalledWith(user2Sockets);
      expect(io.emit).toHaveBeenCalledWith("end-game", {
        opponentUsername: username,
        gameName,
        winner: winnerUsername,
      });
    });
  });
});
