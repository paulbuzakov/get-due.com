using System.Text.Json;
using FluentValidation;

namespace GetDue.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, type, title, errors) = exception switch
        {
            ValidationException validationEx => (
                StatusCodes.Status400BadRequest,
                "ValidationError",
                "One or more validation errors occurred.",
                validationEx.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }).ToArray() as object
            ),
            InvalidOperationException => (
                StatusCodes.Status400BadRequest,
                "BadRequest",
                exception.Message,
                (object?)null
            ),
            KeyNotFoundException => (
                StatusCodes.Status404NotFound,
                "NotFound",
                exception.Message,
                (object?)null
            ),
            UnauthorizedAccessException => (
                StatusCodes.Status401Unauthorized,
                "Unauthorized",
                exception.Message,
                (object?)null
            ),
            _ => (
                StatusCodes.Status500InternalServerError,
                "InternalError",
                "An unexpected error occurred.",
                (object?)null
            )
        };

        if (statusCode == StatusCodes.Status500InternalServerError)
            _logger.LogError(exception, "Unhandled exception");

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var response = new { type, title, status = statusCode, errors };
        await context.Response.WriteAsync(JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        }));
    }
}
