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

  io.to(senderSockets).emit("start-game", {
    opponentUsername: receiverUsername,
    game,
  });
  console.log(
    `Notified ${senderUsername} of connection with ${receiverUsername} for game ${game}`
  );

  io.to(receiverSockets).emit("start-game", {
    opponentUsername: senderUsername,
    game,
  });
  console.log(
    `Notified ${receiverUsername} of connection with ${senderUsername} for game ${game}`
  );
}

async function endGame(username1, username2, gameName, winnerUsername) {
  console.log(
    `Ending game ${gameName} between ${username1} and ${username2}. Winner: ${winnerUsername}`
  );

  const user1Sockets = await SocketService.getUserSockets(username1);
  const user2Sockets = await SocketService.getUserSockets(username2);

  io.to(user1Sockets).emit("end-game", {
    opponentUsername: username2,
    game: gameName,
    winner: winnerUsername,
  });
  console.log(
    `Notified ${username1} of game end with ${username2}. Winner: ${winnerUsername}`
  );

  io.to(user2Sockets).emit("end-game", {
    opponentUsername: username1,
    game: gameName,
    winner: winnerUsername,
  });
  console.log(
    `Notified ${username2} of game end with ${username1}. Winner: ${winnerUsername}`
  );

  await ActiveGamesService.removeActiveGame(username1, username2, gameName);
}

export { handleInviteSubscriptions, endGame };