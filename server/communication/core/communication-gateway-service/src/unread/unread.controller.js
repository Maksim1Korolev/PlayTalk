import MessageHistoryService from "../services/chat/messageHistoryService.js";

// @desc   Get counts of unread messages from all users
// @route  GET /api/unread/getAll
// @access Public
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

// @desc   Mark all messages as read
// @route  POST /api/unread/markAsRead
// @access Public
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
