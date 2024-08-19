import { io } from "../index.js";
import ActiveGamesService from "./activeGamesService.js";
import SocketService from "./socketService.js";

async function handleInviteSubscriptions(socket, username) {
  socket.on("send-game-invite", async ({ receiverUsername, game }) => {
    console.log(
      `Sending game invite from ${username} to ${receiverUsername} for game ${game}`
    );
    await sendGameInvite(username, receiverUsername, game);
  });

  socket.on("accept-game", async ({ opponentUsername, game }) => {
    console.log(
      `Accepting game invite for ${username} with opponent ${opponentUsername} for game ${game}`
    );

    await ActiveGamesService.addActiveGame(username, opponentUsername, game);

    await startGameConnection(username, opponentUsername, game);
  });
}

async function sendGameInvite(senderUsername, receiverUsername, game) {
  console.log(
    `Attempting to send game invite from ${senderUsername} to ${receiverUsername} for game ${game}`
  );

  const receiverSockets = await SocketService.getUserSockets(receiverUsername);
  if (receiverSockets.length > 0) {
    io.to(receiverSockets).emit("receive-game-invite", {
      senderUsername,
      game,
    });
    console.log(
      `Game invite sent to ${receiverUsername} from ${senderUsername} for game ${game}`
    );
  } else {
    console.log("Receiver not found in connected players.");
  }
}

async function startGameConnection(senderUsername, receiverUsername, game) {
  console.log(
    `Starting game connection between ${senderUsername} and ${receiverUsername} for game ${game}`
  );

  const senderSockets = await SocketService.getUserSockets(senderUsername);
  const receiverSockets = await SocketService.getUserSockets(receiverUsername);

  io.to(senderSockets).emit("game-connection", {
    opponentUsername: receiverUsername,
    game,
  });
  console.log(
    `Notified ${senderUsername} of connection with ${receiverUsername} for game ${game}`
  );

  io.to(receiverSockets).emit("game-connection", {
    opponentUsername: senderUsername,
    game,
  });
  console.log(
    `Notified ${receiverUsername} of connection with ${senderUsername} for game ${game}`
  );
}

export default handleInviteSubscriptions;
