import jwt from "jsonwebtoken";

import { protect, socketAuthMiddleware } from "../authMiddleware";

jest.mock("jsonwebtoken");

describe("AuthMiddleware", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("socketAuthMiddleware", () => {
    it("should proceed to the next middleware if it's not a handshake request", () => {
      const req = { _query: { sid: "someSid" }, headers: {} };
      const res = {};
      const next = jest.fn();

      socketAuthMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return an error if the authorization header is missing", () => {
      const req = { _query: {}, headers: {} };
      const res = {};
      const next = jest.fn();

      socketAuthMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error("Invalid or missing token"));
    });

    it("should return an error if the token is invalid", () => {
      const req = {
        _query: {},
        headers: { authorization: "Bearer invalidToken" },
      };
      const res = {};
      const next = jest.fn();

      jwt.verify.mockImplementation((token, secret, callback) =>
        callback(new Error("Invalid token"))
      );

      socketAuthMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(
        "invalidToken",
        process.env.JWT_SECRET,
        expect.any(Function)
      );
      expect(next).toHaveBeenCalledWith(new Error("Invalid token"));
    });

    it("should attach user to req and call next on valid token", () => {
      const req = {
        _query: {},
        headers: { authorization: "Bearer validToken" },
      };
      const res = {};
      const next = jest.fn();
      const mockDecoded = { userId: "123", username: "testuser" };

      jwt.verify.mockImplementation((token, secret, callback) =>
        callback(null, mockDecoded)
      );

      socketAuthMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(
        "validToken",
        process.env.JWT_SECRET,
        expect.any(Function)
      );
      expect(req.user).toEqual({
        id: mockDecoded.userId,
        username: mockDecoded.username,
      });
      expect(next).toHaveBeenCalled();
    });
  });

  describe("protect", () => {
    it("should return 401 if authorization header is missing", async () => {
      const req = { headers: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not authorized, no token provided",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 500 if token verification fails", async () => {
      const req = { headers: { authorization: "Bearer invalidToken" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(
        "invalidToken",
        process.env.JWT_SECRET
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error verifying token",
        error: "Invalid token",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should attach user to req and call next on valid token", async () => {
      const req = { headers: { authorization: "Bearer validToken" } };
      const res = {};
      const next = jest.fn();
      const mockDecoded = { userId: "123", username: "testuser" };

      jwt.verify.mockReturnValue(mockDecoded);

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(
        "validToken",
        process.env.JWT_SECRET
      );
      expect(req.user).toEqual({
        id: mockDecoded.userId,
        username: mockDecoded.username,
      });
      expect(next).toHaveBeenCalled();
    });
  });
});
