jest.mock("../utils/redisClient.js", () => ({
  hSet: jest.fn(),
  hGet: jest.fn(),
  hGetAll: jest.fn(),
  hDel: jest.fn(),
  hKeys: jest.fn(),
  connect: jest.fn(),
  quit: jest.fn(),
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
    quit: jest.fn(),
  })),
}));
