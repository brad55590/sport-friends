namespace SportFriends.Shared.Entities;

/// <summary>
/// Sport entity representing available sports
/// </summary>
public class Sport : Entity
{
    /// <summary>
    /// Sport name
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Sport slug for URLs
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
    /// Is this sport active
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Display order for sorting
    /// </summary>
    public int DisplayOrder { get; set; } = 0;
}
