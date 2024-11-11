import jwt from "jsonwebtoken";

import { protect } from "../authMiddleware";

jest.mock("jsonwebtoken");

describe("AuthMiddleware - protect", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it("should return 401 if authorization header format is incorrect", async () => {
    const req = { headers: { authorization: "Token abc123" } };
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

  it("should decode the token and call next if token is valid", async () => {
    const req = {
      headers: {
        authorization: "Bearer validToken",
      },
    };
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

  it("should return 500 if token verification fails", async () => {
    const req = { headers: { authorization: "Bearer invalidToken" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const errorMessage = "Invalid token";
    jwt.verify.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "invalidToken",
      process.env.JWT_SECRET
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error verifying token",
      error: errorMessage,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
