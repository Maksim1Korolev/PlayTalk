import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Successfully connected to MongoDB Atlas");
  } catch (err) {
    console.error("Connection error", err);
    process.exit(1);
  }
};

const disconnectFromMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB Atlas");
  } catch (err) {
    console.error("Disconnection error", err);
  }
};

export { connectToMongoDB, disconnectFromMongoDB };
