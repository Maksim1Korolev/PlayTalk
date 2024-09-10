import redisClient from "../utils/redisClient.js";
import Player from "../schemas/Player.js";

class PlayerService {
  static async addPlayer(player) {
    const addedPlayer = await Player.create({ ...player });

    await redisClient.hSet(
      process.env.REDIS_TIC_TAC_TOE_PLAYER_KEY,
      addedPlayer.username,
      JSON.stringify(addedPlayer)
    );

    return addedPlayer;
  }

  static async getPlayers(usernames) {
    if (!Array.isArray(usernames) || usernames.length === 0) {
      throw new Error("Usernames array is required and cannot be empty");
    }

    const players = [];
    const missingUsernames = [];

    for (const username of usernames) {
      const cachedPlayer = await redisClient.hGet(
        process.env.REDIS_TIC_TAC_TOE_PLAYER_KEY,
        username
      );
      if (cachedPlayer) {
        console.log(`Cache hit for player: ${username}`);
        players.push(JSON.parse(cachedPlayer));
      } else {
        console.log(`Cache miss for player: ${username}`);
        missingUsernames.push(username);
      }
    }

    // Fetching missing players from the database
    if (missingUsernames.length > 0) {
      const fetchedPlayers = await Player.find({
        username: { $in: missingUsernames },
      });

      // Adding fetched players to the result and update the cache
      for (const player of fetchedPlayers) {
        players.push(player);
        await redisClient.hSet(
          process.env.REDIS_TIC_TAC_TOE_PLAYER_KEY,
          player.username,
          JSON.stringify(player)
        );
      }

      // For any usernames still missing, creating new player entries
      const fetchedPlayerUsernames = fetchedPlayers.map(p => p.username);
      const playersToCreate = missingUsernames.filter(
        username => !fetchedPlayerUsernames.includes(username)
      );

      for (const username of playersToCreate) {
        const newPlayer = await this.addPlayer({ username: username, wins: 0 });
        players.push(newPlayer);
      }
    }
    return players;
  }

  static async updatePlayers(player1NewData, player2NewData) {
    if (!player1NewData.username || !player2NewData.username) {
      throw new Error("Usernames must be specified for both players");
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
    }

    return updatedPlayers;
  }
}

export default PlayerService;
