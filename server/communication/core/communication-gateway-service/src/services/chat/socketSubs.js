import { io } from "../../index.js";
import SocketService from "../socketService.js";
import MessageHistoryService from "./messageHistoryService.js";

async function handleChatSubscriptions(socket, currentUsername) {
  socket.on("on-chat-open", async receiverUsername => {
    try {
      const { data } = await MessageHistoryService.getMessageHistory([
        currentUsername,
        receiverUsername,
      ]);
      if (data && data.messageHistory) {
        socket.emit("update-chat", data.messageHistory, receiverUsername);
        console.log(
          `Chat history sent for ${currentUsername} and ${receiverUsername}.`
        );
      }
    } catch (err) {
      console.error(
        `Error retrieving chat history for ${currentUsername} and ${receiverUsername}: `,
        err.message
      );
    }
  });

  socket.on("on-read-messages", async ({ usernames }) => {
    try {
      const { data } = await MessageHistoryService.readAllUnreadMessages(
        currentUsername,
        usernames
      );
      if (data) {
        const otherUserInChat = usernames.find(
          username => username !== currentUsername
        );
        socket.emit("unread-count-messages", otherUserInChat, 0);
      }
    } catch (err) {
      console.error("An error occurred: ", err.message);
    }
  });

  socket.on("send-message", async ({ receiverUsername, message }) => {
    const usernames = [currentUsername, receiverUsername].sort();

    try {
      await MessageHistoryService.addMessageToHistory(usernames, message);
      const receiversSocketIds = await SocketService.getUserSockets(
        receiverUsername
      );

      io.to(receiversSocketIds).emit("receive-message", {
        username: currentUsername,
        message,
      });

      const unreadCount = await MessageHistoryService.getUnreadMessagesCount(
        receiverUsername,
        usernames
      );

      io.to(receiversSocketIds).emit(
        "unread-count-messages",
        currentUsername,
        unreadCount
      );

      console.log(
        `Message from ${currentUsername} to ${receiverUsername}: "${message}" delivered to sockets: ${receiversSocketIds?.join(
          ", "
        )}`
      );
    } catch (err) {
      console.error(
        `Error sending message from ${currentUsername} to ${receiverUsername}: `,
        err.message
      );
    }
  });
}

export default handleChatSubscriptions;
