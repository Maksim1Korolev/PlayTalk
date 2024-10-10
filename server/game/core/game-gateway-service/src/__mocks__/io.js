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
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  },
}));
