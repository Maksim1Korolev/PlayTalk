import { getLogger } from "../utils/logger.js";

import redisClient from "../utils/redisClient.js";

const logger = getLogger("ActiveGamesService");

class ActiveGamesService {
  static async addActiveGame(username, opponentUsername, game) {
    logger.info(
      `Adding active game ${game} for users ${username} and ${opponentUsername}`
    );
    const currentGames = await this.getActiveGames(username);

    if (currentGames[opponentUsername]) {
      currentGames[opponentUsername].push(game);
    } else {
      currentGames[opponentUsername] = [game];
    }

    await redisClient.hSet(
      process.env.REDIS_USER_GAMES_KEY,
      username,
      JSON.stringify(currentGames)
    );

    const opponentGames = await this.getActiveGames(opponentUsername);

    if (opponentGames[username]) {
      opponentGames[username].push(game);
    } else {
      opponentGames[username] = [game];
    }

    await redisClient.hSet(
      process.env.REDIS_USER_GAMES_KEY,
      opponentUsername,
      JSON.stringify(opponentGames)
    );
    logger.info(
      `Active game ${game} added for ${username} and ${opponentUsername}`
    );
  }

  static async removeActiveGame(username, opponentUsername, game) {
    logger.info(
      `Removing active game ${game} between ${username} and ${opponentUsername}`
    );
    const currentGames = await this.getActiveGames(username);

    if (currentGames[opponentUsername]) {
      currentGames[opponentUsername] = currentGames[opponentUsername].filter(
        g => g !== game
      );

      if (currentGames[opponentUsername].length === 0) {
        delete currentGames[opponentUsername];
      }

      await redisClient.hSet(
        process.env.REDIS_USER_GAMES_KEY,
        username,
        JSON.stringify(currentGames)
      );
    }

    const opponentGames = await this.getActiveGames(opponentUsername);

    if (opponentGames[username]) {
      opponentGames[username] = opponentGames[username].filter(g => g !== game);

      if (opponentGames[username].length === 0) {
        delete opponentGames[username];
      }

      await redisClient.hSet(
        process.env.REDIS_USER_GAMES_KEY,
        opponentUsername,
        JSON.stringify(opponentGames)
      );
    }
    logger.info(
      `Active game ${game} removed for ${username} and ${opponentUsername}`
    );
  }

  static async getActiveGames(username) {
    const data = await redisClient.hGet(
      process.env.REDIS_USER_GAMES_KEY,
      username
    );

    return data ? JSON.parse(data) : {};
  }
}

export default ActiveGamesService;
