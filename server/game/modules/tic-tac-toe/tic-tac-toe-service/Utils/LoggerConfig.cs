using Serilog;
using Serilog.Events;

public static class LoggerConfig
{
    public static void ConfigureLogger()
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .WriteTo.Console(outputTemplate: "[{Context}] {Message:lj}{NewLine}{Exception}")
            .WriteTo.File(
                "logs/application-.log",
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 14,
                outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] [{Context}] {Message:lj}{NewLine}{Exception}")
            .WriteTo.File(
                "logs/error-.log",
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 14,
                restrictedToMinimumLevel: LogEventLevel.Error,
                outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] [{Context}] {Message:lj}{NewLine}{Exception}")
            .CreateLogger();
    }
}
