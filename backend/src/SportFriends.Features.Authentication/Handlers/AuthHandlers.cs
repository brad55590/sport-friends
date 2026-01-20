using FastEndpoints;
using SportFriends.Features.Authentication.Commands;
using SportFriends.Features.Authentication.DTOs;
using SportFriends.Features.Authentication.Repositories;
using SportFriends.Features.Authentication.Services;
using SportFriends.Shared.Entities;
using SportFriends.Shared.Exceptions;

namespace SportFriends.Features.Authentication.Handlers;

/// <summary>
/// Handler for registering a new user
/// </summary>
public class RegisterUserHandler(IAuthRepository authRepository, IProfileRepository profileRepository, IJwtTokenService tokenService)
    : ICommandHandler<RegisterUserCommand, AuthResponse>
{
    private static void ValidatePassword(string password)
    {
        var errors = new List<string>();

        if (password.Length < 8)
            errors.Add("Password must be at least 8 characters long");
        if (!password.Any(char.IsUpper))
            errors.Add("Password must contain at least one uppercase letter");
        if (!password.Any(char.IsDigit))
            errors.Add("Password must contain at least one digit");
        if (password.All(char.IsLetterOrDigit))
            errors.Add("Password must contain at least one special character");

        if (errors.Count > 0)
            throw new ValidationException("Password", string.Join("; ", errors));
    }

    public async Task<AuthResponse> ExecuteAsync(RegisterUserCommand command, CancellationToken cancellationToken)
    {
        // Check if email already exists
        if (await authRepository.EmailExistsAsync(command.Email))
            throw new ConflictException("Email already registered", "DUPLICATE_EMAIL");

        // Validate password
        ValidatePassword(command.Password);

        // Create user
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = command.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(command.Password),
            Status = "active",
            Role = "Authenticated"
        };

        var createdUser = await authRepository.CreateUserAsync(user);

        // Create profile
        var profile = new Profile
        {
            Id = Guid.NewGuid(),
            UserId = createdUser.Id,
            FirstName = command.FirstName,
            LastName = command.LastName,
            DisplayName = $"{command.FirstName} {command.LastName}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await profileRepository.CreateProfileAsync(profile);

        // Generate tokens
        var accessToken = tokenService.GenerateAccessToken(createdUser);
        var refreshToken = tokenService.GenerateRefreshToken();

        // TODO: Store refresh token in database

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            UserId = createdUser.Id,
            Email = createdUser.Email,
            FirstName = command.FirstName,
            LastName = command.LastName,
            Username = command.Email.Split('@')[0],
            Sports = []
        };
    }
}

/// <summary>
/// Handler for user login
/// </summary>
public class LoginUserHandler(IAuthRepository authRepository, IProfileRepository profileRepository, IJwtTokenService tokenService)
    : ICommandHandler<LoginUserCommand, AuthResponse>
{
    public async Task<AuthResponse> ExecuteAsync(LoginUserCommand command, CancellationToken cancellationToken)
    {
        // Get user by email
        var user = await authRepository.GetUserByEmailAsync(command.Email);
        if (user == null)
            throw new UnauthorizedException("Invalid email or password");

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(command.Password, user.PasswordHash))
            throw new UnauthorizedException("Invalid email or password");

        // Check if account is active
        if (user.Status != "active")
            throw new UnauthorizedException("Account is not active");

        // Update last login
        await authRepository.UpdateLastLoginAsync(user.Id);

        // Get profile with details (includes sports)
        var profile = await profileRepository.GetProfileWithDetailsAsync(user.Id);

        // Generate tokens
        var accessToken = tokenService.GenerateAccessToken(user);
        var refreshToken = tokenService.GenerateRefreshToken();

        // TODO: Store refresh token in database

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            UserId = user.Id,
            Email = user.Email,
            FirstName = profile?.FirstName,
            LastName = profile?.LastName,
            Username = profile?.Username ?? user.Email.Split('@')[0],
            Bio = profile?.Bio,
            Avatar = profile?.Avatar,
            Area = profile?.Area,
            Latitude = profile?.Latitude,
            Longitude = profile?.Longitude,
            Sports = profile?.Sports ?? []
        };
    }
}

/// <summary>
/// Handler for refreshing access token
/// </summary>
public class RefreshTokenHandler(IAuthRepository authRepository, IJwtTokenService tokenService)
    : ICommandHandler<RefreshTokenCommand, AuthResponse>
{
    private readonly IAuthRepository _authRepository = authRepository;
    private readonly IJwtTokenService _tokenService = tokenService;

    public Task<AuthResponse> ExecuteAsync(RefreshTokenCommand command, CancellationToken cancellationToken)
    {
        // TODO: Validate refresh token against database

        // For now, throw not implemented
        throw new NotImplementedException("Refresh token validation not yet implemented");
    }
}
