import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";

import { errorHandler, notFound } from "./middleware/error.middleware.js";
dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  //app.use("/api/auth", authRoutes);

  //   app.use(notFound);
  //   app.use(errorHandler);
}
const PORT = process.env.PORT || 3011;

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
