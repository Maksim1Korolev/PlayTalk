import SocketService from "../socketService.js";
import { io } from "../../index.js";

async function handleTicTacToeSubscriptions(socket, username, gameData) {
  socket.on("make-move", async ({ receiverUsername, game }) => {
    try {
      const { data } = await MessageHistoryService.getMessageHistory([
        username,
        receiverUsername,
      ]);
      if (data && data.messageHistory) {
        socket.emit("update-chat", data.messageHistory, receiverUsername);
        console.log(
          `Chat history sent for ${username} and ${receiverUsername}.`
        );
      }
    } catch (err) {
      console.error(
        `Error retrieving chat history for ${username} and ${receiverUsername}: `,
        err.message
      );
    }
  });
}

export default handleTicTacToeSubscriptions;
