using Microsoft.AspNetCore.Http;

namespace ko.core.Exceptions
{
    public class ApiException : Exception
    {
        public int StatusCode { get; }
        public object ErrorData { get; }

        public ApiException(string message, int statusCode, object errorData = null)
            : base(message)
        {
            StatusCode = statusCode;
            ErrorData = errorData;
        }

        public ApiException(string message, int statusCode, Exception innerException, object errorData = null)
            : base(message, innerException)
        {
            StatusCode = statusCode;
            ErrorData = errorData;
        }

        public class BadRequestException : ApiException
        {
            public BadRequestException(string message, object errorData = null)
                : base(message, StatusCodes.Status400BadRequest, errorData) { }
        }

        public class ForbiddenException : ApiException
        {
            public ForbiddenException(string message, object errorData = null)
                : base(message, StatusCodes.Status403Forbidden, errorData) { }
        }

        public class NotFoundException : ApiException
        {
            public NotFoundException(string message, object errorData = null)
                : base(message, StatusCodes.Status404NotFound, errorData) { }
        }

        public class ServerErrorException : ApiException
        {
            public ServerErrorException(string message, object errorData = null)
                : base(message, StatusCodes.Status500InternalServerError, errorData) { }
        }

        public class UnauthorizedException : ApiException
        {
            public UnauthorizedException(string message, object errorData = null)
                : base(message, StatusCodes.Status401Unauthorized, errorData) { }
        }
    }
}
