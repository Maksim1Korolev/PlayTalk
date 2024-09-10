import jwt from "jsonwebtoken";

const generateToken = (userId, username) =>
  jwt.sign(
    {
      userId,
      username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10d",
    }
  );

export default generateToken;
