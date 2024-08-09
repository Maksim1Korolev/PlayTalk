import redis from "redis";

const redisUrl = `${process.env.REDIS_URL}`;

const redisClient = redis.createClient({
  url: redisUrl,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", err => {
  console.log("Redis error: ", err.message);
});

export default redisClient;
