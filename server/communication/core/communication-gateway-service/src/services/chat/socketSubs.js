import { io } from "../../index.js";

import { getLogger } from "../../utils/logger.js";
const logger = getLogger("ChatSubscriptions");

import SocketService from "../socketService.js";
import MessageHistoryService from "./messageHistoryService.js";

export async function handleChatSubscriptions(socket, currentUsername) {
  socket.on("on-chat-open", async ({ receiverUsername }) => {
    try {
      const { data } = await MessageHistoryService.getMessageHistory([
        currentUsername,
        receiverUsername,
      ]);

      if (data && data.messageHistory) {
        socket.emit("update-chat", data.messageHistory, receiverUsername);
        logger.info(
          `Chat history sent for ${currentUsername} and ${receiverUsername}.`
        );
      }
    } catch (err) {
      logger.error(
        `Error retrieving chat history for ${currentUsername} and ${receiverUsername}: ${err.message}`
      );
    }
  });

  socket.on("typing", async receiverUsername => {
    const receiversSocketIds = await SocketService.getUserSockets(
      receiverUsername
    );
    io.to(receiversSocketIds).emit("typing", currentUsername);
    logger.info(`${currentUsername} is typing to ${receiverUsername}`);
  });

  socket.on("stop typing", async receiverUsername => {
    const receiversSocketIds = await SocketService.getUserSockets(
      receiverUsername
    );
    io.to(receiversSocketIds).emit("stop typing", currentUsername);
    logger.info(`${currentUsername} stopped typing to ${receiverUsername}`);
  });

  socket.on("on-read-messages", async ({ usernames }) => {
    try {
      logger.info("on-read-messages started", usernames);
      const { data } = await MessageHistoryService.readAllUnreadMessages(
        currentUsername,
        usernames
      );
      logger.info("on-read-messages sent request to chat-server", data);

      if (data) {
        const otherUserInChat = usernames.find(
          username => username !== currentUsername
        );
        socket.emit("unread-count-messages", otherUserInChat, 0);
      }
    } catch (err) {
      logger.error(`Error in on-read-messages: ${err.message}`);
    }
  });

  socket.on("send-message", async ({ receiverUsername, message }) => {
    const usernames = [currentUsername, receiverUsername].sort();

    try {
      await MessageHistoryService.addMessageToHistory(usernames, message);
      const receiversSocketIds = await SocketService.getUserSockets(
        receiverUsername
      );

      io.to(receiversSocketIds).emit("receive-message", message);

      const unreadCount = await MessageHistoryService.getUnreadMessagesCount(
        receiverUsername,
        usernames
      );

      io.to(receiversSocketIds).emit(
        "unread-count-messages",
        currentUsername,
        unreadCount
      );

      logger.info(
        `Message from ${currentUsername} to ${receiverUsername}: "${message}" delivered to sockets: ${receiversSocketIds?.join(
          ", "
        )}`
      );
    } catch (err) {
      logger.error(
        `Error sending message from ${currentUsername} to ${receiverUsername}: ${err.message}`
      );
    }
  });
}
