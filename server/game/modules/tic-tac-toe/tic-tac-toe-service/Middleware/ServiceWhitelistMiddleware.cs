using Microsoft.Extensions.Primitives;

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
        if (!context.Request.Headers.TryGetValue(_serviceHeaderKey, out StringValues serviceHeader))
        {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsync("Access forbidden: No service header provided.");
            return;
        }

        var serviceHeaderValue = serviceHeader.ToString();

        if (_whitelistedServices.Contains(serviceHeaderValue))
        {
            await _next(context);
        }
        else
        {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsync("Access forbidden: Service not allowed.");
        }
    }
}
