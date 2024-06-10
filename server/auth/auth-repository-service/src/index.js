import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import schedule from "node-schedule";

//import { syncWithAtlas, loadLocalData } from "./sync/sync.controller.js";
import usersRoutes from "./users/users.routes.js";
import redisClient from "./utils/redisClient.js";
import {
  connectToMongoDB,
  disconnectFromMongoDB,
} from "./utils/mongooseClient.js";

dotenv.config();

const app = express();
//let shuttingDown = false;

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use("/api/users", usersRoutes);

  const PORT = process.env.PORT || 3011;

  try {
    await connectToMongoDB();
    await redisClient.connect();

    //await loadLocalData();
    app.listen(PORT, () => {
      console.log(`auth-repository-service is running on port ${PORT}`);
    });

    //schedule.scheduleJob("0 */12 * * *", syncWithAtlas);

    // const shutdown = async signal => {
    //   if (shuttingDown) return;
    //   shuttingDown = true;
    //   console.log(`Received ${signal}, shutting down gracefully...`);
    //   await syncWithAtlas();
    //   await disconnectFromMongoDB();
    //   redisClient.quit();
    //   console.log("Disconnected from MongoDB and Redis");
    //   process.exit(0);
    // };

    // process.on("SIGINT", shutdown);
    // process.on("SIGTERM", shutdown);
    // process.on("SIGUSR2", shutdown);
  } catch (err) {
    console.error("Connection error", err);
    process.exit(1);
  }
}

main().catch(async e => {
  console.error(e);
  await disconnectFromMongoDB();
  redisClient.quit();
  process.exit(1);
});
