namespace SportFriends.Features.Authentication.DTOs;

/// <summary>
/// Register user request
/// </summary>
public class RegisterRequest
{
    /// <summary>
    /// User email
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Password (min 8 chars, 1 uppercase, 1 number, 1 special)
    /// </summary>
    public required string Password { get; set; }

    /// <summary>
    /// Password confirmation
    /// </summary>
    public required string ConfirmPassword { get; set; }

    /// <summary>
    /// First name
    /// </summary>
    public required string FirstName { get; set; }

    /// <summary>
    /// Last name
    /// </summary>
    public required string LastName { get; set; }
}

/// <summary>
/// Login request
/// </summary>
public class LoginRequest
{
    /// <summary>
    /// User email
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// User password
    /// </summary>
    public required string Password { get; set; }
}

/// <summary>
/// Refresh token request
/// </summary>
public class RefreshTokenRequest
{
    /// <summary>
    /// Refresh token from login response
    /// </summary>
    public required string RefreshToken { get; set; }
}

/// <summary>
/// Authentication response
/// </summary>
public class AuthResponse
{
    /// <summary>
    /// JWT access token
    /// </summary>
    public required string AccessToken { get; set; }

    /// <summary>
    /// Refresh token for obtaining new access token
    /// </summary>
    public required string RefreshToken { get; set; }

    /// <summary>
    /// Token type (Bearer)
    /// </summary>
    public string TokenType { get; set; } = "Bearer";

    /// <summary>
    /// Access token expiration in seconds
    /// </summary>
    public int ExpiresIn { get; set; } = 3600;

    /// <summary>
    /// User ID
    /// </summary>
    public required Guid UserId { get; set; }

    /// <summary>
    /// User email
    /// </summary>
    public required string Email { get; set; }
}

/// <summary>
/// Current user info response
/// </summary>
public class CurrentUserResponse
{
    /// <summary>
    /// User ID
    /// </summary>
    public required Guid Id { get; set; }

    /// <summary>
    /// User email
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// User role
    /// </summary>
    public required string Role { get; set; }
}
