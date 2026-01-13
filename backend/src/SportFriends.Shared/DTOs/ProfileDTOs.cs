namespace SportFriends.Shared.DTOs;

/// <summary>
/// DTO for creating/updating a profile
/// </summary>
public class UpdateProfileRequest
{
    /// <summary>
    /// First name
    /// </summary>
    public string? FirstName { get; set; }

    /// <summary>
    /// Last name
    /// </summary>
    public string? LastName { get; set; }

    /// <summary>
    /// Email address
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Username
    /// </summary>
    public string? Username { get; set; }

    /// <summary>
    /// User bio/about
    /// </summary>
    public string? Bio { get; set; }

    /// <summary>
    /// Avatar URL or base64 data URL
    /// </summary>
    public string? Avatar { get; set; }

    /// <summary>
    /// Location area/display name
    /// </summary>
    public string? Area { get; set; }

    /// <summary>
    /// Location latitude
    /// </summary>
    public decimal? Latitude { get; set; }

    /// <summary>
    /// Location longitude
    /// </summary>
    public decimal? Longitude { get; set; }

    /// <summary>
    /// Selected sports (list of sport IDs)
    /// </summary>
    public List<string> Sports { get; set; } = new();
}

/// <summary>
/// DTO for returning profile data
/// </summary>
public class ProfileResponse
{
    /// <summary>
    /// Profile ID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User ID
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// First name
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Last name
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Email
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Username
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Bio
    /// </summary>
    public string? Bio { get; set; }

    /// <summary>
    /// Avatar URL
    /// </summary>
    public string? Avatar { get; set; }

    /// <summary>
    /// Location display string
    /// </summary>
    public string? Area { get; set; }

    /// <summary>
    /// Location latitude
    /// </summary>
    public decimal? Latitude { get; set; }

    /// <summary>
    /// Location longitude
    /// </summary>
    public decimal? Longitude { get; set; }

    /// <summary>
    /// User's selected sports
    /// </summary>
    public List<SportResponse> Sports { get; set; } = new();

    /// <summary>
    /// Profile created date
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Profile updated date
    /// </summary>
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// DTO for sport response
/// </summary>
public class SportResponse
{
    /// <summary>
    /// Sport ID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Sport name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Sport slug
    /// </summary>
    public string? Slug { get; set; }
}
