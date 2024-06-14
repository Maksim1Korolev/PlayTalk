import { io } from "../index.js";
import MessageHistoryService from "../services/MessageHistoryService.js";

///////////////messageHistories
export const ChatSubscribes = async (socket, savedUsername) => {
  socket.on("on-chat-open", async receiverUsername => {
    try {
      const { data } = await MessageHistoryService.getMessageHistory([
        savedUsername,
        receiverUsername,
      ]);
      if (data && data.messageHistory) {
        socket.emit("update-chat", data.messageHistory, receiverUsername);
        console.log(
          `Chat history sent for ${savedUsername} and ${receiverUsername}.`
        );
      }
    } catch (err) {
      console.error(
        `Error retrieving chat history for ${savedUsername} and ${receiverUsername}: `,
        err.message
      );
    }
  });

  socket.on("on-read-messages", async ({ requestingUsername, usernames }) => {
    try {
      const { data } = await MessageHistoryService.readAllUnreadMessage(
        requestingUsername,
        usernames
      );
      if (data) {
        const otherUserInChat = usernames.find(
          username => username !== requestingUsername
        );
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
        const { data } = await MessageHistoryService.setMessage(
          usernames,
          message
        );
        const { receiversSocketIds } = data;
        io.to(receiversSocketIds).emit("receive-message", {
          senderUsername,
          message,
        });
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
};

export const GetMessageHistory = async usernames => {
  try {
    return await MessageHistoryService.getMessageHistory(usernames);
  } catch (err) {
    console.log("Server is not connected or returns an error", err.message);
  }
};

export const setMessage = async (usernames, message) => {
  try {
    return await MessageHistoryService.setMessage(usernames, message);
  } catch (err) {
    console.log("Server is not connected or returns an error: ", err.message);
  }
};

///////////////unread
export const getAllUnreadMessageCounts = async (req, res) => {
  try {
    const { requestingUsername } = req.params;
    const { data } = await MessageHistoryService.getAllUnreadMessageCounts(
      requestingUsername
    );
    console.log(data);
    return res.status(200).json(data);
  } catch (err) {
    console.log("Error retrieving UnreadMessageCounts:", err.message);
    res.status(500).send(err);
  }
};

export const readAllUnreadMessage = async (req, res) => {
  try {
    const { requestingUsername } = req.params;
    const { usernames } = req.body;
    const { data } = await MessageHistoryService.readAllUnreadMessage(
      requestingUsername,
      usernames
    );
    return res.status(200).json(data);
  } catch (err) {
    console.log("Error posting previously unread messages: ", err.message);
    res.status(500).send(err);
  }
};

export const getUnreadMessagesCount = async (usernames, requestingUsername) => {
  try {
    return await MessageHistoryService.getUnreadMessagesCount(
      usernames,
      requestingUsername
    );
  } catch (err) {
    console.log("Server is not connected or returns an error: ", err.message);
  }
};
