import axios from "axios";

class PlayerService {
  static baseUrl = process.env.TIC_TAC_TOE_REPOSITORY_SERVICE_URL;

  static async getPlayer(username) {
    if (!username) {
      throw new Error("Username is not specified");
    }

    const url = `${this.baseUrl}/players/${username}`;
    const response = await axios.get(url);
    return response.data;
  }
}

export default PlayerService;
