using StackExchange.Redis;

namespace TicTacToe.Utils
{
    public static class RedisUtils
    {
        private static IConnectionMultiplexer _redis;

        public static void Initialize(IConfiguration configuration)
        {
            var redisConnectionString = configuration.GetConnectionString("Redis") ?? "redis:6379";
            _redis = ConnectionMultiplexer.Connect(redisConnectionString);
        }

        public static IDatabase GetDatabase()
        {
            if (_redis == null)
            {
                throw new InvalidOperationException("Redis connection has not been initialized.");
            }

            return _redis.GetDatabase();
        }

        public static void ClearHash(string hashKey)
        {
            try
            {
                var db = GetDatabase();
                db.KeyDelete(hashKey);
                Console.WriteLine("Cleared game cache in Redis");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error clearing game cache in Redis: {ex.Message}");
            }
        }
    }
}
