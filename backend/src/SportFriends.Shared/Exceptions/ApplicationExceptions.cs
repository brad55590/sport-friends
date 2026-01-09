namespace SportFriends.Shared.Exceptions;

public abstract class ApplicationException(string message, string code, int statusCode) : Exception(message)
{
    public int StatusCode { get; } = statusCode;
    public string Code { get; } = code;
}

/// <summary>
/// Validation exception for field-level errors
/// </summary>
public class ValidationException : ApplicationException
{
    /// <summary>
    /// Field validation errors
    /// </summary>
    public Dictionary<string, string[]> Errors { get; set; }

    public ValidationException(Dictionary<string, string[]> errors)
        : base("Validation failed", "VALIDATION_ERROR", (int)System.Net.HttpStatusCode.UnprocessableEntity)
    {
        Errors = errors;
    }

    public ValidationException(string fieldName, string error)
        : base("Validation failed", "VALIDATION_ERROR", (int)System.Net.HttpStatusCode.UnprocessableEntity)
    {
        Errors = new Dictionary<string, string[]> { { fieldName, [error] } };
    }
}

/// <summary>
/// Not found exception
/// </summary>
public class NotFoundException : ApplicationException
{
    public NotFoundException(string entityName, Guid id)
        : base($"{entityName} with ID {id} not found", "NOT_FOUND", (int)System.Net.HttpStatusCode.NotFound)
    {
    }

    public NotFoundException(string message)
        : base(message, "NOT_FOUND", 404)
    {
    }
}

/// <summary>
/// Conflict exception (e.g., duplicate email)
/// </summary>
public class ConflictException(string message, string code = "CONFLICT") : ApplicationException(message, code, (int)System.Net.HttpStatusCode.Conflict);

/// <summary>
/// Unauthorized exception
/// </summary>
public class UnauthorizedException(string message = "Unauthorized") : ApplicationException(message, "UNAUTHORIZED", (int)System.Net.HttpStatusCode.Unauthorized);

/// <summary>
/// Forbidden exception
/// </summary>
public class ForbiddenException(string message = "Forbidden") : ApplicationException(message, "FORBIDDEN", (int)System.Net.HttpStatusCode.Forbidden);

/// <summary>
/// Rate limit exceeded exception
/// </summary>
public class RateLimitExceededException(int retryAfter = 60)
    : ApplicationException("Rate limit exceeded. Please try again later.", "RATE_LIMIT_EXCEEDED", (int)System.Net.HttpStatusCode.TooManyRequests)
{
    public int RetryAfter { get; set; } = retryAfter;
}
