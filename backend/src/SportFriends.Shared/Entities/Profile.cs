namespace SportFriends.Shared.Entities;

/// <summary>
/// Profile entity for user profile information
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
    /// Display name
    /// </summary>
    public string? DisplayName { get; set; }

    /// <summary>
    /// Bio/about me
    /// </summary>
    public string? Bio { get; set; }

    /// <summary>
    /// Avatar URL (Azure Blob Storage)
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

    // Location
    public decimal? LocationLat { get; set; }
    public decimal? LocationLng { get; set; }
    public string? LocationCity { get; set; }
    public string? LocationState { get; set; }
    public string? LocationCountry { get; set; }
    public string? LocationDisplay { get; set; }

    // Privacy
    public bool PrivacyShowLocation { get; set; } = true;
    public bool PrivacyShowAge { get; set; } = true;
    public string PrivacyProfileVisibility { get; set; } = "public";
    public string PrivacyLastSeen { get; set; } = "everyone";

    // Verification
    public bool IsVerified { get; set; } = false;
    public string? VerificationDocumentUrl { get; set; }
    public DateTime? VerifiedAt { get; set; }

    // Activity
    public DateTime LastActiveAt { get; set; } = DateTime.UtcNow;
    public int ProfileCompletionPercentage { get; set; } = 0;
}
