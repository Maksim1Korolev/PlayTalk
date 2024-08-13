import axios from "axios";

class GameService {
  static baseUrl = process.env.TIC_TAC_TOE_SERVICE_URL;

  static async getGame(player1Username, player2Username) {
    if (!player1Username || !player2Username) {
      throw new Error("Both usernames must be specified");
    }

    const url = `${this.baseUrl}/api/Game/game`;
    const response = await axios.get(url, {
      params: {
        player1Username,
        player2Username,
      },
    });
    return response.data;
  }

  static async startGame(player1Username, player2Username) {
    if (!player1Username || !player2Username) {
      throw new Error("Both usernames must be specified");
    }

    const url = `${this.baseUrl}/api/Game/start`;
    const response = await axios.post(url, null, {
      params: {
        player1Username,
        player2Username,
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

    const url = `${this.baseUrl}/api/Game/move`;
    const response = await axios.post(url, null, {
      params: {
        player1Username: interactingPlayerUsername,
        player2Username,
        interactingPlayerUsername,
        interactingIndex,
      },
    });
    return response.data;
  }

  static async surrender(surrenderedPlayerUsername, player2Username) {
    if (!surrenderedPlayerUsername || !player2Username) {
      throw new Error("Player usernames must be specified");
    }

    const url = `${this.baseUrl}/api/Game/surrender`;
    const response = await axios.post(url, null, {
      params: {
        player1Username: surrenderedPlayerUsername,
        player2Username,
        surrenderedPlayerUsername,
      },
    });
    return response.data;
  }
}

export default GameService;
