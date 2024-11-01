import axios from "axios";

import { getLogger } from "../../utils/logger.js";
const logger = getLogger("TicTacToePlayerService");

const repositoryServiceUrl = process.env.TIC_TAC_TOE_REPOSITORY_SERVICE_API_URL;
const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
const serviceName = "game_gateway_service";

class PlayerService {
  static async getPlayer(username) {
    if (!username) {
      logger.error("Username is not specified");
      throw new Error("Username is not specified");
    }

    try {
      const url = `${repositoryServiceUrl}/players/${username}`;
      const response = await axios.get(url, {
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      });
      logger.info(`Player data fetched for username: ${username}`);
      return response.data;
    } catch (error) {
      logger.error(
        `Error fetching player data for username ${username}: ${error.message}`
      );
      throw error;
    }
  }
}

export default PlayerService;
