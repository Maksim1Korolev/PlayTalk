import {
  getAllUnreadMessageCounts,
  readAllUnreadMessages,
} from "../unreadController";
import MessageHistoryService from "../../services/chat/messageHistoryService";

jest.mock("../../services/chat/messageHistoryService");
jest.mock("../../utils/logger.js", () => ({
  getLogger: () => ({
    info: jest.fn(),
    error: jest.fn(),
  }),
}));

describe("MessageHistoryController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        requestingUsername: "testUser",
      },
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("getAllUnreadMessageCounts", () => {
    it("should return unread message counts for the requesting user", async () => {
      const mockData = { user1: 5, user2: 3 };
      MessageHistoryService.getAllUnreadMessageCounts.mockResolvedValue({
        data: mockData,
      });

      await getAllUnreadMessageCounts(req, res);

      expect(
        MessageHistoryService.getAllUnreadMessageCounts
      ).toHaveBeenCalledWith("testUser");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle errors when retrieving unread message counts", async () => {
      const mockError = new Error("Service error");
      MessageHistoryService.getAllUnreadMessageCounts.mockRejectedValue(
        mockError
      );

      await getAllUnreadMessageCounts(req, res);

      expect(
        MessageHistoryService.getAllUnreadMessageCounts
      ).toHaveBeenCalledWith("testUser");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error retrieving UnreadMessageCounts.",
      });
    });
  });

  describe("readAllUnreadMessages", () => {
    beforeEach(() => {
      req.body = {
        usernames: ["user1", "user2"],
      };
    });

    it("should mark all unread messages as read for the requesting user", async () => {
      const mockData = { success: true };
      MessageHistoryService.readAllUnreadMessages.mockResolvedValue({
        data: mockData,
      });

      await readAllUnreadMessages(req, res);

      expect(MessageHistoryService.readAllUnreadMessages).toHaveBeenCalledWith(
        "testUser",
        ["user1", "user2"]
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle errors when marking unread messages as read", async () => {
      const mockError = new Error("Service error");
      MessageHistoryService.readAllUnreadMessages.mockRejectedValue(mockError);

      await readAllUnreadMessages(req, res);

      expect(MessageHistoryService.readAllUnreadMessages).toHaveBeenCalledWith(
        "testUser",
        ["user1", "user2"]
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error posting previously unread messages.",
      });
    });
  });
});
