import { serviceWhitelistMiddleware } from "../serviceWhitelistMiddleware";

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

const mockRequest = (headers = {}, ip = "127.0.0.1") => {
  return {
    headers,
    ip,
  };
};

const mockNext = jest.fn();

describe("Service Whitelist Middleware", () => {
  let originalEnv;
  const INTERNAL_SERVICE_HEADER = "x-internal-service";

  beforeEach(() => {
    originalEnv = process.env;
    process.env.INTERNAL_SERVICE_HEADER = INTERNAL_SERVICE_HEADER;
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
  });

  it("should allow access for whitelisted services", () => {
    const req = mockRequest({
      [INTERNAL_SERVICE_HEADER]: "communication_gateway_service",
    });
    const res = mockResponse();

    serviceWhitelistMiddleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should block access for non-whitelisted services", () => {
    const req = mockRequest({ [INTERNAL_SERVICE_HEADER]: "unknown_service" });
    const res = mockResponse();

    serviceWhitelistMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access forbidden: Service not allowed",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should block access and log IP when no service header is provided", () => {
    const req = mockRequest({});
    const res = mockResponse();

    serviceWhitelistMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access forbidden: Service not allowed",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
