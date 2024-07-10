import MessageHistoryService from "../services/messageHistoryService.js";

export const getAllUnreadMessageCounts = async (req, res) => {
  try {
    const { requestingUsername } = req.params;
    const { data } = await MessageHistoryService.getAllUnreadMessageCounts(
      requestingUsername
    );
    return res.status(200).json(data);
  } catch (err) {
    console.log("Error retrieving UnreadMessageCounts:", err.message);
    res.status(500).send(err);
  }
};

//TODO:This function is called twice, choose socket or http request, preferably socket.
export const readAllUnreadMessages = async (req, res) => {
  try {
    const { requestingUsername } = req.params;
    const { usernames } = req.body;
    const { data } = await MessageHistoryService.readAllUnreadMessages(
      requestingUsername,
      usernames
    );
    return res.status(200).json(data);
  } catch (err) {
    console.log("Error posting previously unread messages: ", err.message);
    res.status(500).send(err);
  }
};
