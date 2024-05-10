import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import router from "./online/online.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3020;

async function main() {
  app.use(cors());
  app.use(express.json());

  app.use("/api", router);
}

const mongoURL = process.env.DATABASE_URL;

console.log(mongoURL);

mongoose
  .connect(mongoURL)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch(err => console.error("Connection error", err));

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

main()
  .then(async () => {
    //await mongoose.disconnect();
  })
  .catch(async e => {
    console.error(e);
    await mongoose.disconnect();
    process.exit(1);
  });
