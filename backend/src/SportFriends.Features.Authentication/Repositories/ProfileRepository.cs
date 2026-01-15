using Npgsql;
using Dapper;
using SportFriends.Shared.Entities;
using SportFriends.Shared.DTOs;

namespace SportFriends.Features.Authentication.Repositories;

/// <summary>
/// Profile repository interface for profile operations
/// </summary>
public interface IProfileRepository
{
    /// <summary>
    /// Get profile by user ID
    /// </summary>
    Task<Profile?> GetProfileByUserIdAsync(Guid userId);

    /// <summary>
    /// Create a new profile
    /// </summary>
    Task<Profile> CreateProfileAsync(Profile profile);

    /// <summary>
    /// Update profile
    /// </summary>
    Task<Profile> UpdateProfileAsync(Profile profile);

    /// <summary>
    /// Add sport to user
    /// </summary>
    Task AddUserSportAsync(Guid userId, Guid sportId);

    /// <summary>
    /// Remove sport from user
    /// </summary>
    Task RemoveUserSportAsync(Guid userId, Guid sportId);

    /// <summary>
    /// Get user's sports
    /// </summary>
    Task<IEnumerable<Sport>> GetUserSportsAsync(Guid userId);

    /// <summary>
    /// Clear all user sports
    /// </summary>
    Task ClearUserSportsAsync(Guid userId);

    /// <summary>
    /// Get profile with sports and user info
    /// </summary>
    Task<ProfileResponse?> GetProfileWithDetailsAsync(Guid userId);
}

/// <summary>
/// Profile repository implementation using Dapper
/// </summary>
public class ProfileRepository(string connectionString) : IProfileRepository
{
    public async Task<Profile?> GetProfileByUserIdAsync(Guid userId)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = """
                           SELECT 
                               id AS Id,
                               user_id AS UserId,
                               first_name AS FirstName,
                               last_name AS LastName,
                               display_name AS DisplayName,
                               bio AS Bio,
                               avatar_url AS AvatarUrl,
                               cover_image_url AS CoverImageUrl,
                               date_of_birth AS DateOfBirth,
                               gender AS Gender,
                               location_lat AS LocationLat,
                               location_lng AS LocationLng,
                               location_city AS LocationCity,
                               location_state AS LocationState,
                               location_country AS LocationCountry,
                               location_display AS LocationDisplay,
                               privacy_show_location AS PrivacyShowLocation,
                               privacy_show_age AS PrivacyShowAge,
                               privacy_profile_visibility AS PrivacyProfileVisibility,
                               privacy_last_seen AS PrivacyLastSeen,
                               is_verified AS IsVerified,
                               verification_document_url AS VerificationDocumentUrl,
                               verified_at AS VerifiedAt,
                               last_active_at AS LastActiveAt,
                               profile_completion_percentage AS ProfileCompletionPercentage,
                               created_at AS CreatedAt,
                               updated_at AS UpdatedAt
                           FROM profiles
                           WHERE user_id = @UserId
                           LIMIT 1
                           """;

