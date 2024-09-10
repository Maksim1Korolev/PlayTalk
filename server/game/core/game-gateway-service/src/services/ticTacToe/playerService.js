import axios from "axios";

const repositoryServiceUrl = process.env.TIC_TAC_TOE_REPOSITORY_SERVICE_URL;
const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
const serviceName = "game_gateway_service";

class PlayerService {
  static async getPlayer(username) {
    if (!username) {
      throw new Error("Username is not specified");
    }

    const url = `${repositoryServiceUrl}/players/${username}`;
    const response = await axios.get(url, {
      headers: {
        [internalServiceHeaderKey]: serviceName,
      },
    });
    return response.data;
  }
}

export default PlayerService;
