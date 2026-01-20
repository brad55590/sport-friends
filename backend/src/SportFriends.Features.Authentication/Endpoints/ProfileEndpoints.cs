using FastEndpoints;
using Microsoft.AspNetCore.Http;
using SportFriends.Features.Authentication.Repositories;
using SportFriends.Shared.DTOs;
using SportFriends.Shared.Entities;
using System.Security.Claims;

namespace SportFriends.Features.Authentication.Endpoints;

/// <summary>
/// GET /users/profile - Get current user's profile
/// </summary>
public class GetProfileEndpoint : Endpoint<EmptyRequest, ApiResponse<ProfileResponse>>
{
    private readonly IProfileRepository _profileRepository;

    public GetProfileEndpoint(IProfileRepository profileRepository)
    {
        _profileRepository = profileRepository;
    }

    public override void Configure()
    {
        Get("/users/profile");
        // Require authentication but not a specific role
        // This allows both "user" and "Authenticated" roles
    }

    public override async Task HandleAsync(EmptyRequest _, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        var userId = userIdClaim;
        Console.WriteLine($"[UpdateProfile] User ID from claims: {userId}");
        if (userId == null || !Guid.TryParse(userId, out var userIdGuid))
        {
            await Send.UnauthorizedAsync(cancellationToken);
            return;
        }

        var profile = await _profileRepository.GetProfileWithDetailsAsync(userIdGuid);

        if (profile == null)
        {
            await Send.NotFoundAsync(cancellationToken);
            return;
        }

        var response = ApiResponse<ProfileResponse>.Success(
            data: profile,
            meta: new ResponseMeta { Timestamp = DateTime.UtcNow },
            links: new Dictionary<string, string> { { "self", "/api/v1/users/profile" } }
        );

        await Send.OkAsync(response);
    }
}

/// <summary>
/// PUT /users/profile - Update current user's profile
/// </summary>
public class UpdateProfileEndpoint : Endpoint<UpdateProfileRequest, ApiResponse<ProfileResponse>>
{
    private readonly IProfileRepository _profileRepository;
    private readonly ISportsRepository _sportsRepository;
    private readonly IAuthRepository _authRepository;

    public UpdateProfileEndpoint(
        IProfileRepository profileRepository,
        ISportsRepository sportsRepository,
        IAuthRepository authRepository)
    {
        _profileRepository = profileRepository;
        _sportsRepository = sportsRepository;
        _authRepository = authRepository;
    }

    public override void Configure()
    {
        Put("/users/profile");
        // Require authentication but not a specific role
        // This allows both "user" and "Authenticated" roles
    }

