import { getPlayer, updatePlayers } from "../playerController.js";
import PlayerService from "../../services/playerService.js";

jest.mock("../../services/playerService.js");

describe("PlayerController", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getPlayer", () => {
    it("should return 400 if username is not provided", async () => {
      req.params = {};

      await getPlayer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username is required.",
      });
    });

    it("should return 404 if player is not found", async () => {
      req.params = { username: "testPlayer" };
      PlayerService.getPlayers.mockResolvedValue(null);

      await getPlayer(req, res);

      expect(PlayerService.getPlayers).toHaveBeenCalledWith(["testPlayer"]);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Player not found." });
    });

    it("should return player data if player is found", async () => {
      req.params = { username: "testPlayer" };
      const player = { username: "testPlayer", wins: 5 };
      PlayerService.getPlayers.mockResolvedValue([player]);

      await getPlayer(req, res);

      expect(PlayerService.getPlayers).toHaveBeenCalledWith(["testPlayer"]);
      expect(res.json).toHaveBeenCalledWith({ player: [player] });
    });

    it("should return 500 if there is an internal server error", async () => {
      req.params = { username: "testPlayer" };
      PlayerService.getPlayers.mockRejectedValue(new Error("Internal error"));

      await getPlayer(req, res);

      expect(PlayerService.getPlayers).toHaveBeenCalledWith(["testPlayer"]);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });

  describe("updatePlayers", () => {
    it("should return 400 if player data is not provided", async () => {
      req.body = {};

      await updatePlayers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Player data is required for both players.",
      });
    });

    it("should return 200 and update player data successfully", async () => {
      req.body = {
        player1NewData: { username: "player1", wins: 1 },
        player2NewData: { username: "player2", wins: 2 },
      };
      const updatedPlayers = [
        { username: "player1", wins: 1 },
        { username: "player2", wins: 2 },
      ];
      PlayerService.updatePlayers.mockResolvedValue(updatedPlayers);

      await updatePlayers(req, res);

      expect(PlayerService.updatePlayers).toHaveBeenCalledWith(
        req.body.player1NewData,
        req.body.player2NewData
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Players updated successfully.",
        updatedPlayers,
      });
    });

    it("should return 500 if there is an internal server error", async () => {
      req.body = {
        player1NewData: { username: "player1", wins: 1 },
        player2NewData: { username: "player2", wins: 2 },
      };
      PlayerService.updatePlayers.mockRejectedValue(
        new Error("Internal error")
      );

      await updatePlayers(req, res);

      expect(PlayerService.updatePlayers).toHaveBeenCalledWith(
        req.body.player1NewData,
        req.body.player2NewData
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });
});
