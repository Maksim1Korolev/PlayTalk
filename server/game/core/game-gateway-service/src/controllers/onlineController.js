import SocketService from "../services/socketService.js";

// @desc   Get all online usernames
// @route  GET /api/online/onlineUsernames
// @access Protected
export const getOnlineUsernames = async (req, res, next) => {
  try {
    const onlineUsernames = await SocketService.getOnlineUsernames();
    return res.status(200).json({ onlineUsernames });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: `Internal server error.` });
  }
};
