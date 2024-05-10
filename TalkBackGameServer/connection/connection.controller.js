import { io } from "../index.js";
import PlayerService from "../service/PlayerService.js";

const playerSockets = new Map();

// Helper function to get busy status
const isPlayerBusy = playerData => playerData.inInvite || playerData.inGame;

export const getBusyUsernames = async (req, res) => {
  try {
    console.log("Fetching busy usernames");
    const busyUsernames = Array.from(playerSockets.entries())
      .filter(([_, playerData]) => isPlayerBusy(playerData))
      .map(([username]) => username);

    console.log("Busy usernames retrieved:", busyUsernames);
    return res.status(200).json({ busyUsernames });
  } catch (err) {
    console.log("Error retrieving busy usernames:", err);
    res.status(500).send("Internal server error");
  }
};

export const connectToGameLobby = () => {
  io.on("connection", socket => {
    console.log("Player connected with socket ID:", socket.id);
    let savedUsername;

    socket.on("online-ping", async username => {
      console.log(`Received online-ping from username: ${username}`);
      savedUsername = username;

      if (!playerSockets.has(savedUsername)) {
        console.log(`New player detected: ${savedUsername}`);
        playerSockets.set(savedUsername, {
          socketIds: new Set(),
          inInvite: false,
          inGame: false,
          opponentUsername: null,
          timeoutHandle: null,
        });

        try {
          let player = await PlayerService.getPlayerByUsername(savedUsername);
          if (!player) {
            player = await PlayerService.addPlayer({ username: savedUsername });
            console.log(`New player added to database: ${player.username}`);
          }
        } catch (error) {
          console.log("Error accessing PlayerService:", error);
        }
      }

      const playerData = playerSockets.get(savedUsername);
      playerData.socketIds.add(socket.id);

      if (playerData.inGame && playerData.opponentUsername) {
        console.log(
          `Player ${savedUsername} is currently in a game with ${playerData.opponentUsername}`
        );
        socket.emit("backgammon-connection", {
          opponentUsername: playerData.opponentUsername,
        });
      }

      console.log(
        `Player ${savedUsername} connected with socket ID ${socket.id}.`
      );
    });

    socket.on("send-game-invite", ({ receiverUsername }) => {
      console.log(
        `Sending game invite from ${savedUsername} to ${receiverUsername}`
      );
      sendGameInvite(savedUsername, receiverUsername);
    });

    socket.on("accept-game", () => {
      const receiverUsername =
        playerSockets.get(savedUsername)?.opponentUsername;
      console.log(
        `Accepting game invite for ${savedUsername} with opponent ${receiverUsername}`
      );
      if (receiverUsername) {
        startGameConnection(savedUsername, receiverUsername);
      }
    });

    socket.on("end-game", () => {
      const opponentUsername =
        playerSockets.get(savedUsername)?.opponentUsername;
      console.log(
        `Ending game for ${savedUsername} against ${opponentUsername}`
      );
      if (opponentUsername) {
        updateBusyStatus([savedUsername, opponentUsername], false, false);
      }
    });

    socket.on("disconnect", () => {
      const playerData = playerSockets.get(savedUsername);
      console.log(
        `Player ${savedUsername} disconnected with socket ID ${socket.id}`
      );
      if (
        playerData &&
        playerData.socketIds.delete(socket.id) &&
        playerData.socketIds.size === 0
      ) {
        if (playerData.inGame) {
          console.log(`Waiting 60 seconds for ${savedUsername} to reconnect.`);
          playerData.timeoutHandle = setTimeout(() => {
            if (playerData.socketIds.size === 0) {
              playerSockets.delete(savedUsername);
              updateBusyStatus([savedUsername], false, false);
              console.log(
                `Player ${savedUsername} disconnected and removed after waiting period.`
              );
            }
          }, 60000);
        } else {
          if (playerData.opponentUsername) {
            console.log(`Clearing opponent status for ${savedUsername}`);
            updateBusyStatus(
              [savedUsername, playerData.opponentUsername],
              false,
              false
            );
          }
          playerSockets.delete(savedUsername);
          console.log(
            `Player ${savedUsername} disconnected and removed immediately.`
          );
        }
      }
    });

    function updateBusyStatus(usernames, inInvite, inGame) {
      console.log(
        `Updating busy status for users: ${usernames}, inInvite: ${inInvite}, inGame: ${inGame}`
      );
      usernames.forEach(username => {
        const playerData = playerSockets.get(username);
        if (playerData) {
          playerData.inInvite = inInvite;
          playerData.inGame = inGame;

          playerData.opponentUsername =
            inInvite || inGame
              ? username !== savedUsername
                ? savedUsername
                : playerData.opponentUsername
              : null;
          console.log(
            `User ${username} updated: inInvite=${inInvite}, inGame=${inGame}, opponentUsername=${playerData.opponentUsername}`
          );
        }
      });

      io.emit("update-busy-status", {
        usernames: usernames,
        busy: inInvite || inGame,
      });
      console.log(`Emitted update-busy-status for users: ${usernames}`);
    }

    function sendGameInvite(senderUsername, receiverUsername) {
      console.log(
        `Attempting to send game invite from ${senderUsername} to ${receiverUsername}`
      );
      if (
        playerSockets.has(receiverUsername) &&
        playerSockets.has(senderUsername)
      ) {
        const receiverData = playerSockets.get(receiverUsername);
        const senderData = playerSockets.get(senderUsername);

        if (!isPlayerBusy(receiverData) && !isPlayerBusy(senderData)) {
          receiverData.inInvite = senderData.inInvite = true;
          senderData.opponentUsername = receiverUsername;
          receiverData.opponentUsername = senderUsername;
          receiverData.socketIds.forEach(socketId => {
            io.to(socketId).emit("receive-game-invite", { senderUsername });
            console.log(
              `Game invite sent to ${receiverUsername} (socket ID: ${socketId}) from ${senderUsername}`
            );
          });
          updateBusyStatus([senderUsername, receiverUsername], true, false);
        } else {
          console.log(
            `Invite failed: ${receiverUsername} or ${senderUsername} is already busy.`
          );
        }
      } else {
        console.log("Receiver or Sender not found in connected players.");
      }
    }

    function startGameConnection(senderUsername, receiverUsername) {
      console.log(
        `Starting game connection between ${senderUsername} and ${receiverUsername}`
      );
      if (
        playerSockets.has(senderUsername) &&
        playerSockets.has(receiverUsername)
      ) {
        const senderData = playerSockets.get(senderUsername);
        const receiverData = playerSockets.get(receiverUsername);
        updateBusyStatus([senderUsername, receiverUsername], false, true);

        io.to([senderData.socketIds]).emit("backgammon-connection", {
          opponentUsername: receiverUsername,
        });
        console.log(
          `Notified ${senderUsername} (socket ID: ${id}) of connection with ${receiverUsername}`
        );

        io.to(receiverData.socketIds).emit("backgammon-connection", {
          opponentUsername: senderUsername,
        });
        console.log(
          `Notified ${receiverUsername} (socket ID: ${id}) of connection with ${senderUsername}`
        );

        console.log(
          `Game started between ${senderUsername} and ${receiverUsername}.`
        );
      } else {
        console.log("One of the players is not found in connected players.");
      }
    }
  });
};
