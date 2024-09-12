using Microsoft.Extensions.Primitives;
using Serilog;
using Serilog.Context;

public class ServiceWhitelistMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string[] _whitelistedServices;
    private readonly string _serviceHeaderKey;

    public ServiceWhitelistMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;

        _serviceHeaderKey = Environment.GetEnvironmentVariable("INTERNAL_SERVICE_HEADER")
                            ?? configuration["ServiceSettings:InternalServiceHeader"]
                            ?? "internal-service";

        _whitelistedServices = configuration["ServiceSettings:WhitelistedServices"]?.Split(',') ?? ["game_gateway_service"];
    }

    public async Task InvokeAsync(HttpContext context)
    {
        using (LogContext.PushProperty("Context", "ServiceWhitelist.Middleware"))
        {
            if (!context.Request.Headers.TryGetValue(_serviceHeaderKey, out StringValues serviceHeader))
            {
                Log.Warning("Access forbidden: No service header provided.");
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("Access forbidden: No service header provided.");
                return;
            }

            var serviceHeaderValue = serviceHeader.ToString();

            Log.Information("Service request from {ServiceHeader}", serviceHeaderValue);

            if (_whitelistedServices.Contains(serviceHeaderValue))
            {
                Log.Information("Access granted for service: {ServiceHeader}", serviceHeaderValue);
                await _next(context);
            }
            else
            {
                Log.Warning("Access forbidden: Service {ServiceHeader} is not allowed.", serviceHeaderValue);
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("Access forbidden: Service not allowed.");
            }
        }
    }
}
