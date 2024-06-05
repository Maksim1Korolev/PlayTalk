import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import usersRoutes from "./users/users.routes.js";
import { syncWithAtlas, loadLocalData } from "./sync/sync.controller.js";
import schedule from "node-schedule";

dotenv.config();

const app = express();
let shuttingDown = false;

async function main() {
  app.use(cors());
  app.use(express.json());

  //app.use("/api/users", usersRoutes);

  const PORT = process.env.PORT || 3021;
  const DB_URL = process.env.DATABASE_URL;

  try {
    await mongoose.connect(DB_URL);
    console.log("Successfully connected to MongoDB Atlas");
    await loadLocalData();
    app.listen(PORT, () => {
      console.log(`chat-repository-service is running on port ${PORT}`);
    });

    schedule.scheduleJob("0 */12 * * *", syncWithAtlas);

    const shutdown = async signal => {
      if (shuttingDown) return;
      shuttingDown = true;
      console.log(`Received ${signal}, shutting down gracefully...`);
      await syncWithAtlas();
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
    process.on("SIGUSR2", shutdown);
  } catch (err) {
    console.error("Connection error", err);
    process.exit(1);
  }
}

main().catch(async e => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
