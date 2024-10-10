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

export const setupMockSocketAndUser = () => {
  const mockUser = { username: "testUser" };
  const mockSocket = {
    id: "socket123",
    request: { user: mockUser },
    on: jest.fn(),
    disconnect: jest.fn(),
    emit: jest.fn(),
    broadcast: {
      emit: jest.fn(),
    },
  };

  return { mockSocket, mockUser };
};
