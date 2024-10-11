import jwt from "jsonwebtoken";
import { socketAuthMiddleware, protect } from "../authMiddleware.js";
import UserService from "../../services/userService.js";
import SocketService from "../../services/socketService.js";

jest.mock("jsonwebtoken");
jest.mock("../../services/userService.js");
jest.mock("../../services/socketService.js");

describe("AuthMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      headers: {},
      _query: {},
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("socketAuthMiddleware", () => {
    it("should pass through if it is not a handshake request", () => {
      req._query.sid = "some_sid";

      socketAuthMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return error if no authorization header is provided", () => {
      socketAuthMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error("No token provided"));
    });

    it("should return error if token format is invalid", () => {
      req.headers.authorization = "InvalidFormat";

      socketAuthMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error("Invalid token format"));
    });

    it("should return error if token verification fails", () => {
      req.headers.authorization = "Bearer invalidToken";
      jwt.verify.mockImplementation((token, secret, callback) =>
        callback(new Error("Invalid token"), null)
      );

      socketAuthMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error("Invalid token"));
    });

    it("should return error if user is not found", async () => {
      req.headers.authorization = "Bearer validToken";
      jwt.verify.mockImplementation((token, secret, callback) =>
        callback(null, { userId: "userId" })
      );
      UserService.getUserById.mockResolvedValue(null);

      await socketAuthMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error("User not found"));
    });

    it("should call next if user is authenticated", async () => {
      req.headers.authorization = "Bearer validToken";
      jwt.verify.mockImplementation((token, secret, callback) =>
        callback(null, { userId: "userId" })
      );
      UserService.getUserById.mockResolvedValue({ username: "testUser" });

      await socketAuthMiddleware(req, res, next);

      expect(req.user).toEqual({ username: "testUser" });
      expect(next).toHaveBeenCalled();
    });
  });

  describe("protect", () => {
    it("should return 401 if no token is provided", async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not authorized, no token provided",
      });
    });

    it("should return 401 if user is not found", async () => {
      req.headers.authorization = "Bearer validToken";
      jwt.verify.mockReturnValue({ userId: "userId", username: "testUser" });
      SocketService.getOnlineUsernames.mockResolvedValue([]);
      UserService.getUserById.mockResolvedValue(null);

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 403 if unauthorized access is attempted", async () => {
      req.headers.authorization = "Bearer validToken";
      req.params.requestingUsername = "anotherUser";
      jwt.verify.mockReturnValue({ userId: "userId", username: "testUser" });
      SocketService.getOnlineUsernames.mockResolvedValue(["testUser"]);
      UserService.getUserById.mockResolvedValue({ username: "testUser" });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorized access to this user's data",
      });
    });

    it("should call next if user is authenticated and authorized", async () => {
      req.headers.authorization = "Bearer validToken";
      req.params.requestingUsername = "testUser";
      jwt.verify.mockReturnValue({ userId: "userId", username: "testUser" });
      SocketService.getOnlineUsernames.mockResolvedValue(["testUser"]);
      UserService.getUserById.mockResolvedValue({
        id: "userId",
        username: "testUser",
      });

      await protect(req, res, next);

      expect(req.user).toEqual({ id: "userId", username: "testUser" });
      expect(next).toHaveBeenCalled();
    });
  });
});
