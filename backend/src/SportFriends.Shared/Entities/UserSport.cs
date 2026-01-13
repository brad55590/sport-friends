namespace SportFriends.Shared.Entities;

/// <summary>
/// UserSport join entity linking users to sports
/// </summary>
public class UserSport : Entity
{
    /// <summary>
    /// User ID (foreign key)
    /// </summary>
    public required Guid UserId { get; set; }

    /// <summary>
    /// Sport ID (foreign key)
    /// </summary>
    public required Guid SportId { get; set; }

    /// <summary>
    /// Skill level (beginner, intermediate, advanced, expert)
    /// </summary>
    public string? SkillLevel { get; set; }

    /// <summary>
    /// Years of experience with this sport
    /// </summary>
    public int? YearsExperience { get; set; }

    /// <summary>
    /// Frequency of participation (daily, weekly, monthly, occasionally)
    /// </summary>
    public string? Frequency { get; set; }

    /// <summary>
    /// Preferred days for playing
    /// </summary>
    public string? PreferredDays { get; set; }

    /// <summary>
    /// Preferred times for playing
    /// </summary>
    public string? PreferredTimes { get; set; }

    /// <summary>
    /// Additional notes about this sport
    /// </summary>
    public string? Notes { get; set; }
}
