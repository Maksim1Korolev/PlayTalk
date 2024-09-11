import { io } from "../../index.js";

import { getLogger } from "../../utils/logger.js";
const logger = getLogger("TicTacToeSubscriptions");

import SocketService from "../socketService.js";
import GameService from "./gameService.js";
import { endGame } from "../socketGameSessionHandler.js";

const gameName = "tic-tac-toe";

const MAKE_MOVE_EVENT = `${gameName}-make-move`;
const MOVE_MADE_EVENT = `${gameName}-move-made`;
const SURRENDER_EVENT = `${gameName}-surrender`;

export async function handleTicTacToeSubscriptions(socket, username) {
  logger.info(`Subscribing ${gameName} socket events for user: ${username}`);

  socket.on(MAKE_MOVE_EVENT, async ({ opponentUsername, interactingIndex }) => {
    try {
      const response = await GameService.makeMove(
        username,
        opponentUsername,
        interactingIndex
      );

      if (!response || !response.moveResult) {
        logger.error(
          `Response or response's moveResult is undefined upon trying to make a move in ${gameName}.`
        );
        return;
      }

      const receiverSocketIds = await SocketService.getUserSockets(
        opponentUsername
      );
      const senderSocketIds = await SocketService.getUserSockets(
        username,
        socket.id
      );

      switch (response.moveResult) {
        case "Success":
          io.to(receiverSocketIds).emit(MOVE_MADE_EVENT, {
            interactingUsername: username,
            interactingIndex,
          });
          io.to(senderSocketIds).emit(MOVE_MADE_EVENT, {
            interactingUsername: username,
            interactingIndex,
          });
          break;

        case "Win":
          await endGame(username, opponentUsername, gameName, username);
          break;

        case "Draw":
          await endGame(username, opponentUsername, gameName, null);
          break;

        case "InvalidMove":
          logger.warn("Invalid move response from client request.");
          break;

        default:
          logger.warn("Unexpected moveResult:", response.moveResult);
          break;
      }
    } catch (err) {
      logger.error(
        `Error processing move for ${username} and ${opponentUsername}: ${err.message}`
      );
    }
  });

  socket.on(SURRENDER_EVENT, async ({ opponentUsername }) => {
    try {
      const response = await GameService.surrender(username, opponentUsername);

      if (!response) {
        logger.error(
          `Response is undefined upon trying to surrender in ${gameName} game with ${opponentUsername}.`
        );
        return;
      }

      await endGame(username, opponentUsername, gameName, opponentUsername);
    } catch (err) {
      logger.error(
        `Error trying to surrender in ${gameName}. Game of ${username} and ${opponentUsername}: ${err.message}`
      );
    }
  });
}
