import MessageHistoryService from "../../services/chat/messageHistoryService.js";

import { getMessageHistory } from "../messageHistoryController.js";

jest.mock("../../services/chat/messageHistoryService.js");

describe("MessageHistoryController", () => {
  describe("getMessageHistory", () => {
    let req, res;

    beforeEach(() => {
      req = {
        user: { username: "testUser" },
        params: { recipientUsername: "recipientUser" },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      jest.clearAllMocks();
    });

    it("should return message history between current user and recipient", async () => {
      const mockMessageHistory = ["message1", "message2"];
      MessageHistoryService.getMessageHistory.mockResolvedValueOnce(
        mockMessageHistory
      );

      await getMessageHistory(req, res);

      const usernames = ["testUser", "recipientUser"];
      expect(MessageHistoryService.getMessageHistory).toHaveBeenCalledWith(
        usernames
      );
      expect(res.json).toHaveBeenCalledWith({
        messageHistory: mockMessageHistory,
      });
    });

    it("should return 400 if recipientUsername is missing", async () => {
      req.params.recipientUsername = undefined;

      await getMessageHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Recipient username is required.",
      });
    });

    it("should return 500 if an error occurs while fetching message history", async () => {
      const mockError = new Error("Database error");
      MessageHistoryService.getMessageHistory.mockRejectedValueOnce(mockError);

      await getMessageHistory(req, res);

      const usernames = ["testUser", "recipientUser"];
      expect(MessageHistoryService.getMessageHistory).toHaveBeenCalledWith(
        usernames
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });
});
