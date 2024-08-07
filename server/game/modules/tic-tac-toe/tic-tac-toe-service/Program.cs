using StackExchange.Redis;
using TicTacToe.Services;

namespace TicTacToe
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddCors();

            var redisConnectionString = builder.Configuration.GetConnectionString("Redis") ?? "redis:6379";
            var redis = ConnectionMultiplexer.Connect(redisConnectionString);
            builder.Services.AddSingleton<IConnectionMultiplexer>(redis);

            var activeGamesHashKey = builder.Configuration["Redis:ActiveGamesHashKey"] ?? "ticTacToeUsernamesGame";
            ClearActiveGames(redis, activeGamesHashKey);

            builder.Services.AddSingleton<IGameService, GameService>();
            builder.Services.AddSingleton<IPlayerService, PlayerService>();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            //

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            //

            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

            //
            app.UseHttpsRedirection();
            app.UseAuthorization();
            //

            app.UseRouting();
            app.MapControllers();

            app.Run();
        }

        private static void ClearActiveGames(IConnectionMultiplexer redis, string activeGamesHashKey)
        {
            try
            {
                var db = redis.GetDatabase();

                db.KeyDelete(activeGamesHashKey);

                Console.WriteLine("Cleared game cache in Redis");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error clearing game cache in Redis: {ex.Message}");
            }
        }
    }
}
