import SocketService from "../socketService.js";
import { io } from "../../index.js";
import GameService from "./gameService.js";
import { endGame } from "../gameSessionService.js";

const gameName = "tic-tac-toe";

const MAKE_MOVE_EVENT = `${gameName}-make-move`;
const MOVE_MADE_EVENT = `${gameName}-move-made`;
const SURRENDER_EVENT = `${gameName}-surrender`;

async function handleTicTacToeSubscriptions(socket, username) {
  socket.on(MAKE_MOVE_EVENT, async ({ receiverUsername, interactingIndex }) => {
    try {
      const response = await GameService.makeMove(
        username,
        receiverUsername,
        interactingIndex
      );

      if (!response || !response.MoveResult) {
        console.log(
          `Response or response's MoveResult is undefined upon trying to make a move in ${gameName}.`
        );
        return;
      }

      const sendersSocketIds = await SocketService.getUserSockets(username);
      const receiversSocketIds = await SocketService.getUserSockets(
        receiverUsername
      );

      switch (response.MoveResult) {
        case "Success":
          io.to(sendersSocketIds).emit(MOVE_MADE_EVENT, {
            username,
            interactingIndex,
          });
          io.to(receiversSocketIds).emit(MOVE_MADE_EVENT, {
            username,
            interactingIndex,
          });
          break;

        case "Win":
          await endGame(username, receiverUsername, gameName, username);
          break;

        case "Draw":
          await endGame(username, receiverUsername, gameName, null);
          break;

        case "InvalidMove":
          console.log("Invalid move response from client request");
          break;

        default:
          console.warn("Unexpected MoveResult:", response.MoveResult);
          break;
      }
    } catch (err) {
      console.error(
        `Error processing move for ${username} and ${receiverUsername}: `,
        err.message
      );
    }
  });

  socket.on(SURRENDER_EVENT, async ({ receiverUsername }) => {
    try {
      const response = await GameService.surrender(username, receiverUsername);

      if (!response) {
        console.log(
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
