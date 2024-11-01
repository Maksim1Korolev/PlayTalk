import mongoose from "mongoose";

import { getLogger } from "./logger";
const logger = getLogger("MongoDB");

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || "");
    logger.info("Successfully connected to MongoDB Atlas");
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`Connection error: ${err.message}`);
      process.exit(1);
    } else {
      logger.error("Unknown connection error occurred.");
    }
  }
};

const disconnectFromMongoDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB Atlas");
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`Disconnection error: ${err.message}`);
    } else {
      logger.error("Unknown disconnection error occurred.");
    }
  }
};

export { connectToMongoDB, disconnectFromMongoDB };
