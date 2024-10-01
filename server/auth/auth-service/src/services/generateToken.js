import jwt from "jsonwebtoken";

import { getLogger } from "../utils/logger.js";
const logger = getLogger("GenerateToken");

const generateToken = (userId, username) => {
  try {
    const token = jwt.sign(
      {
        userId,
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10d",
      }
    );

    logger.info(`Token generated for user: ${username}`);
    return token;
  } catch (error) {
    logger.error(
      `Error generating token for user: ${username} - ${error.message}`
    );
    throw new Error("Failed to generate token");
  }
};

export default generateToken;
