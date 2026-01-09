namespace SportFriends.Shared.Exceptions;

/// <summary>
/// Base application exception
/// </summary>
public class ApplicationException : Exception
{
    /// <summary>
    /// Error code
    /// </summary>
    public string Code { get; set; }
    
    /// <summary>
    /// HTTP status code
    /// </summary>
    public int StatusCode { get; set; } = 500;
    
    public ApplicationException(string message, string code = "INTERNAL_ERROR", int statusCode = 500) 
        : base(message)
    {
        Code = code;
        StatusCode = statusCode;
    }
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
        : base("Validation failed", "VALIDATION_ERROR", 422)
    {
        Errors = errors;
    }
    
    public ValidationException(string fieldName, string error)
        : base("Validation failed", "VALIDATION_ERROR", 422)
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
        : base($"{entityName} with ID {id} not found", "NOT_FOUND", 404)
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
public class ConflictException : ApplicationException
{
    public ConflictException(string message, string code = "CONFLICT")
        : base(message, code, 409)
    {
    }
}

/// <summary>
/// Unauthorized exception
/// </summary>
public class UnauthorizedException : ApplicationException
{
    public UnauthorizedException(string message = "Unauthorized")
        : base(message, "UNAUTHORIZED", 401)
    {
    }
}

/// <summary>
/// Forbidden exception
/// </summary>
public class ForbiddenException : ApplicationException
{
    public ForbiddenException(string message = "Forbidden")
        : base(message, "FORBIDDEN", 403)
    {
    }
}

/// <summary>
/// Rate limit exceeded exception
/// </summary>
public class RateLimitExceededException : ApplicationException
{
    public int RetryAfter { get; set; }
    
    public RateLimitExceededException(int retryAfter = 60)
        : base("Rate limit exceeded. Please try again later.", "RATE_LIMIT_EXCEEDED", 429)
    {
        RetryAfter = retryAfter;
    }
}
