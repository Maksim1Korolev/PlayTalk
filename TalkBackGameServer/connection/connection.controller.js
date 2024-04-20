import { io } from "../index.js";
import PlayerService from "../service/PlayerService.js";

export const connectToGameLobby = () => {
  const connectedPlayers = new []();

  io.on("connection", async (socket) => {
    console.log("player connected");
    let savedUsername;

    socket.on("online-ping", async (username) => {
      savedUsername = username;

      // Online logic
      let addedPlayer = PlayerService.getPlayerByUsername(savedUsername);
      addedPlayer.socketId = socket.id;
      connectedPlayers.add(addedPlayer);

      console.log(
        `Online players after ${savedUsername} connected:`,
        connectedPlayers
      );
      socket.emit("online-players", connectedPlayers.username);

      socket.broadcast.emit(`player-connection`, savedUsername, true);
    });

    //Chat logic
    await connectUserToChat(savedUsername, socket);

    socket.on("disconnect", async () => {
      if (savedUsername) {
        connectedPlayers.delete(savedUsername);
        console.log(
          `Online players after ${savedUsername} disconnected:`,
          connectedPlayers
        );

        socket.broadcast.emit("player-connection", savedUsername, false);

        await DeleteUser(socket.id);
      }
    });
  });
};
