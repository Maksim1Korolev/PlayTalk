import SocketService from "../socketService.js";
import { io } from "../../index.js";
import GameService from "./gameService.js";

async function handleTicTacToeSubscriptions(socket, username, gameData) {
  const gameName = "tic-tac-toe";

  socket.on(`${gameName}-get-game`, async ({ receiverUsername }) => {
    try {
      const response = await GameService.getGame(username, receiverUsername);

      //   if (!response && !response.MoveResult) {
      //     console.log(
      //       `Response or response's MoveResult is undefined upon trying to make a move in ${gameName}.`
      //     );
      //     return;
      //   }

      const sendersSocketIds = await SocketService.getUserSockets(username);
      const receiversSocketIds = await SocketService.getUserSockets(
        receiverUsername
      );
    } catch (err) {
      console.error(
        `Error getting game for ${username} and ${receiverUsername}: `,
        err.message
      );
    }
  });

  //TODO:Maybe make the request more dynamic by adding username inside
  socket.on(
    `${gameName}-make-move`,
    async ({ receiverUsername, interactingIndex }) => {
      try {
        const response = await GameService.makeMove(
          username,
          receiverUsername,
          interactingIndex
        );

        if (!response && !response.MoveResult) {
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
            io.to(sendersSocketIds).emit(`${gameName}-move-made`, {
              username,
              interactingIndex,
            });
            io.to(receiversSocketIds).emit(`${gameName}-move-made`, {
              username,
              interactingIndex,
            });
            break;

          case "Win":
            io.to(sendersSocketIds).emit(`${gameName}-end-game`, {
              username,
              winner: username,
            });
            io.to(receiversSocketIds).emit(`${gameName}-end-game`, {
              username,
              winner: username,
            });
            break;

          case "Draw":
            io.to(sendersSocketIds).emit(`${gameName}-end-game`, {
              username,
            });
            io.to(receiversSocketIds).emit(`${gameName}-end-game`, {
              username,
            });
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
    }
  );
}

export default handleTicTacToeSubscriptions;
