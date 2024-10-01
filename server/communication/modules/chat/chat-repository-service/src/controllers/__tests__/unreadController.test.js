import {
  getUnreadMessageCount,
  markAsRead,
  getAllUnreadMessageCount,
} from "../unreadController.js";
import MessageHistoryService from "../../services/messageHistoryService.js";

jest.mock("../../services/messageHistoryService.js"); // Mock the MessageHistoryService module

describe("UnreadController", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getUnreadMessageCount", () => {
    it("should return 400 if requesting username is not provided", async () => {
      req.params = {};
      req.query = { usernames: "user1,user2" };

      await getUnreadMessageCount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username is required.",
      });
    });

    it("should return 400 if usernames are not provided", async () => {
      req.params = { requestingUsername: "requestingUser" };
      req.query = {};

      await getUnreadMessageCount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usernames of MessageHistory are required.",
      });
    });

    it("should return unread message count if successful", async () => {
      req.params = { requestingUsername: "requestingUser" };
      req.query = { usernames: "user1,user2" };
      const unreadCount = 5;
      MessageHistoryService.getUnreadMessagesCount.mockResolvedValue(
        unreadCount
      );

      await getUnreadMessageCount(req, res);

      expect(MessageHistoryService.getUnreadMessagesCount).toHaveBeenCalledWith(
        ["user1", "user2"],
        "requestingUser"
      );
      expect(res.json).toHaveBeenCalledWith(unreadCount);
    });

    it("should return 500 if there is an internal server error", async () => {
      req.params = { requestingUsername: "requestingUser" };
      req.query = { usernames: "user1,user2" };
      MessageHistoryService.getUnreadMessagesCount.mockRejectedValue(
        new Error("Internal error")
      );

      await getUnreadMessageCount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });

  describe("markAsRead", () => {
    it("should return 400 if requesting username is not provided", async () => {
      req.params = {};
      req.body = { usernames: ["user1", "user2"] };

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username is required.",
      });
    });

    it("should return 401 if usernames are not provided", async () => {
      req.params = { requestingUsername: "requestingUser" };
      req.body = {};

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usernames of MessageHistory are required.",
      });
    });

    it("should return 200 if messages are marked as read successfully", async () => {
      req.params = { requestingUsername: "requestingUser" };
      req.body = { usernames: ["user1", "user2"] };
      MessageHistoryService.markAsRead.mockResolvedValue(true);

      await markAsRead(req, res);

      expect(MessageHistoryService.markAsRead).toHaveBeenCalledWith(
        ["user1", "user2"],
        "requestingUser"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Messages marked as read.",
      });
    });

    it("should return 404 if messages are not found", async () => {
      req.params = { requestingUsername: "requestingUser" };
      req.body = { usernames: ["user1", "user2"] };
      MessageHistoryService.markAsRead.mockResolvedValue(false);

      await markAsRead(req, res);

      expect(MessageHistoryService.markAsRead).toHaveBeenCalledWith(
        ["user1", "user2"],
        "requestingUser"
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Messages not found." });
    });

    it("should return 500 if there is an internal server error", async () => {
      req.params = { requestingUsername: "requestingUser" };
      req.body = { usernames: ["user1", "user2"] };
      MessageHistoryService.markAsRead.mockRejectedValue(
        new Error("Internal error")
      );

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });

  describe("getAllUnreadMessageCount", () => {
    it("should return 400 if requesting username is not provided", async () => {
      req.params = {};

      await getAllUnreadMessageCount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username is required.",
      });
    });

    it("should return unread message count for all chats if successful", async () => {
      req.params = { requestingUsername: "requestingUser" };
      const unreadCount = 10;
      MessageHistoryService.getAllUnreadMessagesCount.mockResolvedValue(
        unreadCount
      );

      await getAllUnreadMessageCount(req, res);

      expect(
        MessageHistoryService.getAllUnreadMessagesCount
      ).toHaveBeenCalledWith("requestingUser");
      expect(res.json).toHaveBeenCalledWith(unreadCount);
    });

    it("should return 500 if there is an internal server error", async () => {
      req.params = { requestingUsername: "requestingUser" };
      MessageHistoryService.getAllUnreadMessagesCount.mockRejectedValue(
        new Error("Internal error")
      );

      await getAllUnreadMessageCount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });
});
