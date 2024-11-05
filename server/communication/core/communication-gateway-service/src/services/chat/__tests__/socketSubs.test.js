import { io } from "../../../index.js";
import { handleChatSubscriptions } from "../socketSubs.js";
import SocketService from "../../socketService.js";
import MessageHistoryService from "../messageHistoryService.js";

import { setupMockSocketAndUser } from "../../../__mocks__/io.js";

jest.mock("../../socketService.js", () => ({
  getUserSockets: jest.fn(),
}));
jest.mock("../messageHistoryService.js", () => ({
  getMessageHistory: jest.fn(),
  readAllUnreadMessages: jest.fn(),
  addMessageToHistory: jest.fn(),
  getUnreadMessagesCount: jest.fn(),
}));

//recipientUsername
describe("ChatSubscriptions", () => {
  let mockSocket, mockUsername, mockReceiverUsername;

  beforeEach(() => {
    jest.clearAllMocks();
    ({ mockSocket } = setupMockSocketAndUser());
    mockUsername = "sender";
    mockReceiverUsername = "receiver";
  });

  describe("handleChatSubscriptions", () => {
    it("should handle 'on-chat-open' and emit chat history", async () => {
      const mockMessageHistory = { messageHistory: ["message1", "message2"] };
      MessageHistoryService.getMessageHistory.mockResolvedValueOnce({
        data: mockMessageHistory,
      });

      await handleChatSubscriptions(mockSocket, mockUsername);

      const chatOpenHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "on-chat-open"
      )[1];

      const payload = { receiverUsername: mockReceiverUsername };
      await chatOpenHandler(payload);

      expect(MessageHistoryService.getMessageHistory).toHaveBeenCalledWith([
        mockUsername,
        mockReceiverUsername,
      ]);
      expect(mockSocket.emit).toHaveBeenCalledWith(
        "update-chat",
        mockMessageHistory.messageHistory,
        mockReceiverUsername
      );
    });

    it("should handle 'typing' event and notify receiver", async () => {
      SocketService.getUserSockets.mockResolvedValueOnce(["receiverSocketId"]);

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

    it("should handle 'stop typing' event and notify receiver", async () => {
      SocketService.getUserSockets.mockResolvedValueOnce(["receiverSocketId"]);

      await handleChatSubscriptions(mockSocket, mockUsername);

      const stopTypingHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "stop typing"
      )[1];

      await stopTypingHandler(mockReceiverUsername);

      expect(SocketService.getUserSockets).toHaveBeenCalledWith(
        mockReceiverUsername
      );
      expect(io.to).toHaveBeenCalledWith(["receiverSocketId"]);
      expect(io.emit).toHaveBeenCalledWith("stop typing", mockUsername);
    });

    it("should handle 'on-read-messages' event and update unread counts", async () => {
      const usernames = [mockUsername, mockReceiverUsername];
      const mockData = { data: { message: "Unread messages marked as read" } };
      MessageHistoryService.readAllUnreadMessages.mockResolvedValueOnce(
        mockData
      );

      await handleChatSubscriptions(mockSocket, mockUsername);

      const onReadMessagesHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "on-read-messages"
      )[1];

      await onReadMessagesHandler({ usernames });

      expect(MessageHistoryService.readAllUnreadMessages).toHaveBeenCalledWith(
        mockUsername,
        usernames
      );
      expect(mockSocket.emit).toHaveBeenCalledWith(
        "unread-count-messages",
        mockReceiverUsername,
        0
      );
    });

    it("should handle 'send-message' event and notify receiver", async () => {
      const message = "Hello!";
      const usernames = [mockUsername, mockReceiverUsername].sort();
      SocketService.getUserSockets.mockResolvedValueOnce(["receiverSocketId"]);

      await handleChatSubscriptions(mockSocket, mockUsername);

      const sendMessageHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "send-message"
      )[1];

      const payload = { receiverUsername: mockReceiverUsername, message };
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
    });
  });
});
