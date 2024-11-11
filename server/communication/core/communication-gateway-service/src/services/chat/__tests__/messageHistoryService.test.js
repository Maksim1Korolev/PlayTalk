import axios from "axios";

import MessageHistoryService from "../messageHistoryService.js";

jest.mock("axios");

describe("MessageHistoryService", () => {
  const chatServiceApiUrl = process.env.CHAT_SERVICE_API_URL;
  const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
  const serviceName = "communication_gateway_service";

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getMessageHistory", () => {
    it("should fetch message history for given usernames", async () => {
      const usernames = ["user1", "user2"];
      const mockResponse = {
        data: { messageHistory: ["message1", "message2"] },
      };
      axios.get.mockResolvedValue(mockResponse);

      const result = await MessageHistoryService.getMessageHistory(usernames);

      const expectedUrl = `${chatServiceApiUrl}/messageHistories/messageHistory?usernames=user1&usernames=user2`;
      expect(axios.get).toHaveBeenCalledWith(expectedUrl, {
        headers: { [internalServiceHeaderKey]: serviceName },
      });
      expect(result).toEqual(mockResponse.data.messageHistory);
    });

    it("should return an empty array if message history is not available", async () => {
      const usernames = ["user1", "user2"];
      axios.get.mockResolvedValue({ data: {} });

      const result = await MessageHistoryService.getMessageHistory(usernames);

      expect(result).toEqual([]);
    });
  });

  describe("addMessageToHistory", () => {
    it("should add a message to history for the specified usernames", async () => {
      const usernames = ["user1", "user2"];
      const message = "Hello!";
      const mockResponse = { data: { success: true } };
      axios.post.mockResolvedValue(mockResponse);

      const result = await MessageHistoryService.addMessageToHistory(
        usernames,
        message
      );

      const expectedUrl = `${chatServiceApiUrl}/messageHistories/messages/message`;
      expect(axios.post).toHaveBeenCalledWith(
        expectedUrl,
        { usernames, message },
        { headers: { [internalServiceHeaderKey]: serviceName } }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getAllUnreadMessageCounts", () => {
    it("should fetch all unread message counts for the requesting username", async () => {
      const requestingUsername = "user1";
      const mockResponse = { data: { unreadCounts: { user2: 5 } } };
      axios.get.mockResolvedValue(mockResponse);

      const result =
        await MessageHistoryService.getAllUnreadMessageCounts(
          requestingUsername
        );

      const expectedUrl = `${chatServiceApiUrl}/unread/getAll/${requestingUsername}`;
      expect(axios.get).toHaveBeenCalledWith(expectedUrl, {
        headers: { [internalServiceHeaderKey]: serviceName },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getUnreadMessagesCount", () => {
    it("should fetch unread message count for specific usernames", async () => {
      const requestingUsername = "user1";
      const usernames = ["user2", "user3"];
      const mockResponse = { data: { unreadCount: 10 } };
      axios.get.mockResolvedValue(mockResponse);

      const result = await MessageHistoryService.getUnreadMessagesCount(
        requestingUsername,
        usernames
      );

      const expectedUrl = `${chatServiceApiUrl}/unread/${requestingUsername}?usernames=user2,user3`;
      expect(axios.get).toHaveBeenCalledWith(expectedUrl, {
        headers: { [internalServiceHeaderKey]: serviceName },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should return an empty array if unread count is not available", async () => {
      const requestingUsername = "user1";
      const usernames = ["user2", "user3"];
      axios.get.mockResolvedValue({});

      const result = await MessageHistoryService.getUnreadMessagesCount(
        requestingUsername,
        usernames
      );

      expect(result).toEqual([]);
    });
  });

  describe("readAllUnreadMessages", () => {
    it("should mark all unread messages as read for the given usernames", async () => {
      const requestingUsername = "user1";
      const usernames = ["user2", "user3"];
      const mockResponse = { data: { success: true } };
      axios.post.mockResolvedValue(mockResponse);

      const result = await MessageHistoryService.readAllUnreadMessages(
        requestingUsername,
        usernames
      );

      const expectedUrl = `${chatServiceApiUrl}/unread/markAsRead/${requestingUsername}`;
      expect(axios.post).toHaveBeenCalledWith(
        expectedUrl,
        { usernames },
        { headers: { [internalServiceHeaderKey]: serviceName } }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