    public override async Task HandleAsync(UpdateProfileRequest request, CancellationToken cancellationToken)
    {
        // Log authentication details for debugging
        var authHeader = HttpContext.Request.Headers["Authorization"].ToString();
        Console.WriteLine($"[UpdateProfile] Authorization Header: {authHeader}");
        Console.WriteLine($"[UpdateProfile] User.Identity.IsAuthenticated: {User.Identity?.IsAuthenticated}");
        Console.WriteLine($"[UpdateProfile] User Claims Count: {User.Claims.Count()}");
        foreach (var claim in User.Claims)
        {
            Console.WriteLine($"[UpdateProfile] Claim: {claim.Type} = {claim.Value}");
        }
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        Console.WriteLine($"[UpdateProfile] User ID from claims: {userId}");
        
        if (userId == null || !Guid.TryParse(userId, out var userIdGuid))
        {
            Console.WriteLine($"[UpdateProfile] UNAUTHORIZED - userId is null or invalid GUID");
            await Send.UnauthorizedAsync(cancellationToken);
            return;
        }

        // Get existing profile
        var existingProfile = await _profileRepository.GetProfileByUserIdAsync(userIdGuid);
        if (existingProfile == null)
        {
            // Create profile if it doesn't exist
            existingProfile = new Profile
            {
                Id = Guid.NewGuid(),
                UserId = userIdGuid,
                FirstName = request.FirstName ?? string.Empty,
                LastName = request.LastName ?? string.Empty,
                Bio = request.Bio,
                AvatarUrl = request.Avatar,
                LocationDisplay = request.Area,
                LocationLat = request.Latitude,
                LocationLng = request.Longitude,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _profileRepository.CreateProfileAsync(existingProfile);
        }
        else
        {
            // Update profile
            existingProfile.FirstName = request.FirstName ?? existingProfile.FirstName;
            existingProfile.LastName = request.LastName ?? existingProfile.LastName;
            existingProfile.Bio = request.Bio ?? existingProfile.Bio;
            existingProfile.AvatarUrl = request.Avatar ?? existingProfile.AvatarUrl;
            existingProfile.LocationDisplay = request.Area ?? existingProfile.LocationDisplay;
            existingProfile.LocationLat = request.Latitude ?? existingProfile.LocationLat;
            existingProfile.LocationLng = request.Longitude ?? existingProfile.LocationLng;
            existingProfile.UpdatedAt = DateTime.UtcNow;
            await _profileRepository.UpdateProfileAsync(existingProfile);
        }

        // Handle sports
        if (request.Sports != null && request.Sports.Count > 0)
        {
            // Clear existing sports
            await _profileRepository.ClearUserSportsAsync(userIdGuid);

            // Add new sports
            foreach (var sportId in request.Sports)
            {
                if (Guid.TryParse(sportId, out var sportIdGuid))
                {
                    // Verify sport exists
                    var sport = await _sportsRepository.GetSportByIdAsync(sportIdGuid);
                    if (sport != null)
                    {
                        await _profileRepository.AddUserSportAsync(userIdGuid, sportIdGuid);
                    }
                }
            }
        }

        // Get updated profile with details
        var updatedProfile = await _profileRepository.GetProfileWithDetailsAsync(userIdGuid);

        var response = ApiResponse<ProfileResponse>.Success(
            data: updatedProfile!,
            meta: new ResponseMeta { Timestamp = DateTime.UtcNow },
            links: new Dictionary<string, string> { { "self", "/api/v1/users/profile" } }
        );

        await Send.OkAsync(response);
    }
}

/// <summary>
/// POST /users/profile/avatar - Upload profile avatar
/// </summary>
public class UploadAvatarEndpoint : Endpoint<UploadAvatarRequest, ApiResponse<ProfileResponse>>
{
    private readonly IProfileRepository _profileRepository;

    public UploadAvatarEndpoint(IProfileRepository profileRepository)
    {
        _profileRepository = profileRepository;
    }

    public override void Configure()
    {
        Post("/users/profile/avatar");
        // Require authentication but not a specific role
        // This allows both "user" and "Authenticated" roles
        AllowFileUploads();
    }

    public override async Task HandleAsync(UploadAvatarRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        var userId = userIdClaim;
        if (userId == null || !Guid.TryParse(userId, out var userIdGuid))
        {
            await Send.UnauthorizedAsync(cancellationToken);
            return;
        }

        var file = request.File;
        if (file == null || file.Length == 0)
        {
            var errorResponse = ApiResponse<ProfileResponse>.Failure(
                new SportFriends.Shared.DTOs.ErrorResponse
                {
                    StatusCode = 400,
                    Code = "INVALID_FILE",
                    Message = "No file provided"
                }
            );
            
            await Send.OkAsync(errorResponse);
            return;
        }

        // Convert file to base64
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms, cancellationToken);
        var fileBytes = ms.ToArray();
        var base64String = $"data:{file.ContentType};base64,{Convert.ToBase64String(fileBytes)}";

        // Update profile
        var profile = await _profileRepository.GetProfileByUserIdAsync(userIdGuid);
        if (profile == null)
        {
            profile = new Profile
            {
                Id = Guid.NewGuid(),
                UserId = userIdGuid,
                FirstName = string.Empty,
                LastName = string.Empty,
                AvatarUrl = base64String,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _profileRepository.CreateProfileAsync(profile);
        }
        else
        {
            profile.AvatarUrl = base64String;
            profile.UpdatedAt = DateTime.UtcNow;
            await _profileRepository.UpdateProfileAsync(profile);
        }

        var updatedProfile = await _profileRepository.GetProfileWithDetailsAsync(userIdGuid);

        var response = ApiResponse<ProfileResponse>.Success(
            data: updatedProfile!,
            meta: new ResponseMeta { Timestamp = DateTime.UtcNow },
            links: new Dictionary<string, string> { { "self", "/api/v1/users/profile" } }
        );

        await Send.OkAsync(response);
    }
}

/// <summary>
/// Request for uploading avatar
/// </summary>
public class UploadAvatarRequest
{
    /// <summary>
    /// Avatar file
    /// </summary>
    public IFormFile? File { get; set; }
}
