import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRoutes);

  app.use(errorHandler);
  app.use(notFound);

  const PORT = process.env.PORT || 3010;

  app.listen(PORT, () => {
    console.log(
      `auth-service is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
}

main()
  .then(async () => {})
  .catch(async err => {
    console.error(err.message);
    process.exit(1);
  });
