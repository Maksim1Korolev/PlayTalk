import UserService from "../../services/userService";

import { addUser, getUserByUsername, getUsers } from "../userController";

jest.mock("../../services/userService");

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addUser", () => {
    it("should add a user and return 201 status with the user data", async () => {
      const req = { body: { user: { name: "Test User" } } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = { _id: "123", name: "Test User" };
      UserService.addUser.mockResolvedValue(mockUser);

      await addUser(req, res);

      expect(UserService.addUser).toHaveBeenCalledWith(req.body.user);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it("should handle errors and return 500 status with error message", async () => {
      const req = { body: { user: { name: "Test User" } } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const errorMessage = "Database error";
      UserService.addUser.mockRejectedValue(new Error(errorMessage));

      await addUser(req, res);

      expect(UserService.addUser).toHaveBeenCalledWith(req.body.user);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("getUsers", () => {
    it("should fetch all users and return them in response", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
      };

      const mockUsers = [{ _id: "123", name: "Test User" }];
      UserService.getUsers.mockResolvedValue(mockUsers);

      await getUsers(req, res);

      expect(UserService.getUsers).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
    });

    it("should handle errors and return 500 status with error message", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const errorMessage = "Error fetching users";
      UserService.getUsers.mockRejectedValue(new Error(errorMessage));

      await getUsers(req, res);

      expect(UserService.getUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("getUserByUsername", () => {
    it("should fetch a user by username and return the user in response", async () => {
      const req = { params: { username: "testuser" } };
      const res = {
        json: jest.fn(),
      };

      const mockUser = { _id: "123", username: "testuser" };
      UserService.getUserByUsername.mockResolvedValue(mockUser);

      await getUserByUsername(req, res);

      expect(UserService.getUserByUsername).toHaveBeenCalledWith(
        req.params.username
      );
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it("should return 404 status if user is not found", async () => {
      const req = { params: { username: "nonexistentuser" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      UserService.getUserByUsername.mockResolvedValue(null);

      await getUserByUsername(req, res);

      expect(UserService.getUserByUsername).toHaveBeenCalledWith(
        req.params.username
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should handle errors and return 500 status with error message", async () => {
      const req = { params: { username: "testuser" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const errorMessage = "Error fetching user";
      UserService.getUserByUsername.mockRejectedValue(new Error(errorMessage));

      await getUserByUsername(req, res);

      expect(UserService.getUserByUsername).toHaveBeenCalledWith(
        req.params.username
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
