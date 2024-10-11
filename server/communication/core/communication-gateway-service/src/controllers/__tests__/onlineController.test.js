import { getOnlineUsernames } from "../onlineController.js";
import SocketService from "../../services/socketService.js";

jest.mock("../../services/socketService.js");

describe("OnlineController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getOnlineUsernames", () => {
    it("should return 200 and the list of online usernames", async () => {
      const mockOnlineUsernames = ["user1", "user2", "user3"];
      SocketService.getOnlineUsernames.mockResolvedValue(mockOnlineUsernames);

      await getOnlineUsernames(req, res, next);

      expect(SocketService.getOnlineUsernames).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        onlineUsernames: mockOnlineUsernames,
      });
    });

    it("should return 500 if there is an error fetching online usernames", async () => {
      const errorMessage = "Error fetching data";
      SocketService.getOnlineUsernames.mockRejectedValue(
        new Error(errorMessage)
      );

      await getOnlineUsernames(req, res, next);

      expect(SocketService.getOnlineUsernames).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });
});
