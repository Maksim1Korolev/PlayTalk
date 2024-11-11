jest.mock("../utils/redisClient.js", () => ({
  lLen: jest.fn(),
  lRange: jest.fn(),
  rPush: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
  connect: jest.fn(),
  quit: jest.fn(),
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
    quit: jest.fn(),
  })),
}));
