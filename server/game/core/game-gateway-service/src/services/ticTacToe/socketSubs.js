import SocketService from "../socketService.js";
import { io } from "../../index.js";
import GameService from "./gameService.js";
import { endGame } from "../socketGameSessionHandler.js";

const gameName = "tic-tac-toe";

const MAKE_MOVE_EVENT = `${gameName}-make-move`;
const MOVE_MADE_EVENT = `${gameName}-move-made`;
const SURRENDER_EVENT = `${gameName}-surrender`;

async function handleTicTacToeSubscriptions(socket, username) {
  console.log(`Subscribing socket events for user: ${username}`);

  socket.on(MAKE_MOVE_EVENT, async ({ opponentUsername, interactingIndex }) => {
    try {
      const response = await GameService.makeMove(
        username,
        opponentUsername,
        interactingIndex
      );

      if (!response || !response.moveResult) {
        console.error(
          `Response or response's moveResult is undefined upon trying to make a move in ${gameName}.`
        );
        return;
      }

      const sendersSocketIds = await SocketService.getUserSockets(username);
      const receiversSocketIds = await SocketService.getUserSockets(
        opponentUsername
      );

      switch (response.moveResult) {
        case "Success":
          io.to(sendersSocketIds).emit(MOVE_MADE_EVENT, {
            interactingUsername: username,
            interactingIndex,
          });
          io.to(receiversSocketIds).emit(MOVE_MADE_EVENT, {
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
          console.warn("Invalid move response from client request.");
          break;

        default:
          console.warn("Unexpected moveResult:", response.moveResult);
          break;
      }
    } catch (err) {
      console.error(
        `Error processing move for ${username} and ${opponentUsername}: `,
        err.message
      );
    }
  });

  socket.on(SURRENDER_EVENT, async ({ receiverUsername }) => {
    try {
      const response = await GameService.surrender(username, receiverUsername);

      if (!response) {
        console.error(
          `Response is undefined upon trying to surrender in ${gameName} game with ${receiverUsername}.`
        );
        return;
      }

      await endGame(username, receiverUsername, gameName, receiverUsername);
    } catch (err) {
      console.error(
        `Error trying to surrender in ${gameName}. Game of ${username} and ${receiverUsername}: `,
        err.message
      );
    }
  });
}

export default handleTicTacToeSubscriptions;
