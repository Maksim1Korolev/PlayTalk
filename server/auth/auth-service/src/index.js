import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { errorHandler, notFound } from "./middleware/core/errorMiddleware.js";
import { authRoutes, usersRoutes } from "./routes/index.js";

dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes);

  app.use(notFound);
  app.use(errorHandler);

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
