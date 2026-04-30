using ko.core.Contracts;
using ko.core.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Diagnostics;


namespace ko.core.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next, IHostEnvironment env)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();
            context.Items["RequestStartTime"] = DateTime.UtcNow;

            try
            {
                await _next(context);   
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex, stopwatch.ElapsedMilliseconds);
            }
            finally
            {
                stopwatch.Stop();

                var logger = context.RequestServices.GetRequiredService<IAppLogger<ExceptionMiddleware>>();
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception, long elapsedMs)
        {

            var logger = context.RequestServices.GetRequiredService<IAppLogger<ExceptionMiddleware>>();
            context.Response.ContentType = "application/json";

            var traceId = Activity.Current?.TraceId.ToString() ?? context.TraceIdentifier;
            ApiResponse errorResponse;

            switch (exception)
            {
                case ApiException apiException:
                    context.Response.StatusCode = apiException.StatusCode;
                    errorResponse = ApiResponse.FromException(apiException, traceId);
                   
                    break;

                case ArgumentException argEx:
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    errorResponse = ApiResponse.Failure(argEx.Message);
                    errorResponse.TraceId = traceId;
                    
                    break;

                default:
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;

                    var details = new
                    {
                        ExceptionMessage = exception.Message,
                        StackTrace = exception.StackTrace
                    };

                    errorResponse = ApiResponse.Failure("An unexpected error occurred.", details);
                    errorResponse.TraceId = traceId;
                    break;
            }


            //To do this might not work 
            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(errorResponse));
        }
    }
}
