import MessageHistoryService from "../../services/messageHistoryService.js";

import {
  addMessageToHistory,
  getMessageHistory,
} from "../messageHistoryController.js";

jest.mock("../../services/messageHistoryService.js");

describe("MessageHistoryController", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("addMessageToHistory", () => {
    it("should return 200 if message is successfully added", async () => {
      req.body = {
        usernames: ["user1", "user2"],
        message: "Hello, this is a test message.",
      };
      MessageHistoryService.addMessage.mockResolvedValue();

      await addMessageToHistory(req, res);

      expect(MessageHistoryService.addMessage).toHaveBeenCalledWith(
        req.body.usernames,
        req.body.message
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Message successfully added to message history.",
      });
    });

    it("should return 500 if there is an internal server error", async () => {
      req.body = {
        usernames: ["user1", "user2"],
        message: "Hello, this is a test message.",
      };
      MessageHistoryService.addMessage.mockRejectedValue(
        new Error("Internal error")
      );

      await addMessageToHistory(req, res);

      expect(MessageHistoryService.addMessage).toHaveBeenCalledWith(
        req.body.usernames,
        req.body.message
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });

  describe("getMessageHistory", () => {
    it("should return 400 if usernames are not provided", async () => {
      req.query = {};

      await getMessageHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usernames are required.",
      });
    });

    it("should return message history if usernames are provided", async () => {
      req.query = { usernames: ["user1", "user2"] };
      const messageHistory = [
        { from: "user1", to: "user2", message: "Hi!", timestamp: Date.now() },
      ];
      MessageHistoryService.getMessageHistory.mockResolvedValue(messageHistory);

      await getMessageHistory(req, res);

      expect(MessageHistoryService.getMessageHistory).toHaveBeenCalledWith(
        req.query.usernames
      );
      expect(res.json).toHaveBeenCalledWith({ messageHistory });
    });

    it("should return 500 if there is an internal server error", async () => {
      req.query = { usernames: ["user1", "user2"] };
      MessageHistoryService.getMessageHistory.mockRejectedValue(
        new Error("Internal error")
      );

      await getMessageHistory(req, res);

      expect(MessageHistoryService.getMessageHistory).toHaveBeenCalledWith(
        req.query.usernames
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });
});
