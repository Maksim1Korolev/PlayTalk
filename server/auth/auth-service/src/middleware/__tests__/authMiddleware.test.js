import { protect } from "../authMiddleware.js";
import UserService from "../../services/userService.js";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");
jest.mock("../../services/userService.js");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (data = {}) => {
  return {
    headers: data.headers || {},
    body: data.body || {},
  };
};

const mockNext = jest.fn();

describe("Auth Middleware - protect", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no authorization header is present", async () => {
    const req = mockRequest({});
    const res = mockResponse();

    await protect(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not authorized, no token provided",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if the authorization header is in the wrong format", async () => {
    const req = mockRequest({
      headers: { authorization: "Bearer" },
    });
    const res = mockResponse();

    await protect(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not authorized, no token provided",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if the token is missing", async () => {
    const req = mockRequest({
      headers: { authorization: "Bearer " },
    });
    const res = mockResponse();

    await protect(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not authorized, no token provided",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 500 if token verification fails", async () => {
    const req = mockRequest({
      headers: { authorization: "Bearer invalidToken" },
    });
    const res = mockResponse();

    jwt.verify.mockImplementation(() => {
      throw new Error("Token verification failed");
    });

    await protect(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error verifying token",
      error: "Token verification failed",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if user is not found", async () => {
    const req = mockRequest({
      headers: { authorization: "Bearer validToken" },
    });
    const res = mockResponse();

    const decodedToken = { userId: "userId123" };
    jwt.verify.mockReturnValue(decodedToken);
    UserService.getUserById.mockResolvedValue(null);

    await protect(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "User not found",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next() and add user to req if the token is valid and user is found", async () => {
    const req = mockRequest({
      headers: { authorization: "Bearer validToken" },
    });
    const res = mockResponse();

    const decodedToken = { userId: "userId123" };
    const user = { _id: "userId123", username: "testUser" };
    jwt.verify.mockReturnValue(decodedToken);
    UserService.getUserById.mockResolvedValue(user);

    await protect(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.user).toEqual(user);
    expect(res.status).not.toHaveBeenCalled();
  });
});
