namespace SportFriends.Shared.DTOs;

/// <summary>
/// DTO for sport response with details
/// </summary>
public class SportsListResponse
{
    /// <summary>
    /// Sport ID
    /// </summary>
    public required Guid Id { get; set; }

    /// <summary>
    /// Sport name
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Sport slug
    /// </summary>
    public string? Slug { get; set; }

    /// <summary>
    /// Sport description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Icon URL
    /// </summary>
    public string? IconUrl { get; set; }

    /// <summary>
    /// Is active
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Display order
    /// </summary>
    public int DisplayOrder { get; set; }
}
