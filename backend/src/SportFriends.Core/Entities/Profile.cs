namespace SportFriends.Core.Entities;

/// <summary>
/// Profile entity containing user profile information
/// </summary>
public class Profile : Entity
{
    /// <summary>
    /// Reference to user
    /// </summary>
    public required Guid UserId { get; set; }

    /// <summary>
    /// First name
    /// </summary>
    public required string FirstName { get; set; }

    /// <summary>
    /// Last name
    /// </summary>
    public required string LastName { get; set; }

    /// <summary>
    /// Display name (public profile name)
    /// </summary>
    public string? DisplayName { get; set; }

    /// <summary>
    /// User biography
    /// </summary>
    public string? Bio { get; set; }

    /// <summary>
    /// Avatar image URL (Azure Blob Storage)
    /// </summary>
    public string? AvatarUrl { get; set; }

    /// <summary>
    /// Cover image URL (Azure Blob Storage)
    /// </summary>
    public string? CoverImageUrl { get; set; }

    /// <summary>
    /// Date of birth
    /// </summary>
    public DateTime? DateOfBirth { get; set; }

    /// <summary>
    /// Gender
    /// </summary>
    public string? Gender { get; set; }

    // Location fields

    /// <summary>
    /// Latitude
    /// </summary>
    public decimal? LocationLat { get; set; }

    /// <summary>
    /// Longitude
    /// </summary>
    public decimal? LocationLng { get; set; }

    /// <summary>
    /// City
    /// </summary>
    public string? LocationCity { get; set; }

    /// <summary>
    /// State/Province
    /// </summary>
    public string? LocationState { get; set; }

    /// <summary>
    /// Country
    /// </summary>
    public string? LocationCountry { get; set; }

    /// <summary>
    /// Display location string
    /// </summary>
    public string? LocationDisplay { get; set; }

    // Privacy settings

    /// <summary>
    /// Show location on profile
    /// </summary>
    public bool PrivacyShowLocation { get; set; } = true;

    /// <summary>
    /// Show age on profile
    /// </summary>
    public bool PrivacyShowAge { get; set; } = true;

    /// <summary>
    /// Profile visibility: public, friends, private
    /// </summary>
    public string PrivacyProfileVisibility { get; set; } = "public";

    /// <summary>
    /// Last seen visibility: everyone, friends, nobody
    /// </summary>
    public string PrivacyLastSeen { get; set; } = "everyone";

    // Verification

    /// <summary>
    /// Is profile verified
    /// </summary>
    public bool IsVerified { get; set; } = false;

    /// <summary>
    /// Verification document URL
    /// </summary>
    public string? VerificationDocumentUrl { get; set; }

    /// <summary>
    /// Timestamp of verification
    /// </summary>
    public DateTime? VerifiedAt { get; set; }

    // Activity tracking

    /// <summary>
    /// Last active timestamp
    /// </summary>
    public DateTime LastActiveAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Profile completion percentage (0-100)
    /// </summary>
    public int ProfileCompletionPercentage { get; set; } = 0;
}
