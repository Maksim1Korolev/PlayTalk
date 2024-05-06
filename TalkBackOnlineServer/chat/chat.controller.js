import axios from "axios";

export const getAllUnreadMessageCounts = async (req, res, next) => {
  try {
    const { requestingUsername } = req.params;

    const { data } = await axios.get(
      `${process.env.CHAT_SERVER_URL}/unread/all/${requestingUsername}`
    );
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const ChatSubscribes = async (socket, savedUsername) => {
  //TODO: reset users new messages
  socket.on("on-chat-open", async receiverUsername => {
    try {
      console.log(
        receiverUsername +
          "  asfdjnhhiuasdh fiuahf iuohiuf hasdiuf ghjhasdg fuhyagshd hjf gsdajh gjhdsafhg"
      );
      console.log(
        savedUsername +
          "  asfdjnhhiuasdh fiuahf iuohiuf hasdiuf ghjhasdg fuhyagshd hjf gsdajh gjhdsafhg"
      );
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
    } catch (error) {
      console.error(
        `Error retrieving chat history for ${savedUsername} and ${receiverUsername}:`,
        error
      );
    }
  });

  socket.on(
    "send-message",
    async ({ senderUsername, receiverUsername, message }) => {
      const usernames = [senderUsername, receiverUsername].sort();
      try {
        const { receiversSocketIds } = await GetUserIds(usernames, message);
        io.to(receiversSocketIds).emit("receive-message", {
          senderUsername,
          message,
        });
        console.log(
          `Message from ${senderUsername} to ${receiverUsername}: "${message}" delivered to sockets: ${receiversSocketIds?.join(
            ", "
          )}`
        );
      } catch (error) {
        console.error(
          `Error sending message from ${senderUsername} to ${receiverUsername}:`,
          error
        );
      }
    }
  );
};
export const PostUser = async (addedUserUsername, addedUserSocketId) => {
  return await axios
    .post(`${process.env.CHAT_SERVER_URL}/addToChatLobby`, {
      addedUserUsername,
      addedUserSocketId,
    })
    .catch(e => {
      console.log("Server is not connected or returns an error");
    });
};
export const GetMessageHistory = async usernames => {
  const query = usernames
    .map(u => `usernames=${encodeURIComponent(u)}`)
    .join("&");
  console.log(`Query for GetMessageHistory: ${query}`);
  return await axios
    .get(`${process.env.CHAT_SERVER_URL}/messageHistory?${query}`)
    .catch(e => {
      console.log("Server is not connected or returns an error", e);
    });
};

export const getUnreadMessagesCount = async (usernames, requestingUsername) => {
  return await axios
    .get(`${process.env.CHAT_SERVER_URL}/unread/${requestingUsername}`, {
      usernames,
    })
    .catch(e => {
      console.log("Server is not connected or returns an error" + e);
    });
};

export const markAllMessagesAsRead = async (usernames, requestingUsername) => {
  return await axios
    .post(`${process.env.CHAT_SERVER_URL}/markAsRead/${requestingUsername}`, {
      usernames,
    })
    .catch(e => {
      console.log("Server is not connected or returns an error" + e);
    });
};

export const GetUserIds = async (usernames, message) => {
  return await axios
    .post(`${process.env.CHAT_SERVER_URL}/messages/message`, {
      usernames,
      message,
    })
    .catch(e => {
      console.log("Server is not connected or returns an error");
    });
};
export const DeleteUser = async socketId => {
  return await axios
    .delete(`${process.env.CHAT_SERVER_URL}/${socketId}`)
    .catch(() => {
      console.log("Server is not connected or returns an error");
    });
};
