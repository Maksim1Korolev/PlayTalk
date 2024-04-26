import { io } from "../index.js";
import PlayerService from "../service/PlayerService.js";

const playerSockets = new Map();

export const getInGameUsernames = async (req, res, next) => {
  try {
    const inGameUsernames = Array.from(playerSockets.keys()).filter(
      (username) => playerSockets.get(username).size > 0
    );
    return res.status(200).json({ inGameUsernames });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const connectToGameLobby = () => {
  io.on("connection", async (socket) => {
    console.log("Player connected");
    let savedUsername;

    socket.on("online-ping", async (username) => {
      savedUsername = username;

      if (!playerSockets.has(savedUsername)) {
        playerSockets.set(savedUsername, new Set());
        // Add the player to the database if not already present
        let addedPlayer = await PlayerService.getPlayerByUsername(
          savedUsername
        );
        if (!addedPlayer) {
          addedPlayer = await PlayerService.addPlayer({
            username: savedUsername,
          });
        }
      }
      playerSockets.get(savedUsername).add(socket.id);

      console.log(
        `Player ${savedUsername} connected with socket ID ${socket.id}. Current online players:`,
        Array.from(playerSockets.keys())
      );
      socket.emit("in-game-players", Array.from(playerSockets.keys()));
      socket.broadcast.emit("players-started-game", savedUsername, true);
    });

    socket.on(
      "invite-to-play",
      async ({ senderUsername, receiverUsername }) => {
        if (
          playerSockets.has(receiverUsername) &&
          playerSockets.get(receiverUsername).size > 0
        ) {
          const receiverSocketIds = Array.from(
            playerSockets.get(receiverUsername)
          );
          receiverSocketIds.forEach((socketId) => {
            io.to(socketId).emit("receive-game-invite", {
              senderUsername: senderUsername,
            });
          });
        } else {
          console.log("Receiver not found in connected players.");
        }
      }
    );

    socket.on("disconnect", async () => {
      if (savedUsername && playerSockets.has(savedUsername)) {
        const sockets = playerSockets.get(savedUsername);
        sockets.delete(socket.id);

        console.log(
          `Socket ID ${socket.id} for player ${savedUsername} disconnected. Remaining sockets: ${sockets.size}`
        );

        if (sockets.size === 0) {
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
