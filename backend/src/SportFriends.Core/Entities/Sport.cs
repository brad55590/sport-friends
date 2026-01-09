namespace SportFriends.Core.Entities;

/// <summary>
/// Sport entity representing a sport type on the platform
/// </summary>
public class Sport : Entity
{
    /// <summary>
    /// Sport name (unique)
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// URL-friendly slug (unique)
    /// </summary>
    public required string Slug { get; set; }

    /// <summary>
    /// Sport description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Icon URL
    /// </summary>
    public string? IconUrl { get; set; }

    /// <summary>
    /// Cover image URL
    /// </summary>
    public string? CoverImageUrl { get; set; }

    /// <summary>
    /// Is sport active on platform
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Display order in UI
    /// </summary>
    public int DisplayOrder { get; set; } = 0;

    /// <summary>
    /// Total users interested in this sport
    /// </summary>
    public int TotalUsers { get; set; } = 0;

    /// <summary>
    /// Total events for this sport
    /// </summary>
    public int TotalEvents { get; set; } = 0;
}

/// <summary>
/// UserSport entity for user's sport preferences and skills
/// </summary>
public class UserSport : Entity
{
    /// <summary>
    /// Reference to user
    /// </summary>
    public required Guid UserId { get; set; }

    /// <summary>
    /// Reference to sport
    /// </summary>
    public required Guid SportId { get; set; }

    /// <summary>
    /// Skill level: beginner, intermediate, advanced, expert
    /// </summary>
    public string? SkillLevel { get; set; }

    /// <summary>
    /// Years of experience
    /// </summary>
    public int? YearsExperience { get; set; }

    /// <summary>
    /// Playing frequency: daily, weekly, monthly, occasionally
    /// </summary>
    public string? Frequency { get; set; }

    /// <summary>
    /// Preferred days to play (array: ['monday', 'wednesday', 'saturday'])
    /// </summary>
    public string[]? PreferredDays { get; set; }

    /// <summary>
    /// Preferred times to play (array: ['morning', 'afternoon', 'evening'])
    /// </summary>
    public string[]? PreferredTimes { get; set; }

    /// <summary>
    /// Additional notes about sport participation
    /// </summary>
    public string? Notes { get; set; }
}
