import { io } from "../index.js";

const playerSockets = new Map();

export const getInGameUsernames = async (req, res) => {
  try {
    const inGameUsernames = Array.from(playerSockets.keys()).filter(
      (username) =>
        Array.from(playerSockets.get(username).values()).some(
          (details) => details.inGame
        )
    );
    return res.status(200).json({ inGameUsernames });
  } catch (err) {
    console.log("Error retrieving in-game usernames:", err);
    res.status(500).send("Internal server error");
  }
};

export const connectToGameLobby = () => {
  io.on("connection", (socket) => {
    console.log("Player connected");
    let savedUsername;

    socket.on("online-ping", async (username) => {
      savedUsername = username;
      if (!playerSockets.has(savedUsername)) {
        playerSockets.set(savedUsername, new Map());
      }
      playerSockets.get(savedUsername).set(socket.id, { inGame: false });
      console.log(
        `Player ${savedUsername} connected with socket ID ${socket.id}. Current online players:`,
        Array.from(playerSockets.keys())
      );
      socket.emit("in-game-players", Array.from(playerSockets.keys()));
    });

    socket.on("invite-to-play", ({ senderUsername, receiverUsername }) => {
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
          `Game invite sent from ${senderUsername} to ${receiverUsername}.`
        );
      } else {
        console.log("Receiver not found in connected players.");
      }
    });

    socket.on("accept-invite", ({ senderUsername, receiverUsername }) => {
      if (
        playerSockets.has(senderUsername) &&
        playerSockets.has(receiverUsername)
      ) {
        [senderUsername, receiverUsername].forEach((username) => {
          playerSockets.get(username).forEach((details, socketId) => {
            details.inGame = true;
            io.to(socketId).emit("game-start", { inGame: true });
          });
        });
        console.log(
          `Game started between ${senderUsername} and ${receiverUsername}.`
        );
        io.emit("players-started-game", senderUsername, receiverUsername, true);
      } else {
        console.log("One of the players not found in connected players.");
      }
    });

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
