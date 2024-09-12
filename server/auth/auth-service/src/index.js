import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { getLogger } from "./utils/logger.js";
const logger = getLogger("Main");

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import authRouter from "./routes/authRoutes.js";

dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRouter);

  app.use(errorHandler);
  app.use(notFound);

  const PORT = process.env.PORT || 3010;

  app.listen(PORT, () => {
    logger.info(
      `auth-service is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
}

main()
  .then(async () => {
    logger.info("Main function executed successfully.");
  })
  .catch(async err => {
    logger.error(`Application startup error: ${err.message}`);
    process.exit(1);
  });
