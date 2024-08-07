using StackExchange.Redis;
using TicTacToe.Services;
using TicTacToe.Utils;

namespace TicTacToe
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddCors();

            //Redis connection
            RedisUtils.Initialize(builder.Configuration);
            builder.Services.AddSingleton<IConnectionMultiplexer>(provider => RedisUtils.GetDatabase().Multiplexer);
            var activeGamesHashKey = builder.Configuration["Redis:ActiveGamesHashKey"] ?? "ticTacToeUsernamesGame";
            RedisUtils.ClearHash(activeGamesHashKey);

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
    }
}
