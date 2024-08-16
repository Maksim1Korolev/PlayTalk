import { io } from "../../index.js";
import SocketService from "../socketService.js";
import MessageHistoryService from "./messageHistoryService.js";

async function handleChatSubscriptions(socket, username) {
  socket.on("on-chat-open", async receiverUsername => {
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

  socket.on("on-read-messages", async ({ requestingUsername, usernames }) => {
    try {
      const { data } = await MessageHistoryService.readAllUnreadMessages(
        requestingUsername,
        usernames
      );
      if (data) {
        const otherUserInChat = usernames.find(
          username => username !== requestingUsername
        );
        //TODO:Check need (Have to check if needed)
        socket.emit("unread-count-messages", otherUserInChat, 0);
      }
    } catch (err) {
      console.error("An error occurred: ", err.message);
    }
  });

  socket.on(
    "send-message",
    async ({ senderUsername, receiverUsername, message }) => {
      const usernames = [senderUsername, receiverUsername].sort();
      try {
        await MessageHistoryService.addMessageToHistory(usernames, message);
        const receiversSocketIds = await SocketService.getUserSockets(
          receiverUsername
        );

        io.to(receiversSocketIds).emit("receive-message", {
          senderUsername,
          message,
        });


        const unreadCount = await MessageHistoryService.getUnreadMessagesCount(
          receiverUsername,
          usernames
        );

        io.to(receiversSocketIds).emit(
          "unread-count-messages",
          senderUsername,
          unreadCount
        );

        console.log(
          `Message from ${senderUsername} to ${receiverUsername}: "${message}" delivered to sockets: ${receiversSocketIds?.join(
            ", "
          )}`
        );
      } catch (err) {
        console.error(
          `Error sending message from ${senderUsername} to ${receiverUsername}: `,
          err.message
        );
      }
    }
  );
}

export default handleChatSubscriptions;
