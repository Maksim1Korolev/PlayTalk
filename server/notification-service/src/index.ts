import dotenv from "dotenv";
import express, { Express } from "express";

import cors from "cors";
import path from "path";
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

async function main() {
  app.use(cors());
  app.use(express.json());
  //app.use("/api/something", somethingRouter);

  const __dirname = path.resolve();
  app.use("/public", express.static(path.join(__dirname, "public")));
}
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

main();
