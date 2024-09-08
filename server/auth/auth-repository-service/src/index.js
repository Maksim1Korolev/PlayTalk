import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import redisClient from "./utils/redisClient.js";
import {
  connectToMongoDB,
  disconnectFromMongoDB,
} from "./utils/mongooseClient.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import userProtectedRoutes from "./routes/userProtectedRoutes.js";
import userInternalRoutes from "./routes/userInternalRoutes.js";

dotenv.config();

const app = express();

const corsOptionsForProtectedRoutes = {
  origin: "*",
  methods: ["GET", "POST", "PUT"],
};

const corsOptionsForInternalRoutes = {
  origin: "*",
  methods: ["GET", "POST"],
};

async function main() {
  app.use(express.json());

  app.use(
    "/api/users",
    cors(corsOptionsForProtectedRoutes),
    userProtectedRoutes
  );
  app.use("/api/users", cors(corsOptionsForInternalRoutes), userInternalRoutes);

  app.use(errorHandler);
  app.use(notFound);

  const PORT = process.env.PORT || 3011;

  await connectToMongoDB();
  await redisClient.connect();

  app.listen(PORT, () => {
    console.log(
      `auth-repository-service is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
}

main().catch(async err => {
  console.error(err.message);
  await disconnectFromMongoDB();
  redisClient.quit();
  process.exit(1);
});
