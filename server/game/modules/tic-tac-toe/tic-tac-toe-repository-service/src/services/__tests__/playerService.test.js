// import PlayerService from "../playerService.js";
// import Player from "../../schemas/Player.js";
// import redisClient from "../../utils/redisClient.js";

// describe("PlayerService", () => {
//   const REDIS_PLAYER_KEY = "REDIS_TIC_TAC_TOE_PLAYER_KEY";

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("addPlayer", () => {
//     it("should add a new player and cache it in Redis", async () => {
//       const playerData = { username: "testPlayer", wins: 0 };
//       const createdPlayer = { ...playerData, _id: "playerId" };

//       Player.create.mockResolvedValue(createdPlayer);
//       redisClient.hSet.mockResolvedValue();

//       const result = await PlayerService.addPlayer(playerData);

//       expect(Player.create).toHaveBeenCalledWith(playerData);
//       expect(redisClient.hSet).toHaveBeenCalledWith(
//         REDIS_PLAYER_KEY,
//         createdPlayer.username,
//         JSON.stringify(createdPlayer)
//       );
//       expect(result).toEqual(createdPlayer);
//     });

//     it("should throw an error if adding a player fails", async () => {
//       const playerData = { username: "testPlayer", wins: 0 };

//       Player.create.mockRejectedValue(new Error("Database error"));

//       await expect(PlayerService.addPlayer(playerData)).rejects.toThrow(
//         "Failed to add player"
//       );
//       expect(redisClient.hSet).not.toHaveBeenCalled();
//     });
//   });

//   describe("getPlayers", () => {
//     it("should fetch players from Redis cache if available", async () => {
//       const usernames = ["testPlayer"];
//       const cachedPlayer = { username: "testPlayer", wins: 0 };

//       redisClient.hGet.mockResolvedValue(JSON.stringify(cachedPlayer));

//       const result = await PlayerService.getPlayers(usernames);

//       expect(redisClient.hGet).toHaveBeenCalledWith(
//         REDIS_PLAYER_KEY,
//         "testPlayer"
//       );
//       expect(result).toEqual([cachedPlayer]);
//       expect(Player.find).not.toHaveBeenCalled();
//     });

//     it("should fetch missing players from the database if not cached", async () => {
//       const usernames = ["testPlayer"];
//       const dbPlayer = { username: "testPlayer", wins: 0 };

//       redisClient.hGet.mockResolvedValue(null); // Cache miss
//       Player.find.mockResolvedValue([dbPlayer]);
//       redisClient.hSet.mockResolvedValue();

//       const result = await PlayerService.getPlayers(usernames);

//       expect(redisClient.hGet).toHaveBeenCalledWith(
//         REDIS_PLAYER_KEY,
//         "testPlayer"
//       );
//       expect(Player.find).toHaveBeenCalledWith({
//         username: { $in: usernames },
//       });
//       expect(redisClient.hSet).toHaveBeenCalledWith(
//         REDIS_PLAYER_KEY,
//         "testPlayer",
//         JSON.stringify(dbPlayer)
//       );
//       expect(result).toEqual([dbPlayer]);
//     });

//     it("should throw an error if usernames array is empty", async () => {
//       await expect(PlayerService.getPlayers([])).rejects.toThrow(
//         "Usernames array is required and cannot be empty"
//       );
//     });
//   });

//   describe("updatePlayers", () => {
//     it("should update players and cache updated data", async () => {
//       const player1Data = { username: "player1", wins: 5 };
//       const player2Data = { username: "player2", wins: 3 };
//       const updatedPlayer1 = { username: "player1", wins: 6 };
//       const updatedPlayer2 = { username: "player2", wins: 5 };

//       PlayerService.getPlayers = jest
//         .fn()
//         .mockResolvedValue([player1Data, player2Data]);

//       Player.findOneAndUpdate
//         .mockResolvedValueOnce(updatedPlayer1)
//         .mockResolvedValueOnce(updatedPlayer2);
//       redisClient.hSet.mockResolvedValue();

//       const result = await PlayerService.updatePlayers(
//         player1Data,
//         player2Data
//       );

//       expect(PlayerService.getPlayers).toHaveBeenCalledWith([
//         "player1",
//         "player2",
//       ]);
//       expect(Player.findOneAndUpdate).toHaveBeenCalledTimes(2);
//       expect(redisClient.hSet).toHaveBeenCalledTimes(2);
//       expect(redisClient.hSet).toHaveBeenCalledWith(
//         REDIS_PLAYER_KEY,
//         "player1",
//         JSON.stringify(updatedPlayer1)
//       );
//       expect(redisClient.hSet).toHaveBeenCalledWith(
//         REDIS_PLAYER_KEY,
//         "player2",
//         JSON.stringify(updatedPlayer2)
//       );
//       expect(result).toEqual([updatedPlayer1, updatedPlayer2]);
//     });

//     it("should throw an error if usernames are not specified", async () => {
//       await expect(
//         PlayerService.updatePlayers({ wins: 1 }, { wins: 2 })
//       ).rejects.toThrow("Usernames must be specified for both players");
//     });
//   });
// });
