import PlayerService from "../playerService.js";
import Player from "../../schemas/Player.js";
import redisClient from "../../utils/redisClient.js";

describe("PlayerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addPlayer", () => {
    it("should add a player and cache it in Redis", async () => {
      const playerData = { username: "testPlayer", wins: 0 };
      const addedPlayer = { ...playerData, _id: "playerId" };

      Player.create.mockResolvedValue(addedPlayer);
      redisClient.hSet.mockResolvedValue();

      const result = await PlayerService.addPlayer(playerData);

      expect(Player.create).toHaveBeenCalledWith({ ...playerData });
      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_TIC_TAC_TOE_PLAYER_KEY,
        addedPlayer.username,
        JSON.stringify(addedPlayer)
      );
      expect(result).toEqual(addedPlayer);
    });

    it("should throw an error if adding a player fails", async () => {
      const playerData = { username: "testPlayer", wins: 0 };

      Player.create.mockRejectedValue(new Error("Database error"));

      await expect(PlayerService.addPlayer(playerData)).rejects.toThrow(
        "Failed to add player"
      );
    });
  });

  describe("getPlayers", () => {
    it("should return players from Redis cache if available", async () => {
      const usernames = ["player1", "player2"];
      const cachedPlayers = {
        player1: JSON.stringify({ username: "player1", wins: 1 }),
        player2: JSON.stringify({ username: "player2", wins: 2 }),
      };

      redisClient.hGet.mockImplementation((key, username) => {
        return cachedPlayers[username];
      });

      const result = await PlayerService.getPlayers(usernames);

      for (const username of usernames) {
        expect(redisClient.hGet).toHaveBeenCalledWith(
          process.env.REDIS_TIC_TAC_TOE_PLAYER_KEY,
          username
        );
      }
      expect(result).toEqual([
        { username: "player1", wins: 1 },
        { username: "player2", wins: 2 },
      ]);
    });
  });

  describe("updatePlayers", () => {
    it("should update players and cache the result in Redis", async () => {
      const player1NewData = { username: "player1", wins: 1 };
      const player2NewData = { username: "player2", wins: 2 };
      const players = [
        { _id: "1", username: "player1", wins: 0 },
        { _id: "2", username: "player2", wins: 0 },
      ];
      const updatedPlayers = [
        { _id: "1", username: "player1", wins: 1 },
        { _id: "2", username: "player2", wins: 2 },
      ];

      PlayerService.getPlayers = jest.fn().mockResolvedValue(players);

      Player.findOneAndUpdate.mockImplementation(({ username }) => {
        return updatedPlayers.find(player => player.username === username);
      });
      redisClient.hSet.mockResolvedValue();

      const result = await PlayerService.updatePlayers(
        player1NewData,
        player2NewData
      );

      expect(PlayerService.getPlayers).toHaveBeenCalledWith([
        "player1",
        "player2",
      ]);

      expect(Player.findOneAndUpdate).toHaveBeenCalledWith(
        { username: "player1" },
        expect.any(Object),
        { new: true }
      );
      expect(Player.findOneAndUpdate).toHaveBeenCalledWith(
        { username: "player2" },
        expect.any(Object),
        { new: true }
      );

      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_TIC_TAC_TOE_PLAYER_KEY,
        updatedPlayers[0].username,
        JSON.stringify(updatedPlayers[0])
      );
      expect(redisClient.hSet).toHaveBeenCalledWith(
        process.env.REDIS_TIC_TAC_TOE_PLAYER_KEY,
        updatedPlayers[1].username,
        JSON.stringify(updatedPlayers[1])
      );

      expect(result).toEqual(updatedPlayers);
    });
  });
});
