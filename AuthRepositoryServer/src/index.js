import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import usersRoutes from "./users/users.routes.js";
import { syncWithAtlas, loadLocalData } from "./sync/sync.controller.js";
import schedule from "node-schedule";

dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use("/api/users", usersRoutes);

  const PORT = process.env.PORT || 3011;
  const DB_URI = process.env.DB_URI;

  mongoose
    .connect(DB_URI)
    .then(async () => {
      console.log("Successfully connected to MongoDB Atlas");
      await loadLocalData();
      app.listen(PORT, () => {
        console.log(`AuthRepository server is running on port ${PORT}`);
      });
    })
    .catch(err => console.error("Connection error", err));

  schedule.scheduleJob("0 */12 * * *", syncWithAtlas);

  process.on("SIGTERM", async () => {
    await syncWithAtlas();
    process.exit(0);
  });
}

main()
  .then(async () => {})
  .catch(async e => {
    console.error(e);
    await mongoose.disconnect();
    process.exit(1);
  });
