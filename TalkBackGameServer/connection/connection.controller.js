import { io } from "../index.js";
import PlayerService from "../service/PlayerService.js";

const playerSockets = new Map();

export const getBusyUsernames = async (req, res) => {
  try {
    const busyUsernames = Array.from(playerSockets.entries())
      .filter(([username, { busy }]) => busy)
      .map(([username]) => username);

    return res.status(200).json({ busyUsernames });
  } catch (err) {
    console.log("Error retrieving busy usernames:", err);
    res.status(500).send("Internal server error");
  }
};

export const connectToGameLobby = () => {
  io.on("connection", async (socket) => {
    console.log("Player connected");
    let savedUsername;

    socket.on("online-ping", async (username) => {
      savedUsername = username;

      // console.log("YOUREHEREEEE");
      // console.log(playerSockets);

      if (!playerSockets.has(savedUsername)) {
        playerSockets.set(savedUsername, {
          socketIds: new Set(),
          busy: false,
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

      if (playerData.timeoutHandle) {
        clearTimeout(playerData.timeoutHandle);
        playerData.timeoutHandle = null;
        console.log(`Disconnection timeout cleared for ${savedUsername}.`);
      }

      console.log(
        `Player ${savedUsername} connected with socket ID ${socket.id}. Current online players:`,
        Array.from(playerSockets.keys())
      );
    });

    socket.on("backgammon-connection", ({ receiverUsername, areBusy }) => {
      const senderUsername = savedUsername;

      if (playerSockets.has(receiverUsername)) {
        const receiverData = playerSockets.get(receiverUsername);

        if (areBusy && receiverData.busy) {
          console.log(
            `Connection failed: ${receiverUsername} is already busy.`
          );

          // io.to(socket.id).emit("connection-error", {
          //   message: `${receiverUsername} is currently busy.`,
          // });
          return;
        }

        const senderData = playerSockets.get(senderUsername);

        senderData.busy = receiverData.busy = areBusy;

        if (areBusy) {
          receiverData.socketIds.forEach((socketId) => {
            io.to(socketId).emit("receive-game-invite", {
              senderUsername,
              receiverUsername,
            });
          });
        }

        io.emit(
          "update-busy-status",
          [senderUsername, receiverUsername],
          areBusy
        );
      } else {
        console.log("Receiver not found in connected players.");
      }
    });

    socket.on("accept-game", ({ receiverUsername }) => {
      const senderUsername = savedUsername;

      if (
        playerSockets.has(senderUsername) &&
        playerSockets.has(receiverUsername)
      ) {
        const senderData = playerSockets.get(senderUsername);
        const receiverData = playerSockets.get(receiverUsername);

        [...senderData.socketIds, ...receiverData.socketIds].forEach(
          (socketId) => {
            io.to(socketId).emit("start-game");
          }
        );

        console.log(
          `Game started between ${senderUsername} and ${receiverUsername}.`
        );
      } else {
        console.log("One of the players is not found in connected players.");
        // io.to(socket.id).emit("start-game-error", {
        //   message: "One of the players is not found in connected players.",
        // });
      }
    });

    // socket.on("disconnect", () => {
    //   if (savedUsername && playerSockets.has(savedUsername)) {
    //     playerSockets.get(savedUsername).delete(socket.id);
    //     console.log(
    //       `Socket ID ${
    //         socket.id
    //       } for player ${savedUsername} disconnected. Remaining sockets: ${
    //         playerSockets.get(savedUsername).size
    //       }`
    //     );
    //     if (playerSockets.get(savedUsername).size === 0) {
    //       console.log(
    //         `All sockets for ${savedUsername} are disconnected. Player remains in the map with 0 sockets.`
    //       );
    //       socket.broadcast.emit("player-connection", savedUsername, false);
    //     }
    //   }
    // });

    socket.on("disconnect", () => {
      if (savedUsername && playerSockets.has(savedUsername)) {
        const playerData = playerSockets.get(savedUsername);
        playerData.socketIds.delete(socket.id);

        console.log(
          `Socket ID ${socket.id} for player ${savedUsername} disconnected. Remaining sockets: ${playerData.socketIds.size}`
        );

        if (playerData.socketIds.size === 0) {
          console.log(
            `Waiting 60 seconds before potentially removing ${savedUsername} from online players.`
          );

          const timeoutHandle = setTimeout(() => {
            if (playerData.socketIds.size === 0) {
              playerSockets.delete(savedUsername);
              playerData.busy = false;

              console.log(
                `All sockets for ${savedUsername} are disconnected after waiting period. Removing from online players.`
              );
            }
          }, 60000);

          io.emit("player-connection", savedUsername, false);

          playerData.timeoutHandle = timeoutHandle;
        }
      }
    });
  });
};
