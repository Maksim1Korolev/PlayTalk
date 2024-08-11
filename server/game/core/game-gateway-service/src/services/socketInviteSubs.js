// import { io } from "../index.js";
// import SocketService from "./socketService.js";

// async function handleInviteSubscriptions(socket, connectedPlayerData) {
//   socket.on("send-game-invite", async ({ receiverUsername, game }) => {
//     console.log(
//       `Sending game invite from ${connectedPlayerData.username} to ${receiverUsername} for game ${game}`
//     );
//     await sendGameInvite(connectedPlayerData, receiverUsername, game);
//   });

//   socket.on("accept-game", async ({ game, opponentUsername }) => {
//     console.log(
//       `Accepting game invite for ${connectedPlayerData.username} with opponent ${opponentUsername} for game ${game}`
//     );
//     connectedPlayerData.game = game;
//     connectedPlayerData.opponentUsername = opponentUsername;
//     if (opponentUsername) {
//       await startGameConnection(
//         connectedPlayerData.username,
//         opponentUsername,
//         game
//       );
//     }
//   });

//   socket.on("end-game", async () => {
//     const opponentUsername = connectedPlayerData.opponentUsername;
//     console.log(
//       `Ending game for ${connectedPlayerData.username} against ${opponentUsername}`
//     );
//     if (opponentUsername) {
//       await updateGameStatuses(
//         [connectedPlayerData.username, opponentUsername],
//         false
//       );
//       connectedPlayerData.game = null;
//       connectedPlayerData.opponentUsername = null;
//     }
//   });
// }

// async function sendGameInvite(senderData, receiverUsername, game) {
//   console.log(
//     `Attempting to send game invite from ${senderData.username} to ${receiverUsername} for game ${game}`
//   );

//   const receiverSockets = await SocketService.getUserSockets(receiverUsername);
//   if (receiverSockets.length > 0) {
//     senderData.opponentUsername = receiverUsername; // Set opponent for sender

//     receiverSockets.forEach(socketId => {
//       io.to(socketId).emit("receive-game-invite", {
//         senderUsername: senderData.username,
//         game,
//       });
//       console.log(
//         `Game invite sent to ${receiverUsername} (socket ID: ${socketId}) from ${senderData.username} for game ${game}`
//       );
//     });

//     await updateGameStatuses([senderData.username, receiverUsername], true);
//   } else {
//     console.log("Receiver not found in connected players.");
//   }
// }

// async function startGameConnection(senderUsername, receiverUsername, game) {
//   console.log(
//     `Starting game connection between ${senderUsername} and ${receiverUsername} for game ${game}`
//   );

//   const senderSockets = await SocketService.getUserSockets(senderUsername);
//   const receiverSockets = await SocketService.getUserSockets(receiverUsername);

//   senderSockets.forEach(socketId => {
//     io.to(socketId).emit("game-connection", { game, receiverUsername });
//     console.log(
//       `Notified ${senderUsername} (socket ID: ${socketId}) of connection with ${receiverUsername} for game ${game}`
//     );
//   });

//   receiverSockets.forEach(socketId => {
//     io.to(socketId).emit("game-connection", { game, senderUsername });
//     console.log(
//       `Notified ${receiverUsername} (socket ID: ${socketId}) of connection with ${senderUsername} for game ${game}`
//     );
//   });
// }

// export default handleInviteSubscriptions;
