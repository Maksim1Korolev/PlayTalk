import axios from "axios";

const ticTacToeServiceUrl = `${process.env.TIC_TAC_TOE_SERVICE_URL}/Game`;
const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
const serviceName = "game_gateway_service";

class GameService {
  static async getGame(player1Username, player2Username) {
    if (!player1Username || !player2Username) {
      throw new Error("Both usernames must be specified");
    }

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
    return response.data;
  }

  static async startGame(player1Username, player2Username) {
    if (!player1Username || !player2Username) {
      throw new Error("Both usernames must be specified");
    }

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
    return response.data;
  }

  static async makeMove(
    interactingPlayerUsername,
    player2Username,
    interactingIndex
  ) {
    if (!interactingPlayerUsername || !player2Username) {
      throw new Error("Player usernames must be specified");
    }

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
    return response.data;
  }

  static async surrender(surrenderedPlayerUsername, player2Username) {
    if (!surrenderedPlayerUsername || !player2Username) {
      throw new Error("Player usernames must be specified");
    }

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
    return response.data;
  }
}

export default GameService;
