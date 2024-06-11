import axios from "axios";
import { io } from "../index.js";

export const getAllUnreadMessageCounts = async (req, res) => {
  try {
    const { requestingUsername } = req.params;

    const { data } = await axios.get(
      `${process.env.CHAT_SERVICE_URL}/unread/all/${requestingUsername}`
    );
    console.log(data);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
};
export const readAllUnreadMessage = async (req, res) => {
  try {
    const { requestingUsername } = req.params;
    console.log("readAllUnreadMessage");
    console.log(requestingUsername);
    const { usernames } = req.body;
    const url = `${process.env.CHAT_SERVICE_URL}/markAsRead/${requestingUsername}`;
    console.log(url);
    const { data } = await axios.post(url, {
      usernames,
    });
    return res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
};

export const ChatSubscribes = async (socket, savedUsername) => {
  //TODO: reset users new messages
  socket.on("on-chat-open", async receiverUsername => {
    try {
      const { data } = await GetMessageHistory([
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
      const url = `${process.env.CHAT_SERVICE_URL}/markAsRead/${requestingUsername}`;
      console.log(url);

      const response = await axios.post(url, { usernames });

      if (response.status === 200) {
        //TODO: update it for groupChats
        const otherUserInChat = usernames.find(
          username => username !== requestingUsername
        );
        socket.emit("unread-count-messages", otherUserInChat, 0);
      } else {
        console.error(
          `Failed to mark messages as read. Status code: ${response.status}`
        );
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
        const { data } = await setMessage(usernames, message);
        const { receiversSocketIds } = data;
        console.log(receiversSocketIds);
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
export const PostUser = async (addedUserUsername, addedUserSocketId) => {
  return await axios
    .post(`${process.env.CHAT_SERVICE_URL}/addToChatLobby`, {
      addedUserUsername,
      addedUserSocketId,
    })
    .catch(err => {
      console.log("Server is not connected or returns an error:", err.message);
    });
};
export const GetMessageHistory = async usernames => {
  const query = usernames
    .map(u => `usernames=${encodeURIComponent(u)}`)
    .join("&");
  console.log(`Query for GetMessageHistory: ${query}`);
  return await axios
    .get(`${process.env.CHAT_SERVICE_URL}/messageHistory?${query}`)
    .catch(err => {
      console.log("Server is not connected or returns an error", err.message);
    });
};

export const getUnreadMessagesCount = async (usernames, requestingUsername) => {
  return await axios
    .get(`${process.env.CHAT_SERVICE_URL}/unread/${requestingUsername}`, {
      usernames,
    })
    .catch(err => {
      console.log(
        "Server is not connected or returns an error: " + err.message
      );
    });
};

export const setMessage = async (usernames, message) => {
  return await axios
    .post(`${process.env.CHAT_SERVICE_URL}/messages/message`, {
      usernames,
      message,
    })
    .catch(err => {
      console.log("Server is not connected or returns an error: ", err.message);
    });
};
export const DeleteUser = async socketId => {
  return await axios
    .delete(`${process.env.CHAT_SERVICE_URL}/${socketId}`)
    .catch(err => {
      console.log("Server is not connected or returns an error: ", err.message);
    });
};
