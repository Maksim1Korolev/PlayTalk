import { getLogger } from "../utils/logger.js";

import { io } from "../index.js";

import ActiveGamesService from "./activeGamesService.js";
import SocketService from "./socketService.js";
import TicTacToeGameService from "./ticTacToe/gameService.js";

const logger = getLogger("GameSessionHandler");

async function handleInviteSubscriptions(socket, username) {
  socket.on("send-game-invite", async ({ receiverUsername, gameName }) => {
    logger.info(
      `Sending game invite from ${username} to ${receiverUsername} for game ${gameName}`
    );
    await sendGameInvite(username, receiverUsername, gameName);
  });

  socket.on("accept-game", async ({ opponentUsername, gameName }) => {
    logger.info(
      `Accepting game invite for ${username} with opponent ${opponentUsername} for game ${gameName}`
    );

    await ActiveGamesService.addActiveGame(
      username,
      opponentUsername,
      gameName
    );

    await startGameConnection(username, opponentUsername, gameName);
  });
}

async function sendGameInvite(senderUsername, receiverUsername, gameName) {
  logger.info(
    `Attempting to send game invite from ${senderUsername} to ${receiverUsername} for game ${gameName}`
  );

  const receiverSockets = await SocketService.getUserSockets(receiverUsername);
  if (receiverSockets.length > 0) {
    io.to(receiverSockets).emit("receive-game-invite", {
      senderUsername,
      gameName,
    });
    logger.info(
      `Game invite sent to ${receiverUsername} from ${senderUsername} for game ${gameName}`
    );
  } else {
    logger.warn(`Receiver ${receiverUsername} not found in connected players.`);
  }
}

async function startGameConnection(senderUsername, receiverUsername, gameName) {
  logger.info(
    `Starting game connection between ${senderUsername} and ${receiverUsername} for game ${gameName}`
  );

  try {
    switch (gameName) {
      case "tic-tac-toe":
        await TicTacToeGameService.startGame(senderUsername, receiverUsername);
        break;

      // Other case example
      // case "chess":
      //   await ChessGameService.startGame(senderUsername, receiverUsername);
      //   break;

      default:
        logger.warn(`Unsupported game type: ${gameName}`);
        throw new Error({ message: `Unsupported game type: ${gameName}` });
    }
  } catch (err) {
    if (err.response && err.response.data) {
      logger.error(`Error starting game ${gameName}: ${err.response.data}`);
    } else {
      logger.error(`Error starting game ${gameName}: ${err.message}`);
    }
    //TODO:Emit error starting game
    return;
  }

  const senderSockets = await SocketService.getUserSockets(senderUsername);
  const receiverSockets = await SocketService.getUserSockets(receiverUsername);

  if (senderSockets.length > 0) {
    io.to(senderSockets).emit("start-game", {
      opponentUsername: receiverUsername,
      gameName,
    });
    logger.info(
      `Notified ${senderUsername} of connection with ${receiverUsername} for game ${gameName}`
    );
  }

  if (receiverSockets.length > 0) {
    io.to(receiverSockets).emit("start-game", {
      opponentUsername: senderUsername,
      gameName,
    });
    logger.info(
      `Notified ${receiverUsername} of connection with ${senderUsername} for game ${gameName}`
    );
  }
}

async function endGame(username1, username2, gameName, winnerUsername) {
  logger.info(
    `Ending game ${gameName} between ${username1} and ${username2}. Winner: ${winnerUsername}`
  );

  const user1Sockets = await SocketService.getUserSockets(username1);
  const user2Sockets = await SocketService.getUserSockets(username2);

  await ActiveGamesService.removeActiveGame(username1, username2, gameName);

  if (user1Sockets.length > 0) {
    io.to(user1Sockets).emit("end-game", {
      opponentUsername: username2,
      gameName,
      winner: winnerUsername,
    });
    logger.info(
      `Notified ${username1} of game end with ${username2}. Winner: ${winnerUsername}`
    );
  }
  if (user2Sockets.length > 0) {
    io.to(user2Sockets).emit("end-game", {
      opponentUsername: username1,
      gameName,
      winner: winnerUsername,
    });
    logger.info(
      `Notified ${username2} of game end with ${username1}. Winner: ${winnerUsername}`
    );
  }
}

export { handleInviteSubscriptions, endGame };
