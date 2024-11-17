import { io } from "../../../index.js";

import { setupMockSocketAndUser } from "../../../__mocks__/io.js";
import SocketService from "../../socketService.js";
import MessageHistoryService from "../messageHistoryService.js";
import { handleChatSubscriptions } from "../socketSubs.js";

jest.mock("../../socketService.js", () => ({
  getUserSockets: jest.fn(),
}));
jest.mock("../messageHistoryService.js", () => ({
  readAllUnreadMessages: jest.fn(),
  addMessageToHistory: jest.fn(),
  getUnreadMessagesCount: jest.fn(),
}));

describe("ChatSubscriptions", () => {
  let mockSocket, mockUsername, mockReceiverUsername;

  beforeEach(() => {
    jest.clearAllMocks();
    ({ mockSocket, mockUsername } = setupMockSocketAndUser());
    mockReceiverUsername = "receiver";
  });

  describe("handleChatSubscriptions", () => {
    it("should handle 'typing' event and notify receiver", async () => {
      SocketService.getUserSockets.mockResolvedValue(["receiverSocketId"]);

      await handleChatSubscriptions(mockSocket, mockUsername);
      const typingHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "typing"
      )[1];
      await typingHandler(mockReceiverUsername);

      expect(SocketService.getUserSockets).toHaveBeenCalledWith(
        mockReceiverUsername
      );
      expect(io.to).toHaveBeenCalledWith(["receiverSocketId"]);
      expect(io.emit).toHaveBeenCalledWith("typing", mockUsername);
    });

    it("should handle 'stop-typing' event and notify receiver", async () => {
      SocketService.getUserSockets.mockResolvedValue(["receiverSocketId"]);

      await handleChatSubscriptions(mockSocket, mockUsername);
      const stopTypingHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "stop-typing"
      )[1];
      await stopTypingHandler(mockReceiverUsername);

      expect(SocketService.getUserSockets).toHaveBeenCalledWith(
        mockReceiverUsername
      );
      expect(io.to).toHaveBeenCalledWith(["receiverSocketId"]);
      expect(io.emit).toHaveBeenCalledWith("stop-typing", mockUsername);
    });

    it("should handle 'messages-read' event and update unread counts", async () => {
      const usernames = [mockUsername, mockReceiverUsername];
      MessageHistoryService.readAllUnreadMessages.mockResolvedValue({
        data: true,
      });

      await handleChatSubscriptions(mockSocket, mockUsername);
      const onReadMessagesHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "messages-read"
      )[1];
      await onReadMessagesHandler({ usernames });

      expect(MessageHistoryService.readAllUnreadMessages).toHaveBeenCalledWith(
        mockUsername,
        usernames
      );
      expect(mockSocket.emit).toHaveBeenCalledWith("unread-count-messages", {
        username: otherUserInChat,
        unreadMessageCount: 0,
      });
    });

    it("should handle 'send-message' event and notify receiver", async () => {
      const message = "Hello!";
      const usernames = [mockUsername, mockReceiverUsername].sort();
      SocketService.getUserSockets.mockResolvedValue(["receiverSocketId"]);
      MessageHistoryService.getUnreadMessagesCount.mockResolvedValue(3);

      await handleChatSubscriptions(mockSocket, mockUsername);
      const sendMessageHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "send-message"
      )[1];
      const payload = { recipientUsername: mockReceiverUsername, message };
      await sendMessageHandler(payload);

      expect(MessageHistoryService.addMessageToHistory).toHaveBeenCalledWith(
        usernames,
        message
      );
      expect(SocketService.getUserSockets).toHaveBeenCalledWith(
        mockReceiverUsername
      );
      expect(io.to).toHaveBeenCalledWith(["receiverSocketId"]);
      expect(io.emit).toHaveBeenCalledWith("receive-message", message);
      expect(io.emit).toHaveBeenCalledWith("unread-count-messages", {
        username: mockUsername,
        unreadMessageCount: 3,
      });
    });
  });
});
