import { io } from "../index.js";
import PlayerService from "../service/PlayerService.js";

const playerSockets = new Map();

export const getBusyUsernames = async (req, res) => {
  try {
    const busyUsernames = Array.from(playerSockets.keys()).filter((username) =>
      Array.from(playerSockets.get(username).values()).some(
        (details) => details.busy
      )
    );

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

      if (!playerSockets.has(savedUsername)) {
        playerSockets.set(savedUsername, new Map());

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
      playerSockets.get(savedUsername).set(socket.id, { busy: false });
      console.log(
        `Player ${savedUsername} connected with socket ID ${socket.id}. Current online players:`,
        Array.from(playerSockets.keys())
      );
      socket.emit("in-game-players", Array.from(playerSockets.keys()));
    });

    socket.on(
      "backgammon-connection",
      ({ senderUsername, receiverUsername, areBusy }) => {
        if (
          playerSockets.has(receiverUsername) &&
          playerSockets.get(receiverUsername).size > 0
        ) {
          const receiverSocketIds = Array.from(
            playerSockets.get(receiverUsername).keys()
          );
          receiverSocketIds.forEach((socketId) => {
            io.to(socketId).emit("receive-game-invite", {
              senderUsername,
              receiverUsername,
            });
          });
          console.log(
            `Backgammon connection initiated from ${senderUsername} to ${receiverUsername}.`
          );

          [senderUsername, receiverUsername].forEach((username) => {
            if (playerSockets.has(username)) {
              const userSockets = playerSockets.get(username);
              userSockets.forEach((details, socketId) => {
                details.busy = areBusy;
                console.log(
                  `User ${username} on socket ${socketId} is now ${
                    areBusy ? "busy" : "not busy"
                  }.`
                );
              });
            }
          });

          io.emit(
            "update-busy-status",
            [senderUsername, receiverUsername],
            areBusy
          );
        } else {
          console.log("Receiver not found in connected players.");
        }
      }
    );

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
        playerSockets.get(savedUsername).delete(socket.id);
        console.log(
          `Socket ID ${
            socket.id
          } for player ${savedUsername} disconnected. Remaining sockets: ${
            playerSockets.get(savedUsername).size
          }`
        );
        if (playerSockets.get(savedUsername).size === 0) {
          playerSockets.delete(savedUsername);
          console.log(
            `All sockets for ${savedUsername} are disconnected. Removing from online players.`
          );
          socket.broadcast.emit("player-connection", savedUsername, false);
        }
      }
    });
  });
};
