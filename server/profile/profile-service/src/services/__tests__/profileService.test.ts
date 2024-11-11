import redisClient from "../../utils/redisClient";
import S3 from "../../utils/s3Client";

import Profile from "../../schemas/Profile";
import ProfileService from "../profileService";

jest.mock("../../schemas/Profile");
jest.mock("../../utils/redisClient");
jest.mock("../../utils/s3Client");

describe("ProfileService", () => {
  const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "testforavatars";
  const AVATAR_FOLDER = "avatars/";

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("listAvatars", () => {
    it("should list avatars from S3", async () => {
      const mockContents = [
        { Key: `${AVATAR_FOLDER}avatar1.svg` },
        { Key: `${AVATAR_FOLDER}avatar2.svg` },
      ];

      (S3.listObjectsV2 as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Contents: mockContents }),
      });

      const result = await ProfileService.listAvatars();

      expect(S3.listObjectsV2).toHaveBeenCalledWith({
        Bucket: S3_BUCKET_NAME,
        Prefix: AVATAR_FOLDER,
      });
      expect(result).toEqual(["avatar1.svg", "avatar2.svg"]);
    });
  });

  describe("getRandomAvatar", () => {
    it("should return a random avatar", async () => {
      jest
        .spyOn(ProfileService, "listAvatars")
        .mockResolvedValue(["avatar1.svg", "avatar2.svg"]);
      const result = await ProfileService.getRandomAvatar();
      expect(result).toMatch(/avatar(1|2)\.svg/);
    });

    it("should throw an error if no avatars are available", async () => {
      jest.spyOn(ProfileService, "listAvatars").mockResolvedValue([]);
      await expect(ProfileService.getRandomAvatar()).rejects.toThrow(
        "No avatars available in S3."
      );
    });
  });

  describe("getAvatarUrl", () => {
    it("should return a signed URL for an avatar", async () => {
      const avatarFileName = "avatar1.svg";
      const mockUrl = "https://s3-url-for-avatar";
      (S3.getSignedUrlPromise as jest.Mock).mockResolvedValue(mockUrl);

      const result = await ProfileService.getAvatarUrl(avatarFileName);

      expect(S3.getSignedUrlPromise).toHaveBeenCalledWith("getObject", {
        Bucket: S3_BUCKET_NAME,
        Key: `${AVATAR_FOLDER}${avatarFileName}`,
        Expires: 3600,
      });
      expect(result).toBe(mockUrl);
    });
  });

  describe("addProfile", () => {
    it("should create a new profile and update Redis cache", async () => {
      const userId = "user123";
      const username = "testuser";
      const profileData = {
        _id: userId,
        username,
        avatarFileName: "avatar.svg",
      };
      jest
        .spyOn(ProfileService, "getRandomAvatar")
        .mockResolvedValue("avatar.svg");

      // Casting Profile.create to Jest mock
      (Profile.create as jest.Mock).mockResolvedValue(profileData);

      const result = await ProfileService.addProfile({ userId, username });

      expect(Profile.create).toHaveBeenCalledWith(profileData);
      expect(redisClient.hSet as jest.Mock).toHaveBeenCalledWith(
        process.env.REDIS_PROFILES_USERNAME_KEY || "defaultProfileKey",
        username,
        JSON.stringify(profileData)
      );
      expect(result).toEqual(profileData);
    });
  });

  describe("getProfiles", () => {
    it("should return profiles from Redis cache if available", async () => {
      const cachedProfiles = {
        user1: JSON.stringify({
          username: "user1",
          avatarFileName: "avatar1.svg",
        }),
        user2: JSON.stringify({
          username: "user2",
          avatarFileName: "avatar2.svg",
        }),
      };
      (redisClient.hGetAll as jest.Mock).mockResolvedValue(cachedProfiles);

      const result = await ProfileService.getProfiles();

      expect(redisClient.hGetAll as jest.Mock).toHaveBeenCalledWith(
        process.env.REDIS_PROFILES_USERNAME_KEY || "defaultProfileKey"
      );
      expect(result).toEqual(
        Object.values(cachedProfiles).map((p) => JSON.parse(p))
      );
    });

    it("should fetch profiles from database if not in Redis", async () => {
      (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
      const mockProfiles = [
        {
          username: "user1",
          avatarFileName: "avatar1.svg",
          toObject: jest.fn().mockReturnValue({
            username: "user1",
            avatarFileName: "avatar1.svg",
          }),
        },
        {
          username: "user2",
          avatarFileName: "avatar2.svg",
          toObject: jest.fn().mockReturnValue({
            username: "user2",
            avatarFileName: "avatar2.svg",
          }),
        },
      ];
      (Profile.find as jest.Mock).mockResolvedValue(mockProfiles);
      jest
        .spyOn(ProfileService, "getAvatarUrl")
        .mockResolvedValue("https://mock-url-for-avatar");

      const result = await ProfileService.getProfiles();

      expect(Profile.find).toHaveBeenCalled();
      expect(result).toEqual(
        mockProfiles.map((profile) => ({
          ...profile.toObject(),
          avatarUrl: "https://mock-url-for-avatar",
        }))
      );
    });
  });

  describe("getProfileByUsername", () => {
    it("should return a profile from Redis cache if available", async () => {
      const username = "testuser";
      const cachedProfile = JSON.stringify({
        username,
        avatarFileName: "avatar.svg",
      });
      (redisClient.hGet as jest.Mock).mockResolvedValue(cachedProfile);

      const result = await ProfileService.getProfileByUsername(username);

      expect(redisClient.hGet as jest.Mock).toHaveBeenCalledWith(
        process.env.REDIS_PROFILES_USERNAME_KEY || "defaultProfileKey",
        username
      );
      expect(result).toEqual(JSON.parse(cachedProfile));
    });

    it("should fetch a profile from database if not in Redis", async () => {
      const username = "testuser";
      const dbProfile = {
        username,
        avatarFileName: "avatar.svg",
        toObject: jest
          .fn()
          .mockReturnValue({ username, avatarFileName: "avatar.svg" }),
      };
      (redisClient.hGet as jest.Mock).mockResolvedValue(null);
      (Profile.findOne as jest.Mock).mockResolvedValue(dbProfile);

      const result = await ProfileService.getProfileByUsername(username);

      expect(Profile.findOne as jest.Mock).toHaveBeenCalledWith({ username });
      expect(redisClient.hSet as jest.Mock).toHaveBeenCalledWith(
        process.env.REDIS_PROFILES_USERNAME_KEY || "defaultProfileKey",
        username,
        JSON.stringify(dbProfile)
      );
      expect(result).toEqual(dbProfile);
    });
  });
});
