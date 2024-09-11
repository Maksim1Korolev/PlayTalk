import SocketService from "../services/socketService.js";

import { getLogger } from "../utils/logger.js";
const logger = getLogger("OnlineController");

// @desc   Get all online usernames
// @route  GET /api/online/onlineUsernames
// @access Protected
export const getOnlineUsernames = async (req, res, next) => {
  try {
    logger.info("Fetching all online usernames");
    const onlineUsernames = await SocketService.getOnlineUsernames();
    logger.info("Online usernames retrieved successfully");
    return res.status(200).json({ onlineUsernames });
  } catch (err) {
    logger.error(`Error fetching online usernames: ${err.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};
