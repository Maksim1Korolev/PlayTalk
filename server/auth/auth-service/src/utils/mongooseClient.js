import mongoose from "mongoose";

import { getLogger } from "./logger.js";
const logger = getLogger("MongoDB");

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    logger.info("Successfully connected to MongoDB Atlas");
  } catch (err) {
    logger.error(`Connection error: ${err.message}`);
    process.exit(1);
  }
};

const disconnectFromMongoDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB Atlas");
  } catch (err) {
    logger.error(`Disconnection error: ${err.message}`);
  }
};

export { connectToMongoDB, disconnectFromMongoDB };
