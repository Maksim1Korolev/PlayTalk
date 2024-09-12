using Serilog;
using Serilog.Context;
using StackExchange.Redis;

namespace TicTacToe.Utils
{
    public static class RedisUtils
    {
        private static IConnectionMultiplexer? _redis;

        public static void Initialize(IConfiguration configuration)
        {
            using (LogContext.PushProperty("Context", "RedisUtils.Initialize"))
            {
                var redisConnectionString = configuration.GetConnectionString("Redis") ?? "redis:6379";
                Log.Information("Initializing Redis with connection string: {RedisConnectionString}", redisConnectionString);
                _redis = ConnectionMultiplexer.Connect(redisConnectionString);
                Log.Information("Redis initialized successfully.");
            }
        }

        public static IDatabase GetDatabase()
        {
            if (_redis == null)
            {
                Log.Error("Attempted to get Redis database but the connection was not initialized.");
                throw new InvalidOperationException("Redis connection has not been initialized.");
            }

            Log.Debug("Fetching Redis database instance.");
            return _redis.GetDatabase();
        }

        public static void ClearHash(string hashKey)
        {
            using (LogContext.PushProperty("Context", "RedisUtils.ClearHash"))
            {
                try
                {
                    var db = GetDatabase();
                    db.KeyDelete(hashKey);
                    Log.Information("Cleared game cache in Redis with hash key: {HashKey}", hashKey);
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "Error clearing game cache in Redis for hash key: {HashKey}", hashKey);
                }
            }
        }
    }
}
