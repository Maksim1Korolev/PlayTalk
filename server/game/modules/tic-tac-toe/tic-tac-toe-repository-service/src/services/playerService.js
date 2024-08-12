import redisClient from "../utils/redisClient.js";
import Player from "../models/Player.js";

class PlayerService {
  static async addPlayer(player) {
    const addedPlayer = await Player.create({ ...player });

    await redisClient.hSet(
      process.env.REDIS_TIC_TAC_TOE_PLAYER_HASH_KEY,
      addedPlayer.username,
      JSON.stringify(addedPlayer)
    );

    return addedPlayer;
  }

  static async getPlayer(username) {
    if (!username) {
      throw new Error("Username is not specified");
    }

    const cachedPlayer = await redisClient.hGet(
      process.env.REDIS_TIC_TAC_TOE_PLAYER_HASH_KEY,
      username
    );
    if (cachedPlayer) {
      console.log(`Cache hit for player: ${username}`);
      return JSON.parse(cachedPlayer);
    } else {
      console.log(`Cache miss for player: ${username}`);
    }

    let player = await Player.findOne({ username: username });

    if (!player) {
      console.log(
        `Player not found in database. Creating new player: ${username}`
      );
      player = await this.addPlayer({ username: username, wins: 0 });
    }

    if (player) {
      await redisClient.hSet(
        process.env.REDIS_TIC_TAC_TOE_PLAYER_HASH_KEY,
        username,
        JSON.stringify(player)
      );
    }

    return player;
  }

  static async getPlayers(usernames) {
    if (!Array.isArray(usernames)) {
      throw new Error("Usernames must be an array");
    }

    const players = [];
    const missingUsernames = [];

    for (const username of usernames) {
      const cachedPlayer = await redisClient.hGet(
        process.env.REDIS_TIC_TAC_TOE_PLAYER_HASH_KEY,
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

    if (missingUsernames.length > 0) {
      const foundPlayers = await Player.find({
        username: { $in: missingUsernames },
      });

      const foundUsernames = foundPlayers.map(player => player.username);
      const newUsernames = missingUsernames.filter(
        username => !foundUsernames.includes(username)
      );

      for (const newUsername of newUsernames) {
        console.log(`Creating new player: ${newUsername}`);
        const newPlayer = await this.addPlayer({
          username: newUsername,
          wins: 0,
        });
        players.push(newPlayer);
      }

      players.push(...foundPlayers);

      for (const player of foundPlayers) {
        await redisClient.hSet(
          process.env.REDIS_TIC_TAC_TOE_PLAYER_HASH_KEY,
          player.username,
          JSON.stringify(player)
        );
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
        process.env.REDIS_TIC_TAC_TOE_PLAYER_HASH_KEY,
        updatedPlayer.username,
        JSON.stringify(updatedPlayer)
      );
    }

    return updatedPlayers;
  }
}

export default PlayerService;
