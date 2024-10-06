jest.mock("socket.io", () => ({
  Server: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    use: jest.fn(),
    emit: jest.fn(),
    engine: {
      use: jest.fn(),
    },
  })),
}));
