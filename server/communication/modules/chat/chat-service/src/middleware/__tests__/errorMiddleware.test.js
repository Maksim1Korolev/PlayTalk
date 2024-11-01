import { notFound, errorHandler } from "../errorMiddleware";

describe("Error Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      originalUrl: "/some/invalid/route",
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      statusCode: undefined,
    };
    next = jest.fn();
  });

  describe("notFound", () => {
    it("should set status to 404 and pass an error to next", () => {
      notFound(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("errorHandler", () => {
    it("should set status to 500 if statusCode is 200 or undefined and return error message with stack trace", () => {
      const error = new Error("Test error");
      res.statusCode = undefined;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Test error",
        stack: error.stack,
      });
    });

    it("should return error message without stack trace in production", () => {
      const error = new Error("Production error");
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      res.statusCode = 200;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Production error",
        stack: null,
      });

      process.env.NODE_ENV = originalEnv;
    });
  });
});
