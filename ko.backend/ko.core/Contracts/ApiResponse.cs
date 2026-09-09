using ko.core.Exceptions;
using System.Text.Json.Serialization;

namespace ko.core.Contracts
{
    public class ApiResponse<T>
    {
        public ApiResponse()
        {
            Timestamp = DateTime.UtcNow;
        }

        public ApiResponse(T data) : this()
        {
            Data = data;
            IsSuccess = true;
        }

        public ApiResponse(string message, object details = null) : this()
        {
            Message = message;
            Details = details;
            IsSuccess = false;
        }

        public T Data { get; set; }

        [JsonPropertyName("success")]
        public bool IsSuccess { get; set; }

        public string Message { get; set; }

        public object Details { get; set; }

        public string TraceId { get; set; }

        public DateTime Timestamp { get; set; }

        public static ApiResponse<T> Success(T data, string message = null)
        {
            return new ApiResponse<T>(data) { Message = message };
        }

        public static ApiResponse<T> Failure(string message, object details = null)
        {
            return new ApiResponse<T>(message, details);
        }

        public static ApiResponse<T> ValidationFailure(Dictionary<string, List<string>> validationErrors, string message = "Validation failed")
        {
            return new ApiResponse<T>(message, validationErrors);
        }

        public static ApiResponse<T> FromException(ApiException ex, string traceId = null)
        {
            return new ApiResponse<T>(ex.Message, ex.ErrorData)
            {
                TraceId = traceId
            };
        }
    }

    public class ApiResponse : ApiResponse<object>
    {
        public ApiResponse() : base() { }
        public ApiResponse(string message, object details = null) : base(message, details) { }

        public static ApiResponse Success(string message = "Operation completed successfully")
        {
            return new ApiResponse { IsSuccess = true, Message = message };
        }

        public static new ApiResponse Failure(string message, object details = null)
        {
            return new ApiResponse(message, details);
        }

        public static new ApiResponse ValidationFailure(string[] validationErrors, string message = "Validation failed")
        {
            return new ApiResponse(message, validationErrors);
        }

        public static new ApiResponse FromException(ApiException ex, string traceId = null)
        {
            return new ApiResponse(ex.Message, ex.ErrorData)
            {
                TraceId = traceId
            };
        }
    }
}
