jest.mock("../utils/redisClient", () => ({
  hSet: jest.fn(),
  hGet: jest.fn(),
  hGetAll: jest.fn(),
  hDel: jest.fn(),
  del: jest.fn(),
  connect: jest.fn(),
  quit: jest.fn(),
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
    quit: jest.fn(),
  })),
}));
