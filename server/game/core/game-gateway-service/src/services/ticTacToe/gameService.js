import axios from "axios";

import { getLogger } from "../../utils/logger.js";

const logger = getLogger("TicTacToeGameService");

const ticTacToeServiceUrl = `${process.env.TIC_TAC_TOE_SERVICE_API_URL}/Game`;
const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
const serviceName = "game_gateway_service";

class GameService {
  static async getGame(player1Username, player2Username) {
    if (!player1Username || !player2Username) {
      logger.error("Both usernames must be specified for getGame.");
      throw new Error("Both usernames must be specified");
    }

    try {
      const url = `${ticTacToeServiceUrl}/game`;
      const response = await axios.get(url, {
        params: {
          player1Username,
          player2Username,
        },
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      });
      logger.info(
        `Fetched game data for ${player1Username} and ${player2Username}`
      );
      return response.data;
    } catch (error) {
      logger.error(`Error fetching game data: ${error.message}`);
      throw error;
    }
  }

  static async startGame(player1Username, player2Username) {
    if (!player1Username || !player2Username) {
      logger.error("Both usernames must be specified for startGame.");
      throw new Error("Both usernames must be specified");
    }

    try {
      const url = `${ticTacToeServiceUrl}/start`;
      const response = await axios.post(url, null, {
        params: {
          player1Username,
          player2Username,
        },
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      });
      logger.info(
        `Game started between ${player1Username} and ${player2Username}`
      );
      return response.data;
    } catch (error) {
      logger.error(`Error starting game: ${error.message}`);
      throw error;
    }
  }

  static async makeMove(
    interactingPlayerUsername,
    player2Username,
    interactingIndex
  ) {
    if (!interactingPlayerUsername || !player2Username) {
      logger.error("Player usernames must be specified for makeMove.");
      throw new Error("Player usernames must be specified");
    }

    try {
      const url = `${ticTacToeServiceUrl}/move`;
      const response = await axios.post(url, null, {
        params: {
          player1Username: interactingPlayerUsername,
          player2Username,
          interactingPlayerUsername,
          interactingIndex,
        },
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      });
      logger.info(
        `Move made by ${interactingPlayerUsername} against ${player2Username}`
      );
      return response.data;
    } catch (error) {
      logger.error(`Error making move: ${error.message}`);
      throw error;
    }
  }

  static async surrender(surrenderedPlayerUsername, player2Username) {
    if (!surrenderedPlayerUsername || !player2Username) {
      logger.error("Player usernames must be specified for surrender.");
      throw new Error("Player usernames must be specified");
    }

    try {
      const url = `${ticTacToeServiceUrl}/surrender`;
      const response = await axios.post(url, null, {
        params: {
          player1Username: surrenderedPlayerUsername,
          player2Username,
          surrenderedPlayerUsername,
        },
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      });
      logger.info(
        `${surrenderedPlayerUsername} surrendered to ${player2Username}`
      );
      return response.data;
    } catch (error) {
      logger.error(`Error during surrender: ${error.message}`);
      throw error;
    }
  }
}

export default GameService;
