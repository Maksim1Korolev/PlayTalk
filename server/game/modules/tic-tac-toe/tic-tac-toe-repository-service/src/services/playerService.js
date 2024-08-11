import redisClient from "../utils/redisClient.js";
import Player from "../../models/Player.js";

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

  static async getPlayerByUsername(username) {
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

    const player = await Player.findOne({ username: username });

    if (player) {
      await redisClient.hSet(
        process.env.REDIS_TIC_TAC_TOE_PLAYER_HASH_KEY,
        username,
        JSON.stringify(player)
      );
    }

    return player;
  }

  static async updatePlayer(player) {
    const updatedPlayer = await Player.findByIdAndUpdate(player._id, player, {
      new: true,
    });

    if (updatedPlayer) {
      await redisClient.hSet(
        process.env.REDIS_TIC_TAC_TOE_PLAYER_HASH_KEY,
        updatedPlayer.username,
        JSON.stringify(updatedPlayer)
      );
    }

    return updatedPlayer;
  }
}

export default PlayerService;
