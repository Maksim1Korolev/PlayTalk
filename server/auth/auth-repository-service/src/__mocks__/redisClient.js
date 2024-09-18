jest.mock("../utils/redisClient.js", () => ({
  connect: jest.fn(),
  quit: jest.fn(),
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
    quit: jest.fn(),
  })),
}));
