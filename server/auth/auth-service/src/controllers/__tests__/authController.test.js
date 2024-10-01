import { hash, verify } from "argon2";

import { authUser, registerUser } from "../authController.js";
import UserService from "../../services/userService.js";
import generateToken from "../../services/generateToken.js";

jest.mock("argon2");
jest.mock("../../services/userService.js");
jest.mock("../../services/generateToken.js");

describe("AuthController", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("authUser", () => {
    it("should return 401 if username is not found", async () => {
      req.body = { username: "testUser", password: "testPass" };
      UserService.getUserByUsername.mockResolvedValue(null);

      await authUser(req, res);

      expect(UserService.getUserByUsername).toHaveBeenCalledWith("testUser");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username or password is incorrect",
      });
    });

    it("should return 401 if password is incorrect", async () => {
      req.body = { username: "testUser", password: "wrongPass" };
      UserService.getUserByUsername.mockResolvedValue({
        username: "testUser",
        password: "hashedPass",
      });
      verify.mockResolvedValue(false);

      await authUser(req, res);

      expect(UserService.getUserByUsername).toHaveBeenCalledWith("testUser");
      expect(verify).toHaveBeenCalledWith("hashedPass", "wrongPass");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username or password is incorrect",
      });
    });

    it("should return user data and token if authentication is successful", async () => {
      req.body = { username: "testUser", password: "testPass" };
      const user = {
        _id: "userId",
        username: "testUser",
        password: "hashedPass",
      };
      UserService.getUserByUsername.mockResolvedValue(user);
      verify.mockResolvedValue(true);
      generateToken.mockReturnValue("mockToken");

      await authUser(req, res);

      expect(UserService.getUserByUsername).toHaveBeenCalledWith("testUser");
      expect(verify).toHaveBeenCalledWith("hashedPass", "testPass");
      expect(generateToken).toHaveBeenCalledWith("userId", "testUser");
      expect(res.json).toHaveBeenCalledWith({ user, token: "mockToken" });
    });

    it("should return 401 if there is an error during authentication", async () => {
      req.body = { username: "testUser", password: "testPass" };
      UserService.getUserByUsername.mockRejectedValue(
        new Error("Internal error")
      );

      await authUser(req, res);

      expect(UserService.getUserByUsername).toHaveBeenCalledWith("testUser");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal error",
      });
    });
  });

  describe("registerUser", () => {
    it("should return 400 if username or password is missing", async () => {
      req.body = { username: "", password: "" };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username and password are required",
      });
    });

    it("should return 400 if username is already taken", async () => {
      req.body = { username: "testUser", password: "testPass" };
      UserService.getUserByUsername.mockResolvedValue({ username: "testUser" });

      await registerUser(req, res);

      expect(UserService.getUserByUsername).toHaveBeenCalledWith("testUser");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username already taken",
      });
    });

    it("should register a new user and return user data and token", async () => {
      req.body = { username: "testUser", password: "testPass" };
      UserService.getUserByUsername.mockResolvedValue(null);
      hash.mockResolvedValue("hashedPass");
      const newUser = {
        _id: "userId",
        username: "testUser",
        password: "hashedPass",
      };
      UserService.addUser.mockResolvedValue(newUser);
      generateToken.mockReturnValue("mockToken");

      await registerUser(req, res);

      expect(UserService.getUserByUsername).toHaveBeenCalledWith("testUser");
      expect(hash).toHaveBeenCalledWith("testPass");
      expect(UserService.addUser).toHaveBeenCalledWith({
        username: "testUser",
        password: "hashedPass",
      });
      expect(generateToken).toHaveBeenCalledWith("userId", "testUser");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        user: newUser,
        token: "mockToken",
      });
    });

    it("should return 500 if there is an error during registration", async () => {
      req.body = { username: "testUser", password: "testPass" };
      UserService.getUserByUsername.mockRejectedValue(
        new Error("Internal error")
      );

      await registerUser(req, res);

      expect(UserService.getUserByUsername).toHaveBeenCalledWith("testUser");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});
