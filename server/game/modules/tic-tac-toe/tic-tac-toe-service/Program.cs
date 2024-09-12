using Serilog;
using Serilog.Context;
using StackExchange.Redis;
using TicTacToe.Services;
using TicTacToe.Utils;

namespace TicTacToe
{
    public class Program
    {
        public static void Main(string[] args)
        {

            try
            {
                LoggerConfig.ConfigureLogger();

                using (LogContext.PushProperty("Context", "Program.Main"))
                {
                    var builder = WebApplication.CreateBuilder(args);

                    builder.Host.UseSerilog();

                    builder.Services.AddControllers();
                    builder.Services.AddCors();

                    // Redis connection
                    RedisUtils.Initialize(builder.Configuration);
                    builder.Services.AddSingleton<IConnectionMultiplexer>(provider => RedisUtils.GetDatabase().Multiplexer);
                    var activeGamesHashKey = builder.Configuration["Redis:ActiveGamesHashKey"] ?? "ticTacToeUsernamesGame";
                    RedisUtils.ClearHash(activeGamesHashKey);


                    builder.Services.AddSingleton<IGameService, GameService>();
                    builder.Services.AddSingleton<IPlayerService, PlayerService>();

                    var app = builder.Build();

                    app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

                    app.UseRouting();

                    app.UseMiddleware<ServiceWhitelistMiddleware>();

                    app.MapControllers();

                    app.Run();

                    Log.Information("TicTacToe service started successfully");
                }
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "TicTacToe service failed to start");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }
    }
}
