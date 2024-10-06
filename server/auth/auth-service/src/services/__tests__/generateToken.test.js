import jwt from "jsonwebtoken";
import generateToken from "../generateToken.js";

jest.mock("jsonwebtoken");

describe("generateToken", () => {
  const userId = "507f1f77bcf86cd799439011";
  const username = "testUser";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a token successfully", () => {
    const mockToken = "mockToken";
    jwt.sign.mockReturnValue(mockToken);

    const result = generateToken(userId, username);

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId, username },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );
    expect(result).toBe(mockToken);
  });

  it("should throw an error if token generation fails", () => {
    jwt.sign.mockImplementation(() => {
      throw new Error("JWT error");
    });

    expect(() => generateToken(userId, username)).toThrow(
      "Failed to generate token"
    );
  });
});
