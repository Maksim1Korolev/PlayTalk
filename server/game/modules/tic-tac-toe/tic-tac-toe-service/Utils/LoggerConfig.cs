/*using Serilog;
using Serilog.Events;

namespace TicTacToe.Utils
{
    public static class LoggerConfig
    {
        public static void ConfigureLogger()
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.File(
                    "logs/application-.log",
                    rollingInterval: RollingInterval.Day,
                    retainedFileCountLimit: 14)
                .WriteTo.File(
                    "logs/error-.log",
                    rollingInterval: RollingInterval.Day,
                    retainedFileCountLimit: 14,
                    restrictedToMinimumLevel: LogEventLevel.Error)
                .CreateLogger();
        }
    }
}
*/