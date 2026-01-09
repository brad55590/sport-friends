using MediatR;
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
public class RegisterUserHandler(IAuthRepository authRepository, IJwtTokenService tokenService)
    : IRequestHandler<RegisterUserCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        // Check if email already exists
        if (await authRepository.EmailExistsAsync(request.Email))
            throw new ConflictException("Email already registered", "DUPLICATE_EMAIL");

        // Validate password
        ValidatePassword(request.Password);
        
        // Create user
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Status = "active",
            Role = "user"
        };
        
        var createdUser = await authRepository.CreateUserAsync(user);
        
        // Create profile
        var profile = new Profile
        {
            UserId = createdUser.Id,
            FirstName = request.FirstName,
            LastName = request.LastName,
            DisplayName = $"{request.FirstName} {request.LastName}"
        };
        
        // TODO: Create profile in database (will move to profile repository)
        
        // Generate tokens
        var accessToken = tokenService.GenerateAccessToken(createdUser);
        var refreshToken = tokenService.GenerateRefreshToken();
        
        // TODO: Store refresh token in database
        
        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            UserId = createdUser.Id,
            Email = createdUser.Email
        };
    }
    
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
}

/// <summary>
/// Handler for user login
/// </summary>
public class LoginUserHandler(IAuthRepository authRepository, IJwtTokenService tokenService)
    : IRequestHandler<LoginUserCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        // Get user by email
        var user = await authRepository.GetUserByEmailAsync(request.Email);
        if (user == null)
            throw new UnauthorizedException("Invalid email or password");
        
        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedException("Invalid email or password");
        
        // Check if account is active
        if (user.Status != "active")
            throw new UnauthorizedException("Account is not active");
        
        // Update last login
        await authRepository.UpdateLastLoginAsync(user.Id);
        
        // Generate tokens
        var accessToken = tokenService.GenerateAccessToken(user);
        var refreshToken = tokenService.GenerateRefreshToken();
        
        // TODO: Store refresh token in database
        
        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            UserId = user.Id,
            Email = user.Email
        };
    }
}

/// <summary>
/// Handler for refreshing access token
/// </summary>
public class RefreshTokenHandler(IAuthRepository authRepository, IJwtTokenService tokenService)
    : IRequestHandler<RefreshTokenCommand, AuthResponse>
{
    private readonly IAuthRepository _authRepository = authRepository;
    private readonly IJwtTokenService _tokenService = tokenService;

    public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // TODO: Validate refresh token against database
        
        // For now, throw not implemented
        throw new NotImplementedException("Refresh token validation not yet implemented");
    }
}