        var profile = await connection.QuerySingleOrDefaultAsync<Profile>(sql, new { UserId = userId });
        return profile;
    }

    public async Task<Profile> CreateProfileAsync(Profile profile)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = """
                           INSERT INTO profiles
                               (
                                 id,
                                 user_id,
                                 first_name,
                                 last_name,
                                 display_name,
                                 bio,
                                 avatar_url,
                                 cover_image_url,
                                 date_of_birth,
                                 gender,
                                 location_lat,
                                 location_lng,
                                 location_city,
                                 location_state,
                                 location_country,
                                 location_display,
                                 privacy_show_location,
                                 privacy_show_age,
                                 privacy_profile_visibility,
                                 privacy_last_seen,
                                 is_verified,
                                 verification_document_url,
                                 verified_at,
                                 last_active_at,
                                 profile_completion_percentage,
                                 created_at,
                                 updated_at
                               )
                           VALUES
                               (
                                 @Id,
                                 @UserId,
                                 @FirstName,
                                 @LastName,
                                 @DisplayName,
                                 @Bio,
                                 @AvatarUrl,
                                 @CoverImageUrl,
                                 @DateOfBirth,
                                 @Gender,
                                 @LocationLat,
                                 @LocationLng,
                                 @LocationCity,
                                 @LocationState,
                                 @LocationCountry,
                                 @LocationDisplay,
                                 @PrivacyShowLocation,
                                 @PrivacyShowAge,
                                 @PrivacyProfileVisibility,
                                 @PrivacyLastSeen,
                                 @IsVerified,
                                 @VerificationDocumentUrl,
                                 @VerifiedAt,
                                 @LastActiveAt,
                                 @ProfileCompletionPercentage,
                                 @CreatedAt,
                                 @UpdatedAt
                               )
                           RETURNING 
                               id AS Id,
                               user_id AS UserId,
                               first_name AS FirstName,
                               last_name AS LastName,
                               display_name AS DisplayName,
                               bio AS Bio,
                               avatar_url AS AvatarUrl,
                               cover_image_url AS CoverImageUrl,
                               date_of_birth AS DateOfBirth,
                               gender AS Gender,
                               location_lat AS LocationLat,
                               location_lng AS LocationLng,
                               location_city AS LocationCity,
                               location_state AS LocationState,
                               location_country AS LocationCountry,
                               location_display AS LocationDisplay,
                               privacy_show_location AS PrivacyShowLocation,
                               privacy_show_age AS PrivacyShowAge,
                               privacy_profile_visibility AS PrivacyProfileVisibility,
                               privacy_last_seen AS PrivacyLastSeen,
                               is_verified AS IsVerified,
                               verification_document_url AS VerificationDocumentUrl,
                               verified_at AS VerifiedAt,
                               last_active_at AS LastActiveAt,
                               profile_completion_percentage AS ProfileCompletionPercentage,
                               created_at AS CreatedAt,
                               updated_at AS UpdatedAt
                           """;

        var result = await connection.QuerySingleAsync<Profile>(sql, new
        {
            profile.Id,
            profile.UserId,
            profile.FirstName,
            profile.LastName,
            profile.DisplayName,
            profile.Bio,
            profile.AvatarUrl,
            profile.CoverImageUrl,
            profile.DateOfBirth,
            profile.Gender,
            profile.LocationLat,
            profile.LocationLng,
            profile.LocationCity,
            profile.LocationState,
            profile.LocationCountry,
            profile.LocationDisplay,
            profile.PrivacyShowLocation,
            profile.PrivacyShowAge,
            profile.PrivacyProfileVisibility,
            profile.PrivacyLastSeen,
            profile.IsVerified,
            profile.VerificationDocumentUrl,
            profile.VerifiedAt,
            profile.LastActiveAt,
            profile.ProfileCompletionPercentage,
            profile.CreatedAt,
            profile.UpdatedAt
        });

        return result;
    }

    public async Task<Profile> UpdateProfileAsync(Profile profile)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = """

                                       UPDATE profiles
                                       SET
                                           first_name = @FirstName,
                                           last_name = @LastName,
                                           display_name = @DisplayName,
                                           bio = @Bio,
                                           avatar_url = @AvatarUrl,
                                           cover_image_url = @CoverImageUrl,
                                           date_of_birth = @DateOfBirth,
                                           gender = @Gender,
                                           location_lat = @LocationLat,
                                           location_lng = @LocationLng,
                                           location_city = @LocationCity,
                                           location_state = @LocationState,
                                           location_country = @LocationCountry,
                                           location_display = @LocationDisplay,
                                           privacy_show_location = @PrivacyShowLocation,
                                           privacy_show_age = @PrivacyShowAge,
                                           privacy_profile_visibility = @PrivacyProfileVisibility,
                                           privacy_last_seen = @PrivacyLastSeen,
                                           last_active_at = @LastActiveAt,
                                           updated_at = @UpdatedAt
                                       WHERE user_id = @UserId
                                       RETURNING
                                           id AS Id,
                                           user_id AS UserId,
                                           first_name AS FirstName,
                                           last_name AS LastName,
                                           display_name AS DisplayName,
                                           bio AS Bio,
                                           avatar_url AS AvatarUrl,
                                           cover_image_url AS CoverImageUrl,
                                           date_of_birth AS DateOfBirth,
                                           gender AS Gender,
                                           location_lat AS LocationLat,
                                           location_lng AS LocationLng,
                                           location_city AS LocationCity,
                                           location_state AS LocationState,
                                           location_country AS LocationCountry,
                                           location_display AS LocationDisplay,
                                           privacy_show_location AS PrivacyShowLocation,
                                           privacy_show_age AS PrivacyShowAge,
                                           privacy_profile_visibility AS PrivacyProfileVisibility,
                                           privacy_last_seen AS PrivacyLastSeen,
                                           is_verified AS IsVerified,
                                           verification_document_url AS VerificationDocumentUrl,
                                           verified_at AS VerifiedAt,
                                           last_active_at AS LastActiveAt,
                                           profile_completion_percentage AS ProfileCompletionPercentage,
                                           created_at AS CreatedAt,
                                           updated_at AS UpdatedAt
                                       
            """;

        var result = await connection.QuerySingleAsync<Profile>(sql, new
        {
            profile.FirstName,
            profile.LastName,
            profile.DisplayName,
            profile.Bio,
            profile.AvatarUrl,
            profile.CoverImageUrl,
            profile.DateOfBirth,
            profile.Gender,
            profile.LocationLat,
            profile.LocationLng,
            profile.LocationCity,
            profile.LocationState,
            profile.LocationCountry,
            profile.LocationDisplay,
            profile.PrivacyShowLocation,
            profile.PrivacyShowAge,
            profile.PrivacyProfileVisibility,
            profile.PrivacyLastSeen,
            profile.LastActiveAt,
            profile.UpdatedAt,
            profile.UserId
        });

        return result;
    }

    public async Task AddUserSportAsync(Guid userId, Guid sportId)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = """
                           INSERT INTO user_sports (id, user_id, sport_id, created_at)
                           VALUES (@Id, @UserId, @SportId, @CreatedAt)
                           ON CONFLICT (user_id, sport_id) DO NOTHING
                           """;

        await connection.ExecuteAsync(sql, new
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            SportId = sportId,
            CreatedAt = DateTime.UtcNow
        });
    }

    public async Task RemoveUserSportAsync(Guid userId, Guid sportId)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = """
                           DELETE FROM user_sports
                           WHERE user_id = @UserId AND sport_id = @SportId
                           """;

        await connection.ExecuteAsync(sql, new { UserId = userId, SportId = sportId });
    }

    public async Task<IEnumerable<Sport>> GetUserSportsAsync(Guid userId)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = """
                           SELECT 
                               s.id,
                               s.name,
                               s.slug,
                               s.description,
                               s.icon_url,
                               s.is_active,
                               s.display_order,
                               s.created_at
                           FROM sports s
                           INNER JOIN user_sports us ON s.id = us.sport_id
                           WHERE us.user_id = @UserId
                           ORDER BY s.display_order, s.name
                           """;

        var sports = await connection.QueryAsync<Sport>(sql, new { UserId = userId });
        return sports;
    }

    public async Task ClearUserSportsAsync(Guid userId)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = """
                           DELETE FROM user_sports
                           WHERE user_id = @UserId
                           """;

        await connection.ExecuteAsync(sql, new { UserId = userId });
    }

    public async Task<ProfileResponse?> GetProfileWithDetailsAsync(Guid userId)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string profileSql = """
                                  SELECT 
                                      p.id AS id,
                                      p.user_id AS user_id,
                                      p.first_name AS first_name,
                                      p.last_name AS last_name,
                                      u.email AS email,
                                      p.bio AS bio,
                                      p.avatar_url AS avatar_url,
                                      p.location_display AS location_display,
                                      p.location_lat AS location_lat,
                                      p.location_lng AS location_lng,
                                      p.created_at AS created_at,
                                      p.updated_at AS updated_at
                                  FROM profiles p
                                  INNER JOIN users u ON p.user_id = u.id
                                  WHERE p.user_id = @UserId
                                  LIMIT 1
                                  """;

        var profile = await connection.QuerySingleOrDefaultAsync<dynamic>(profileSql, new { UserId = userId });
        if (profile == null)
            return null;

        const string sportsSql = """
                                 SELECT 
                                     s.id,
                                     s.name,
                                     s.slug
                                 FROM sports s
                                 INNER JOIN user_sports us ON s.id = us.sport_id
                                 WHERE us.user_id = @UserId
                                 ORDER BY s.display_order, s.name
                                 """;

        var sports = await connection.QueryAsync<SportResponse>(sportsSql, new { UserId = userId });

        return new ProfileResponse
        {
            Id = profile.id,
            UserId = profile.user_id,
            FirstName = profile.first_name,
            LastName = profile.last_name,
            Email = profile.email,
            Username = profile.email?.Split('@')[0] ?? string.Empty,
            Bio = profile.bio,
            Avatar = profile.avatar_url,
            Area = profile.location_display,
            Latitude = profile.location_lat,
            Longitude = profile.location_lng,
            Sports = sports.ToList(),
            CreatedAt = profile.created_at,
            UpdatedAt = profile.updated_at
        };
    }
}
