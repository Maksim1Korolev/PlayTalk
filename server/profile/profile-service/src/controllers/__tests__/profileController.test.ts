import { NextFunction, Request, Response } from "express";

import ProfileService from "../../services/profileService";

import { getProfileByUsername, getProfiles } from "../profileController";

jest.mock("../../services/profileService");

describe("ProfileController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getProfiles", () => {
    it("should fetch and return profiles with status 200", async () => {
      const mockProfiles = [{ username: "user1" }, { username: "user2" }];
      (ProfileService.getProfiles as jest.Mock).mockResolvedValue(mockProfiles);

      await getProfiles(req as Request, res as Response, next);

      expect(ProfileService.getProfiles).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ profiles: mockProfiles });
    });

    it("should return 404 if no profiles are found", async () => {
      (ProfileService.getProfiles as jest.Mock).mockResolvedValue([]);

      await getProfiles(req as Request, res as Response, next);

      expect(ProfileService.getProfiles).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No profiles found" });
    });

    it("should return 500 on service error", async () => {
      const errorMessage = "Database error";
      (ProfileService.getProfiles as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await getProfiles(req as Request, res as Response, next);

      expect(ProfileService.getProfiles).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("getProfileByUsername", () => {
    it("should fetch and return a profile by username with status 200", async () => {
      const mockProfile = { username: "user1" };
      req.params = { username: "user1" };
      (ProfileService.getProfileByUsername as jest.Mock).mockResolvedValue(
        mockProfile
      );

      await getProfileByUsername(req as Request, res as Response, next);

      expect(ProfileService.getProfileByUsername).toHaveBeenCalledWith("user1");
      expect(res.json).toHaveBeenCalledWith({ profile: mockProfile });
    });

    it("should return 404 if profile by username is not found", async () => {
      req.params = { username: "userNotFound" };
      (ProfileService.getProfileByUsername as jest.Mock).mockResolvedValue(
        null
      );

      await getProfileByUsername(req as Request, res as Response, next);

      expect(ProfileService.getProfileByUsername).toHaveBeenCalledWith(
        "userNotFound"
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 500 on service error when fetching profile by username", async () => {
      const errorMessage = "Database error";
      req.params = { username: "userError" };
      (ProfileService.getProfileByUsername as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await getProfileByUsername(req as Request, res as Response, next);

      expect(ProfileService.getProfileByUsername).toHaveBeenCalledWith(
        "userError"
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
