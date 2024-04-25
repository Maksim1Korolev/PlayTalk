import axios from "axios";

export const PostUser = async (addedUserUsername, addedUserSocketId) => {
  return await axios
    .post(`${process.env.CHAT_SERVER_URL}/addToChatLobby`, {
      addedUserUsername,
      addedUserSocketId,
    })
    .catch((e) => {
      console.log("Server is not connected or returns an error");
    });
};
export const GetMessageHistory = async (usernames) => {
  const query = usernames
    .map((u) => `usernames=${encodeURIComponent(u)}`)
    .join("&");
  console.log(`Query for GetMessageHistory: ${query}`);
  return await axios
    .get(`${process.env.CHAT_SERVER_URL}/messageHistory?${query}`)
    .catch((e) => {
      console.log("Server is not connected or returns an error", e);
    });
};

export const GetUserIds = async (usernames, message) => {
  return await axios
    .post(`${process.env.CHAT_SERVER_URL}/messages/message`, {
      usernames,
      message,
    })
    .catch((e) => {
      console.log("Server is not connected or returns an error");
    });
};
export const DeleteUser = async (socketId) => {
  return await axios
    .delete(`${process.env.CHAT_SERVER_URL}/${socketId}`)
    .catch(() => {
      console.log("Server is not connected or returns an error");
    });
};
