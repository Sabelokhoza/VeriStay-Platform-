using ko.core.Contracts;
using Microsoft.Extensions.Logging;
using Serilog.Context;
using System.Diagnostics;

namespace ko.core.Extensions
{
    public class LoggerAdapter<T> : IAppLogger<T>
    {
        private readonly ILogger<T> _logger;

        public LoggerAdapter(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<T>();
        }

        public void LogError(string message, params object[] args)
        {
            var activity = Activity.Current ?? new Activity("LogError").Start();
            using (LogContext.PushProperty("TraceId", activity.TraceId.ToString()))
            using (LogContext.PushProperty("SpanId", activity.SpanId.ToString()))
            {
                _logger.LogError(message, args);
            }
            if (Activity.Current == null) activity.Stop();
        }

        public void LogError(Exception exception, string message, params object[] args)
        {
            var activity = Activity.Current ?? new Activity("LogError").Start();
            using (LogContext.PushProperty("TraceId", activity.TraceId.ToString()))
            using (LogContext.PushProperty("SpanId", activity.SpanId.ToString()))
            {
                _logger.LogError(exception, message, args);
            }
            if (Activity.Current == null) activity.Stop();
        }

        public void LogInformation(string message, params object[] args)
        {
            var activity = Activity.Current ?? new Activity("LogInformation").Start();
            using (LogContext.PushProperty("TraceId", activity.TraceId.ToString()))
            using (LogContext.PushProperty("SpanId", activity.SpanId.ToString()))
            {
                _logger.LogInformation(message, args);
            }
            if (Activity.Current == null) activity.Stop();
        }

        public void LogWarning(string message, params object[] args)
        {
            var activity = Activity.Current ?? new Activity("LogWarning").Start();
            using (LogContext.PushProperty("TraceId", activity.TraceId.ToString()))
            using (LogContext.PushProperty("SpanId", activity.SpanId.ToString()))
            {
                _logger.LogWarning(message, args);
            }
            if (Activity.Current == null) activity.Stop();
        }

        public void LogCritical(string message, params object[] args)
        {
            var activity = Activity.Current ?? new Activity("LogCritical").Start();
            using (LogContext.PushProperty("TraceId", activity.TraceId.ToString()))
            using (LogContext.PushProperty("SpanId", activity.SpanId.ToString()))
            {
                _logger.LogCritical(message, args);
            }
            if (Activity.Current == null) activity.Stop();
        }

        public void LogDebug(string message, params object[] args)
        {
            var activity = Activity.Current ?? new Activity("LogDebug").Start();
            using (LogContext.PushProperty("TraceId", activity.TraceId.ToString()))
            using (LogContext.PushProperty("SpanId", activity.SpanId.ToString()))
            {
                _logger.LogDebug(message, args);
            }
            if (Activity.Current == null) activity.Stop();
        }

        public void LogTrace(string message, params object[] args)
        {
            var activity = Activity.Current ?? new Activity("LogTrace").Start();
            using (LogContext.PushProperty("TraceId", activity.TraceId.ToString()))
            using (LogContext.PushProperty("SpanId", activity.SpanId.ToString()))
            {
                _logger.LogTrace(message, args);
            }
            if (Activity.Current == null) activity.Stop();
        }
    }
}
