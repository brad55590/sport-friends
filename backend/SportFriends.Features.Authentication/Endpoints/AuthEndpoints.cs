using FastEndpoints;
using MediatR;
using SportFriends.Features.Authentication.Commands;
using SportFriends.Features.Authentication.DTOs;
using SportFriends.Shared.DTOs;

namespace SportFriends.Features.Authentication.Endpoints;

/// <summary>
/// POST /auth/register - Register new user
/// </summary>
public class RegisterEndpoint : Endpoint<RegisterRequest, ApiResponse<AuthResponse>>
{
    private readonly IMediator _mediator;
    
    public RegisterEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    public override void Configure()
    {
        Post("/auth/register");
        AllowAnonymous();
    }
    
    public override async Task HandleAsync(RegisterRequest req, CancellationToken ct)
    {
        var command = new RegisterUserCommand
        {
            Email = req.Email,
            Password = req.Password,
            FirstName = req.FirstName,
            LastName = req.LastName
        };
        
        var result = await _mediator.Send(command, ct);
        
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
        
        await SendCreatedAtAsync("/api/v1/auth/me", response, cancellation: ct);
    }
}

/// <summary>
/// POST /auth/login - User login
/// </summary>
public class LoginEndpoint : Endpoint<LoginRequest, ApiResponse<AuthResponse>>
{
    private readonly IMediator _mediator;
    
    public LoginEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    public override void Configure()
    {
        Post("/auth/login");
        AllowAnonymous();
    }
    
    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        var command = new LoginUserCommand
        {
            Email = req.Email,
            Password = req.Password
        };
        
        var result = await _mediator.Send(command, ct);
        
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
        
        await SendOkAsync(response, cancellation: ct);
    }
}

/// <summary>
/// POST /auth/refresh - Refresh access token
/// </summary>
public class RefreshTokenEndpoint : Endpoint<RefreshTokenRequest, ApiResponse<AuthResponse>>
{
    private readonly IMediator _mediator;
    
    public RefreshTokenEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    public override void Configure()
    {
        Post("/auth/refresh");
        AllowAnonymous();
    }
    
    public override async Task HandleAsync(RefreshTokenRequest req, CancellationToken ct)
    {
        var command = new RefreshTokenCommand
        {
            RefreshToken = req.RefreshToken
        };
        
        var result = await _mediator.Send(command, ct);
        
        var response = ApiResponse<AuthResponse>.Success(
            data: result,
            meta: new ResponseMeta
            {
                Timestamp = DateTime.UtcNow
            }
        );
        
        await SendOkAsync(response, cancellation: ct);
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
        RequireAuthorization();
    }
    
    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var userId = User.FindFirst("sub")?.Value;
        var email = User.FindFirst("email")?.Value;
        var role = User.FindFirst("role")?.Value;
        
        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(email))
        {
            await SendUnauthorizedAsync(ct);
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
        
        await SendOkAsync(response, cancellation: ct);
    }
}
