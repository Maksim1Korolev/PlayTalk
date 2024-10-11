import axios from "axios";
import MessageHistoryService from "../messageHistoryService.js";

jest.mock("axios");

describe("MessageHistoryService", () => {
  const chatRepositoryServiceUrl = process.env.CHAT_REPOSITORY_SERVICE_URL;
  const internalServiceHeaderKey = process.env.INTERNAL_SERVICE_HEADER;
  const serviceName = "communication_gateway_service";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMessageHistory", () => {
    it("should fetch message history for provided usernames", async () => {
      const usernames = ["user1", "user2"];
      const mockResponse = {
        data: { messageHistory: ["message1", "message2"] },
      };
      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await MessageHistoryService.getMessageHistory(usernames);

      const query = usernames
        .map(u => `usernames=${encodeURIComponent(u)}`)
        .join("&");
      const expectedUrl = `${chatRepositoryServiceUrl}/messageHistories/messageHistory?${query}`;

      expect(axios.get).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("addMessageToHistory", () => {
    it("should post message to history for provided usernames", async () => {
      const usernames = ["user1", "user2"];
      const message = "Hello!";
      const mockResponse = { data: "Message added" };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await MessageHistoryService.addMessageToHistory(
        usernames,
        message
      );

      const expectedUrl = `${chatRepositoryServiceUrl}/messageHistories/messages/message`;

      expect(axios.post).toHaveBeenCalledWith(
        expectedUrl,
        { usernames, message },
        {
          headers: {
            [internalServiceHeaderKey]: serviceName,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getAllUnreadMessageCounts", () => {
    it("should fetch unread message counts for the requesting user", async () => {
      const requestingUsername = "user1";
      const mockResponse = { data: { unreadCount: 5 } };
      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await MessageHistoryService.getAllUnreadMessageCounts(
        requestingUsername
      );

      const expectedUrl = `${chatRepositoryServiceUrl}/unread/getAll/${requestingUsername}`;

      expect(axios.get).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getUnreadMessagesCount", () => {
    it("should fetch unread messages count for provided usernames", async () => {
      const requestingUsername = "user1";
      const usernames = ["user1", "user2"];
      const mockResponse = { data: { unreadCount: 3 } };
      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await MessageHistoryService.getUnreadMessagesCount(
        requestingUsername,
        usernames
      );

      const expectedUrl = `${chatRepositoryServiceUrl}/unread/${requestingUsername}?usernames=${usernames.join(
        ","
      )}`;

      expect(axios.get).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          [internalServiceHeaderKey]: serviceName,
        },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("readAllUnreadMessages", () => {
    it("should mark all unread messages as read for the requesting user", async () => {
      const requestingUsername = "user1";
      const usernames = ["user1", "user2"];
      const mockResponse = { data: "Messages marked as read" };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await MessageHistoryService.readAllUnreadMessages(
        requestingUsername,
        usernames
      );

      const expectedUrl = `${chatRepositoryServiceUrl}/unread/markAsRead/${requestingUsername}`;

      expect(axios.post).toHaveBeenCalledWith(
        expectedUrl,
        { usernames },
        {
          headers: {
            [internalServiceHeaderKey]: serviceName,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
