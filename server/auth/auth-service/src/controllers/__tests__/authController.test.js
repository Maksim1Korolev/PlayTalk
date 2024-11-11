import { hash, verify } from "argon2";

import { sendMessage } from "../../utils/kafkaProducer";

import generateToken from "../../services/generateToken";
import UserService from "../../services/userService";

import { authUser, registerUser } from "../authController";

jest.mock("../../services/userService");
jest.mock("../../services/generateToken");
jest.mock("argon2", () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));
jest.mock("../../utils/kafkaProducer");

describe("AuthController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("authUser", () => {
    it("should authenticate a user and return a token", async () => {
      const req = { body: { username: "testuser", password: "password123" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockUser = {
        _id: "123",
        username: "testuser",
        password: "hashedPassword",
      };
      UserService.getUserWithPassword.mockResolvedValue(mockUser);
      verify.mockResolvedValue(true);
      const mockToken = "mockToken";
      generateToken.mockReturnValue(mockToken);

      await authUser(req, res);

      expect(UserService.getUserWithPassword).toHaveBeenCalledWith(
        req.body.username
      );
      expect(verify).toHaveBeenCalledWith(mockUser.password, req.body.password);
      expect(generateToken).toHaveBeenCalledWith(
        mockUser._id,
        mockUser.username
      );
      expect(res.json).toHaveBeenCalledWith({ token: mockToken });
    });

    it("should return 401 if the user is not found", async () => {
      const req = { body: { username: "testuser", password: "password123" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      UserService.getUserWithPassword.mockResolvedValue(null);

      await authUser(req, res);

      expect(UserService.getUserWithPassword).toHaveBeenCalledWith(
        req.body.username
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username or password is incorrect",
      });
    });

    it("should return 401 if the password is incorrect", async () => {
      const req = { body: { username: "testuser", password: "wrongpassword" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockUser = {
        _id: "123",
        username: "testuser",
        password: "hashedPassword",
      };
      UserService.getUserWithPassword.mockResolvedValue(mockUser);
      verify.mockResolvedValue(false);

      await authUser(req, res);

      expect(UserService.getUserWithPassword).toHaveBeenCalledWith(
        req.body.username
      );
      expect(verify).toHaveBeenCalledWith(mockUser.password, req.body.password);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username or password is incorrect",
      });
    });
  });

  describe("registerUser", () => {
    it("should register a new user and return a token", async () => {
      const req = { body: { username: "newuser", password: "password123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      UserService.getUserByUsername.mockResolvedValue(null);
      const hashedPassword = "hashedPassword";
      hash.mockResolvedValue(hashedPassword);
      const mockUser = { _id: "123", username: "newuser" };
      UserService.addUser.mockResolvedValue(mockUser);
      sendMessage.mockResolvedValue();
      const mockToken = "mockToken";
      generateToken.mockReturnValue(mockToken);

      await registerUser(req, res);

      expect(UserService.getUserByUsername).toHaveBeenCalledWith(
        req.body.username
      );
      expect(hash).toHaveBeenCalledWith(req.body.password);
      expect(UserService.addUser).toHaveBeenCalledWith({
        username: req.body.username,
        password: hashedPassword,
      });
      expect(sendMessage).toHaveBeenCalledWith("user-registered", {
        userId: mockUser._id,
        username: mockUser.username,
      });
      expect(generateToken).toHaveBeenCalledWith(
        mockUser._id,
        mockUser.username
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: mockToken });
    });

    it("should return 400 if username or password is missing", async () => {
      const req = { body: { username: "", password: "" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username and password are required",
      });
    });

    it("should return 400 if the username is already taken", async () => {
      const req = {
        body: { username: "existinguser", password: "password123" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = { _id: "123", username: "existinguser" };
      UserService.getUserByUsername.mockResolvedValue(mockUser);

      await registerUser(req, res);

      expect(UserService.getUserByUsername).toHaveBeenCalledWith(
        req.body.username
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username already taken",
      });
    });

    it("should handle errors and return 500 status with error message", async () => {
      const req = { body: { username: "newuser", password: "password123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      UserService.getUserByUsername.mockRejectedValue(
        new Error("Database error")
      );

      await registerUser(req, res);

      expect(UserService.getUserByUsername).toHaveBeenCalledWith(
        req.body.username
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});
