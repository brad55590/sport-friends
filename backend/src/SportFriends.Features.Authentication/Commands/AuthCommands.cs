using FastEndpoints;
using SportFriends.Features.Authentication.DTOs;

namespace SportFriends.Features.Authentication.Commands;

/// <summary>
/// Register new user command
/// </summary>
public class RegisterUserCommand : ICommand<AuthResponse>
{
    /// <summary>
    /// User email
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// User password
    /// </summary>
    public required string Password { get; set; }

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
/// Login user command
/// </summary>
public class LoginUserCommand : ICommand<AuthResponse>
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
/// Refresh access token command
/// </summary>
public class RefreshTokenCommand : ICommand<AuthResponse>
{
    /// <summary>
    /// Refresh token
    /// </summary>
    public required string RefreshToken { get; set; }
}
