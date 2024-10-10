import { io } from "../../../index.js";
import { handleTicTacToeSubscriptions } from "../socketSubs.js";
import SocketService from "../../socketService.js";
import GameService from "../gameService.js";
import { endGame } from "../../socketGameSessionHandler.js";

import { setupMockSocketAndUser } from "../../../__mocks__/io.js";

jest.mock("../../socketService.js", () => ({
  getUserSockets: jest.fn(),
}));
jest.mock("../gameService.js", () => ({
  makeMove: jest.fn(),
  surrender: jest.fn(),
}));
jest.mock("../../socketGameSessionHandler.js", () => ({
  endGame: jest.fn(),
}));

describe("TicTacToeSubscriptions", () => {
  let mockSocket, mockUsername, mockOpponentUsername;

  beforeEach(() => {
    jest.clearAllMocks();
    ({ mockSocket } = setupMockSocketAndUser());
    mockUsername = "player1";
    mockOpponentUsername = "player2";
  });

  describe("handleTicTacToeSubscriptions", () => {
    it("should subscribe to the 'make-move' event and handle 'Success' move result", async () => {
      GameService.makeMove.mockResolvedValueOnce({ moveResult: "Success" });
      SocketService.getUserSockets
        .mockResolvedValueOnce(["receiverSocketId"])
        .mockResolvedValueOnce(["senderSocketId"]);

      await handleTicTacToeSubscriptions(mockSocket, mockUsername);

      const makeMoveHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "tic-tac-toe-make-move"
      )[1];

      expect(makeMoveHandler).toBeDefined();

      const movePayload = {
        opponentUsername: mockOpponentUsername,
        interactingIndex: 2,
      };
      await makeMoveHandler(movePayload);

      expect(GameService.makeMove).toHaveBeenCalledWith(
        mockUsername,
        mockOpponentUsername,
        movePayload.interactingIndex
      );

      expect(io.to).toHaveBeenCalledWith(["receiverSocketId"]);
      expect(io.emit).toHaveBeenCalledWith("tic-tac-toe-move-made", {
        interactingUsername: mockUsername,
        interactingIndex: 2,
      });
    });

    it("should call endGame when the move result is 'Win'", async () => {
      GameService.makeMove.mockResolvedValueOnce({ moveResult: "Win" });

      await handleTicTacToeSubscriptions(mockSocket, mockUsername);

      const makeMoveHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "tic-tac-toe-make-move"
      )[1];

      expect(makeMoveHandler).toBeDefined();

      const movePayload = {
        opponentUsername: mockOpponentUsername,
        interactingIndex: 2,
      };
      await makeMoveHandler(movePayload);

      expect(GameService.makeMove).toHaveBeenCalledWith(
        mockUsername,
        mockOpponentUsername,
        movePayload.interactingIndex
      );

      expect(endGame).toHaveBeenCalledWith(
        mockUsername,
        mockOpponentUsername,
        "tic-tac-toe",
        mockUsername
      );
    });

    it("should call endGame when the move result is 'Draw'", async () => {
      GameService.makeMove.mockResolvedValueOnce({ moveResult: "Draw" });

      await handleTicTacToeSubscriptions(mockSocket, mockUsername);

      const makeMoveHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "tic-tac-toe-make-move"
      )[1];

      expect(makeMoveHandler).toBeDefined();

      const movePayload = {
        opponentUsername: mockOpponentUsername,
        interactingIndex: 2,
      };
      await makeMoveHandler(movePayload);

      expect(GameService.makeMove).toHaveBeenCalledWith(
        mockUsername,
        mockOpponentUsername,
        movePayload.interactingIndex
      );

      expect(endGame).toHaveBeenCalledWith(
        mockUsername,
        mockOpponentUsername,
        "tic-tac-toe",
        null
      );
    });

    it("should not emit events for an 'InvalidMove' result", async () => {
      GameService.makeMove.mockResolvedValueOnce({ moveResult: "InvalidMove" });

      await handleTicTacToeSubscriptions(mockSocket, mockUsername);

      const makeMoveHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "tic-tac-toe-make-move"
      )[1];

      const movePayload = {
        opponentUsername: mockOpponentUsername,
        interactingIndex: 2,
      };
      await makeMoveHandler(movePayload);

      expect(GameService.makeMove).toHaveBeenCalledWith(
        mockUsername,
        mockOpponentUsername,
        movePayload.interactingIndex
      );
      expect(io.to).not.toHaveBeenCalled();
      expect(io.emit).not.toHaveBeenCalled();
    });

    it("should subscribe to the 'surrender' event and handle surrender correctly", async () => {
      GameService.surrender.mockResolvedValueOnce(true);

      await handleTicTacToeSubscriptions(mockSocket, mockUsername);

      const surrenderHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "tic-tac-toe-surrender"
      )[1];

      expect(surrenderHandler).toBeDefined();

      const surrenderPayload = { opponentUsername: mockOpponentUsername };
      await surrenderHandler(surrenderPayload);

      expect(GameService.surrender).toHaveBeenCalledWith(
        mockUsername,
        mockOpponentUsername
      );

      expect(endGame).toHaveBeenCalledWith(
        mockUsername,
        mockOpponentUsername,
        "tic-tac-toe",
        mockOpponentUsername
      );
    });

    it("should handle errors when surrender fails", async () => {
      GameService.surrender.mockRejectedValueOnce(
        new Error("Surrender failed")
      );

      await handleTicTacToeSubscriptions(mockSocket, mockUsername);

      const surrenderHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "tic-tac-toe-surrender"
      )[1];

      const surrenderPayload = { opponentUsername: mockOpponentUsername };
      await surrenderHandler(surrenderPayload);

      expect(GameService.surrender).toHaveBeenCalledWith(
        mockUsername,
        mockOpponentUsername
      );

      expect(endGame).not.toHaveBeenCalled();
    });
  });
});
