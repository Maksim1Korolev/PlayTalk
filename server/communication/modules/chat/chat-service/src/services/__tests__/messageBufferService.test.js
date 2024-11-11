import redisClient from "../../utils/redisClient.js";

import MessageHistory from "../../schemas/MessageHistory.js";
import MessageBufferService from "../messageBufferService.js";
import MessageHistoryService from "../messageHistoryService.js";

jest.mock("../messageHistoryService.js");
jest.mock("../../schemas/MessageHistory.js");

describe("MessageBufferService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addToBuffer", () => {
    it("should add a message to buffer and flush if threshold is met", async () => {
      process.env.MESSAGE_BUFFER_THRESHOLD = "2";
      const usernames = ["user1", "user2"];
      const message = { text: "Hello" };
      const bufferKey = `message_history:user1-user2`;
      const messageCountKey = `message_count:user1-user2`;

      redisClient.lLen.mockResolvedValue(2);
      redisClient.get.mockResolvedValue("0");
      redisClient.rPush.mockResolvedValue();
      redisClient.set.mockResolvedValue();

      MessageHistoryService.getSortedUsernames.mockReturnValue([
        "user1",
        "user2",
      ]);
      jest
        .spyOn(MessageBufferService, "flushBufferToDatabase")
        .mockResolvedValue();

      await MessageBufferService.addToBuffer(usernames, message);

      expect(redisClient.rPush).toHaveBeenCalledWith(
        bufferKey,
        JSON.stringify(message)
      );
      expect(MessageBufferService.flushBufferToDatabase).toHaveBeenCalledWith([
        "user1",
        "user2",
      ]);
      expect(redisClient.set).toHaveBeenCalledWith(messageCountKey, 2);
    });

    it("should load Mongo data to buffer if buffer is empty", async () => {
      const usernames = ["user1", "user2"];
      const message = { text: "Hello" };
      const bufferKey = `message_history:user1-user2`;

      redisClient.lLen.mockResolvedValue(0);
      redisClient.rPush.mockResolvedValue();
      jest.spyOn(MessageBufferService, "loadMongoToBuffer").mockResolvedValue();

      await MessageBufferService.addToBuffer(usernames, message);

      expect(MessageBufferService.loadMongoToBuffer).toHaveBeenCalledWith([
        "user1",
        "user2",
      ]);
      expect(redisClient.rPush).toHaveBeenCalledWith(
        bufferKey,
        JSON.stringify(message)
      );
    });
  });

  describe("loadMongoToBuffer", () => {
    it("should load message history from MongoDB into Redis", async () => {
      const usernames = ["user1", "user2"];
      const messages = [{ text: "Hi" }, { text: "Hello" }];
      const bufferKey = `message_history:user1-user2`;
      const messageCountKey = `message_count:user1-user2`;

      MessageHistoryService.getSortedUsernames.mockReturnValue([
        "user1",
        "user2",
      ]);
      MessageHistory.findOne.mockResolvedValue({ messages });
      redisClient.set.mockResolvedValue();

      await MessageBufferService.loadMongoToBuffer(usernames);

      expect(redisClient.rPush).toHaveBeenCalledWith(
        bufferKey,
        JSON.stringify(messages[0])
      );
      expect(redisClient.rPush).toHaveBeenCalledWith(
        bufferKey,
        JSON.stringify(messages[1])
      );
      expect(redisClient.set).toHaveBeenCalledWith(
        messageCountKey,
        messages.length
      );
    });
  });

  describe("flushBufferToDatabase", () => {
    it("should flush buffer messages to MongoDB", async () => {
      const usernames = ["user1", "user2"];
      const messages = [
        { _id: "1", text: "Hi" },
        { _id: "2", text: "Hello" },
      ];
      const bufferKey = `message_history:user1-user2`;
      const messageCountKey = `message_count:user1-user2`;

      redisClient.lRange.mockResolvedValue(messages.map(JSON.stringify));
      MessageHistory.findOne.mockResolvedValue({ messages: [] });
      redisClient.del.mockResolvedValue();

      await MessageBufferService.flushBufferToDatabase(usernames);

      expect(MessageHistory.findOne).toHaveBeenCalledWith({
        usernames: ["user1", "user2"],
      });
      expect(redisClient.del).toHaveBeenCalledWith(bufferKey);
      expect(redisClient.del).toHaveBeenCalledWith(messageCountKey);
    });

    it("should not flush if buffer is empty", async () => {
      const usernames = ["user1", "user2"];
      const bufferKey = `message_history:user1-user2`;

      redisClient.lRange.mockResolvedValue([]);

      await MessageBufferService.flushBufferToDatabase(usernames);

      expect(redisClient.lRange).toHaveBeenCalledWith(bufferKey, 0, -1);
      expect(MessageHistory.findOne).not.toHaveBeenCalled();
    });
  });

  describe("getMessagesFromBuffer", () => {
    it("should retrieve messages from buffer", async () => {
      const usernames = ["user1", "user2"];
      const messages = [{ text: "Hello" }, { text: "How are you?" }];
      const bufferKey = `message_history:user1-user2`;

      redisClient.lRange.mockResolvedValue(messages.map(JSON.stringify));

      const result =
        await MessageBufferService.getMessagesFromBuffer(usernames);

      expect(redisClient.lRange).toHaveBeenCalledWith(bufferKey, 0, -1);
      expect(result).toEqual(messages);
    });
  });
});
