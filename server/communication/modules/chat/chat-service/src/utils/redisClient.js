import redis from "redis";

import { getLogger } from "./logger.js";
const logger = getLogger("Redis");

const redisUrl = `${process.env.REDIS_URL}`;

const redisClient = redis.createClient({
  url: redisUrl,
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

redisClient.on("error", err => {
  logger.error(`Redis error: ${err.message}`);
});

export default redisClient;
