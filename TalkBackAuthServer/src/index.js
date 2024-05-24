import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";

import authRoutes from "./auth/auth.routes.js";
import UserService from "./service/UserService.js";
import usersRoutes from "./users/users.routes.js";

import { errorHandler, notFound } from "./middleware/error.middleware.js";
dotenv.config();

const app = express();
UserService.loadAvatars();

async function main() {
  app.use(cors());
  app.use(express.json());

  const __dirname = path.resolve();

  app.use("/public", express.static(path.join(__dirname, "../public")));
  console.log(__dirname);

  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes);

  app.use(notFound);
  app.use(errorHandler);
}
const PORT = process.env.PORT || 5000;

const mongoURL = process.env.DATABASE_URL;

console.log(mongoURL);

mongoose
  .connect(mongoURL)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch(err => console.error("Connection error", err));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

main()
  .then(async () => {})
  .catch(async e => {
    console.error(e);
    await mongoose.disconnect();
    process.exit(1);
  });
