import MessageHistoryService from "../../services/chat/messageHistoryService.js";

import { getAllUnreadMessageCounts } from "../../controllers/unreadController.js";

jest.mock("../../services/chat/messageHistoryService.js");

describe("UnreadController", () => {
  describe("getAllUnreadMessageCounts", () => {
    let req, res;

    beforeEach(() => {
      req = {
        user: { username: "testUser" },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      jest.clearAllMocks();
    });

    it("should return unread message counts for the requesting user", async () => {
      const mockData = { unreadCounts: { user1: 5, user2: 3 } };
      MessageHistoryService.getAllUnreadMessageCounts.mockResolvedValueOnce({
        data: mockData,
      });

      await getAllUnreadMessageCounts(req, res);

      expect(
        MessageHistoryService.getAllUnreadMessageCounts
      ).toHaveBeenCalledWith("testUser");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should return a 500 status code if an error occurs", async () => {
      const mockError = new Error("Service unavailable");
      MessageHistoryService.getAllUnreadMessageCounts.mockRejectedValueOnce(
        mockError
      );

      await getAllUnreadMessageCounts(req, res);

      expect(
        MessageHistoryService.getAllUnreadMessageCounts
      ).toHaveBeenCalledWith("testUser");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error retrieving unread message counts.",
      });
    });
  });
});
