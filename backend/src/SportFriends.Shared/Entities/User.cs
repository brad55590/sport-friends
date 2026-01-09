namespace SportFriends.Shared.Entities;

/// <summary>
/// User entity representing a system user account
/// </summary>
public class User : Entity
{
    /// <summary>
    /// User email address (unique)
    /// </summary>
    public required string Email { get; set; }
    
    /// <summary>
    /// Is email verified
    /// </summary>
    public bool EmailVerified { get; set; } = false;
    
    /// <summary>
    /// Email verification token
    /// </summary>
    public string? EmailVerificationToken { get; set; }
    
    /// <summary>
    /// When email verification token expires
    /// </summary>
    public DateTime? EmailVerificationExpires { get; set; }
    
    /// <summary>
    /// Bcrypt hashed password
    /// </summary>
    public required string PasswordHash { get; set; }
    
    /// <summary>
    /// Phone number (optional)
    /// </summary>
    public string? Phone { get; set; }
    
    /// <summary>
    /// Is phone verified
    /// </summary>
    public bool PhoneVerified { get; set; } = false;
    
    /// <summary>
    /// Account status: active, suspended, deleted
    /// </summary>
    public string Status { get; set; } = "active";
    
    /// <summary>
    /// User role: user, moderator, admin
    /// </summary>
    public string Role { get; set; } = "user";
    
    /// <summary>
    /// Timestamp of last login
    /// </summary>
    public DateTime? LastLoginAt { get; set; }
}

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
