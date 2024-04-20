import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import authRoutes from "./app/auth/auth.routes.js";
import usersRoutes from "./app/users/users.routes.js";

import { errorHandler, notFound } from "./app/middleware/error.middleware.js";
dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  const __dirname = path.resolve();

  app.use("/static", express.static(path.join(__dirname, "/static/")));

  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes);

  app.use(notFound);
  app.use(errorHandler);
}
const PORT = process.env.PORT || 5000;

const mongoURL = process.env.DATABASE_URL;

console.log(mongoURL);

mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Connection error", err));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

main()
  .then(async () => {})
  .catch(async (e) => {
    console.error(e);
    await mongoose.disconnect();
    process.exit(1);
  });
