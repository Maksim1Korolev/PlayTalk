import {
  getUsers,
  updateUser,
  addUser,
  getUserByUsername,
  getUserById,
} from "../userController.js";
import UserService from "../../services/userService.js";

jest.mock("../../services/userService.js");

jest.mock("../../utils/redisClient.js", () => ({
  connect: jest.fn(),
  quit: jest.fn(),
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
    quit: jest.fn(),
  })),
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (data = {}) => {
  return {
    body: data.body,
    params: data.params,
  };
};

describe("User Controller Tests", () => {
  describe("getUsers", () => {
    it("should return a list of users", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const users = [{ username: "user1" }, { username: "user2" }];
      UserService.getUsers.mockResolvedValue(users);

      await getUsers(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ users });
    });

    it("should return 500 if there is an error", async () => {
      const req = mockRequest();
      const res = mockResponse();
      UserService.getUsers.mockRejectedValue(new Error("Error fetching users"));

      await getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error fetching users" });
    });
  });

  describe("updateUser", () => {
    it("should update a user and return updated user", async () => {
      const req = mockRequest({
        body: { _id: "userId", username: "updatedUser" },
      });
      const res = mockResponse();
      const updatedUser = { _id: "userId", username: "updatedUser" };
      UserService.updateUser.mockResolvedValue(updatedUser);

      await updateUser(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ user: updatedUser });
    });

    it("should return 500 if there is an error", async () => {
      const req = mockRequest({
        body: { _id: "userId", username: "updatedUser" },
      });
      const res = mockResponse();
      UserService.updateUser.mockRejectedValue(
        new Error("Error updating user")
      );

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error updating user" });
    });
  });

  describe("addUser", () => {
    it("should add a user and return the user object", async () => {
      const req = mockRequest({ body: { user: { username: "newUser" } } });
      const res = mockResponse();
      const newUser = { _id: "newUserId", username: "newUser" };
      UserService.addUser.mockResolvedValue(newUser);

      await addUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ user: newUser });
    });

    it("should return 500 if there is an error", async () => {
      const req = mockRequest({ body: { user: { username: "newUser" } } });
      const res = mockResponse();
      UserService.addUser.mockRejectedValue(new Error("Error adding user"));

      await addUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error adding user" });
    });
  });

  describe("getUserByUsername", () => {
    it("should return user by username", async () => {
      const req = mockRequest({ params: { username: "user1" } });
      const res = mockResponse();
      const user = { username: "user1" };
      UserService.getUserByUsername.mockResolvedValue(user);

      await getUserByUsername(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ user });
    });

    it("should return 404 if user is not found", async () => {
      const req = mockRequest({ params: { username: "user1" } });
      const res = mockResponse();
      UserService.getUserByUsername.mockResolvedValue(null);

      await getUserByUsername(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 500 if there is an error", async () => {
      const req = mockRequest({ params: { username: "user1" } });
      const res = mockResponse();
      UserService.getUserByUsername.mockRejectedValue(
        new Error("Error fetching user")
      );

      await getUserByUsername(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error fetching user" });
    });
  });

  describe("getUserById", () => {
    it("should return user by ID", async () => {
      const req = mockRequest({ params: { id: "userId" } });
      const res = mockResponse();
      const user = { _id: "userId", username: "user1" };
      UserService.getUserById.mockResolvedValue(user);

      await getUserById(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ user });
    });

    it("should return 404 if user is not found", async () => {
      const req = mockRequest({ params: { id: "userId" } });
      const res = mockResponse();
      UserService.getUserById.mockResolvedValue(null);

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 500 if there is an error", async () => {
      const req = mockRequest({ params: { id: "userId" } });
      const res = mockResponse();
      UserService.getUserById.mockRejectedValue(
        new Error("Error fetching user")
      );

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error fetching user" });
    });
  });
});
