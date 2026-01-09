namespace SportFriends.Shared.DTOs;

/// <summary>
/// Standard API response wrapper following HATEOAS pattern
/// </summary>
/// <typeparam name="T">Response data type</typeparam>
public class ApiResponse<T>
{
    /// <summary>
    /// Response data (null for error responses)
    /// </summary>
    public T? Data { get; set; }
    
    /// <summary>
    /// Response metadata (pagination, counts, etc.)
    /// </summary>
    public ResponseMeta? Meta { get; set; }
    
    /// <summary>
    /// HATEOAS links
    /// </summary>
    public Dictionary<string, string>? Links { get; set; }
    
    /// <summary>
    /// Error information (null for successful responses)
    /// </summary>
    public ErrorResponse? Error { get; set; }
    
    /// <summary>
    /// Create successful response
    /// </summary>
    public static ApiResponse<T> Success(T data, ResponseMeta? meta = null, Dictionary<string, string>? links = null)
    {
        return new ApiResponse<T>
        {
            Data = data,
            Meta = meta,
            Links = links
        };
    }
    
    /// <summary>
    /// Create error response
    /// </summary>
    public static ApiResponse<T> Failure(ErrorResponse error)
    {
        return new ApiResponse<T>
        {
            Error = error
        };
    }
}

/// <summary>
/// Response metadata for pagination and additional info
/// </summary>
public class ResponseMeta
{
    /// <summary>
    /// Current page number
    /// </summary>
    public int? Page { get; set; }
    
    /// <summary>
    /// Items per page
    /// </summary>
    public int? Limit { get; set; }
    
    /// <summary>
    /// Total number of items
    /// </summary>
    public int? Total { get; set; }
    
    /// <summary>
    /// Total number of pages
    /// </summary>
    public int? TotalPages { get; set; }
    
    /// <summary>
    /// Is there a next page
    /// </summary>
    public bool? HasNext { get; set; }
    
    /// <summary>
    /// Is there a previous page
    /// </summary>
    public bool? HasPrev { get; set; }
    
    /// <summary>
    /// Timestamp when response was generated
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Error response information
/// </summary>
public class ErrorResponse
{
    /// <summary>
    /// HTTP status code
    /// </summary>
    public int StatusCode { get; set; }
    
    /// <summary>
    /// Error code identifier
    /// </summary>
    public string Code { get; set; } = string.Empty;
    
    /// <summary>
    /// Error message
    /// </summary>
    public string Message { get; set; } = string.Empty;
    
    /// <summary>
    /// Detailed error information
    /// </summary>
    public string? Details { get; set; }
    
    /// <summary>
    /// Field validation errors
    /// </summary>
    public Dictionary<string, string[]>? FieldErrors { get; set; }
    
    /// <summary>
    /// Request ID for tracking
    /// </summary>
    public string? RequestId { get; set; }
    
    /// <summary>
    /// Timestamp of error
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Pagination request parameters
/// </summary>
public class PaginatedRequest
{
    /// <summary>
    /// Page number (1-based)
    /// </summary>
    public int Page { get; set; } = 1;
    
    /// <summary>
    /// Items per page
    /// </summary>
    public int Limit { get; set; } = 20;
    
    /// <summary>
    /// Validate and ensure valid ranges
    /// </summary>
    public void Validate()
    {
        if (Page < 1) Page = 1;
        if (Limit < 1) Limit = 1;
        if (Limit > 100) Limit = 100; // Max 100 items per page
    }
}

/// <summary>
/// Paginated response
/// </summary>
/// <typeparam name="T">Item type</typeparam>
public class PaginatedResponse<T>
{
    /// <summary>
    /// Items in current page
    /// </summary>
    public IEnumerable<T> Items { get; set; } = [];
    
    /// <summary>
    /// Total number of items
    /// </summary>
    public int Total { get; set; }
    
    /// <summary>
    /// Current page
    /// </summary>
    public int Page { get; set; }
    
    /// <summary>
    /// Items per page
    /// </summary>
    public int Limit { get; set; }
    
    /// <summary>
    /// Total pages
    /// </summary>
    public int TotalPages => (Total + Limit - 1) / Limit;
    
    /// <summary>
    /// Has next page
    /// </summary>
    public bool HasNext => Page < TotalPages;
    
    /// <summary>
    /// Has previous page
    /// </summary>
    public bool HasPrev => Page > 1;
}
