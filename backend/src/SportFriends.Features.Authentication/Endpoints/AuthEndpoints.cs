using FastEndpoints;
using SportFriends.Features.Authentication.Commands;
using SportFriends.Features.Authentication.DTOs;
using SportFriends.Shared.DTOs;

namespace SportFriends.Features.Authentication.Endpoints;

/// <summary>
/// POST /auth/register - Register new user
/// </summary>
public class RegisterEndpoint : Endpoint<RegisterRequest, ApiResponse<AuthResponse>>
{
    public override void Configure()
    {
        Post("/auth/register");
        AllowAnonymous();
    }

    public override async Task HandleAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        var result = await new RegisterUserCommand
        {
            Email = request.Email,
            Password = request.Password,
            FirstName = request.FirstName,
            LastName = request.LastName
        }.ExecuteAsync(cancellationToken);

        var response = ApiResponse<AuthResponse>.Success(
            data: result,
            meta: new ResponseMeta
            {
                Timestamp = DateTime.UtcNow
            },
            links: new Dictionary<string, string>
            {
                { "self", "/api/v1/auth/register" }
            }
        );

        await Send.CreatedAtAsync<GetCurrentUserEndpoint>(null, response, cancellation: cancellationToken);
    }
}

/// <summary>
/// POST /auth/login - User login
/// </summary>
public class LoginEndpoint : Endpoint<LoginRequest, ApiResponse<AuthResponse>>
{
    public override void Configure()
    {
        Post("/auth/login");
        AllowAnonymous();
    }

    public override async Task HandleAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await new LoginUserCommand
        {
            Email = request.Email,
            Password = request.Password
        }.ExecuteAsync(cancellationToken);

        var response = ApiResponse<AuthResponse>.Success(
            data: result,
            meta: new ResponseMeta
            {
                Timestamp = DateTime.UtcNow
            },
            links: new Dictionary<string, string>
            {
                { "self", "/api/v1/auth/login" }
            }
        );

        await Send.OkAsync(response, cancellation: cancellationToken);
    }
}

/// <summary>
/// POST /auth/refresh - Refresh access token
/// </summary>
public class RefreshTokenEndpoint : Endpoint<RefreshTokenRequest, ApiResponse<AuthResponse>>
{
    public override void Configure()
    {
        Post("/auth/refresh");
        AllowAnonymous();
    }

    public override async Task HandleAsync(RefreshTokenRequest request, CancellationToken cancellationToken)
    {
        var result = await new RefreshTokenCommand
        {
            RefreshToken = request.RefreshToken
        }.ExecuteAsync(cancellationToken);

        var response = ApiResponse<AuthResponse>.Success(
            data: result,
            meta: new ResponseMeta
            {
                Timestamp = DateTime.UtcNow
            }
        );

        await Send.OkAsync(response, cancellation: cancellationToken);
    }
}

/// <summary>
/// GET /auth/me - Get current user info (requires authentication)
/// </summary>
public class GetCurrentUserEndpoint : Endpoint<EmptyRequest, ApiResponse<CurrentUserResponse>>
{
    public override void Configure()
    {
        Get("/auth/me");
        // Policies("Authenticated");
        Roles("Authenticated");
    }

    public override async Task HandleAsync(EmptyRequest request, CancellationToken cancellationToken)
    {
        var userId = User.FindFirst("sub")?.Value;
        var email = User.FindFirst("email")?.Value;
        var role = User.FindFirst("role")?.Value;

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(email))
        {
            await Send.UnauthorizedAsync(cancellationToken);
            return;
        }

        var response = ApiResponse<CurrentUserResponse>.Success(
            data: new CurrentUserResponse
            {
                Id = Guid.Parse(userId),
                Email = email,
                Role = role ?? "user"
            },
            links: new Dictionary<string, string>
            {
                { "self", "/api/v1/auth/me" }
            }
        );

        await Send.OkAsync(response, cancellation: cancellationToken);
    }
}
