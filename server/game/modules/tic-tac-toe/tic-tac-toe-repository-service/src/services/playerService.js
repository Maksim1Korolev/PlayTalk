import redisClient from "../utils/redisClient.js";
import { getLogger } from "../utils/logger.js";
const logger = getLogger("PlayerService");

import Player from "../schemas/Player.js";

class PlayerService {
  static async addPlayer(player) {
    const addedPlayer = await Player.create({ ...player });

    await redisClient.hSet(
      process.env.REDIS_TIC_TAC_TOE_PLAYER_KEY,
      addedPlayer.username,
      JSON.stringify(addedPlayer)
    );

    logger.info(`Player added: ${addedPlayer.username}`);
    return addedPlayer;
  }

  static async getPlayers(usernames) {
    if (!Array.isArray(usernames) || usernames.length === 0) {
      const error = "Usernames array is required and cannot be empty";
      logger.error(error);
      throw new Error(error);
    }

    logger.info(`Fetching players: ${usernames.join(", ")}`);
    const players = [];
    const missingUsernames = [];

    for (const username of usernames) {
      const cachedPlayer = await redisClient.hGet(
        process.env.REDIS_TIC_TAC_TOE_PLAYER_KEY,
        username
      );

      if (cachedPlayer) {
        logger.info(`Cache hit for player: ${username}`);
        players.push(JSON.parse(cachedPlayer));
      } else {
        logger.info(`Cache miss for player: ${username}`);
        missingUsernames.push(username);
      }
    }

    if (missingUsernames.length > 0) {
      logger.info(`Fetching players from DB: ${missingUsernames.join(", ")}`);
      const fetchedPlayers = await Player.find({
        username: { $in: missingUsernames },
      });

      for (const player of fetchedPlayers) {
        players.push(player);
        await redisClient.hSet(
          process.env.REDIS_TIC_TAC_TOE_PLAYER_KEY,
          player.username,
          JSON.stringify(player)
        );
        logger.info(`Fetched and cached player: ${player.username}`);
      }

      const fetchedPlayerUsernames = fetchedPlayers.map(p => p.username);
      const playersToCreate = missingUsernames.filter(
        username => !fetchedPlayerUsernames.includes(username)
      );

      for (const username of playersToCreate) {
        const newPlayer = await this.addPlayer({ username, wins: 0 });
        players.push(newPlayer);
        logger.info(`New player created: ${username}`);
      }
    }

    return players;
  }

  static async updatePlayers(player1NewData, player2NewData) {
    if (!player1NewData.username || !player2NewData.username) {
      const error = "Usernames must be specified for both players";
      logger.error(error);
      throw new Error(error);
    }

    const players = await this.getPlayers([
      player1NewData.username,
      player2NewData.username,
    ]);

    const updatedPlayers = [];

    for (const player of players) {
      const newData =
        player.username === player1NewData.username
          ? player1NewData
          : player2NewData;

      for (const property in newData) {
        if (property !== "username" && newData.hasOwnProperty(property)) {
          player[property] = (player[property] || 0) + newData[property];
        }
      }

      const updatedPlayer = await Player.findOneAndUpdate(
        { username: player.username },
        player,
        { new: true }
      );

      updatedPlayers.push(updatedPlayer);

      await redisClient.hSet(
        process.env.REDIS_TIC_TAC_TOE_PLAYER_KEY,
        updatedPlayer.username,
        JSON.stringify(updatedPlayer)
      );

      logger.info(`Player updated: ${updatedPlayer.username}`);
    }

    return updatedPlayers;
  }
}

export default PlayerService;
