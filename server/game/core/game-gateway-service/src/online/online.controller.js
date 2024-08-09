import SocketService from "../services/socketService.js";

export const getOnlineUsernames = async (req, res, next) => {
  try {
    const onlineUsernames = await onlineSocketService.getAllOnlineUsernames();
    return res.status(200).json({ onlineUsernames });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
};