jest.mock("socket.io", () => ({
  Server: jest.fn().mockImplementation(() => ({
    engine: {
      use: jest.fn(),
    },
  })),
}));

jest.mock("../index.js", () => ({
  io: {
    on: jest.fn(),
  },
}));
