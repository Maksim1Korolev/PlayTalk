import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import authRoutes from "./auth/auth.routes.js";
import usersRoutes from "./users/users.routes.js";

import { errorHandler, notFound } from "./middleware/error.middleware.js";
dotenv.config();

const app = express();

async function main() {
  app.use(cors());
  app.use(express.json());

  const __dirname = path.resolve();

  app.use("/public", express.static(path.join(__dirname, "../public")));

  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes);

  app.use(notFound);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3010;

  app.listen(PORT, () => {
    console.log(`Server listening at PORT ${PORT}`);
  });
}

main()
  .then(async () => {})
  .catch(async e => {
    console.error(e);
    process.exit(1);
  });
