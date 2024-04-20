import Player from "/../models/Player.js";

class PlayerService {
  async addPlayer(user) {
    const addedPlayer = await Player.create({ ...user });
    return addedPlayer;
  }

  async getPlayers() {
    const players = await Player.find();
    return players;
  }

  async getPlayerByUsername(username) {
    if (!username) {
      throw new Error("Username is not specified");
    }

    const player = await Player.findOne({ username: username });
    return player;
  }

  async getPlayerById(playerId) {
    if (!playerId) {
      throw new Error("ID is not specified");
    }

    const player = await Player.findOne({ _id: playerId });
    return player;
  }

  async updatePlayer(player) {
    if (!player._id) {
      throw new Error("ID is not specified");
    }
    const updatedPlayer = await Player.findByIdAndUpdate(player._id, player, {
      new: true,
    });

    return updatedPlayer;
  }

  async deletePlayer(id) {
    if (!id) {
      throw new Error("ID is not specified");
    }

    const deletedPlayer = await Player.findByIdAndDelete(id);

    return deletedPlayer;
  }
}

export default new PlayerService();
