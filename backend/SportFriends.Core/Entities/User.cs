using System;

namespace SportFriends.Core.Entities;

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
