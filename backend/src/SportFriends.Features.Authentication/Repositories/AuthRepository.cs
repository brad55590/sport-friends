using Npgsql;
using Dapper;
using SportFriends.Shared.Entities;

namespace SportFriends.Features.Authentication.Repositories;

/// <summary>
/// Authentication repository for user operations
/// </summary>
public interface IAuthRepository
{
    /// <summary>
    /// Get user by email
    /// </summary>
    Task<User?> GetUserByEmailAsync(string email);

    /// <summary>
    /// Create new user
    /// </summary>
    Task<User> CreateUserAsync(User user);

    /// <summary>
    /// Check if email exists
    /// </summary>
    Task<bool> EmailExistsAsync(string email);

    /// <summary>
    /// Update last login
    /// </summary>
    Task UpdateLastLoginAsync(Guid userId);
}

/// <summary>
/// Auth repository implementation using Dapper
/// </summary>
public class AuthRepository(string connectionString) : IAuthRepository
{
    public async Task<User?> GetUserByEmailAsync(string email)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = """
                           SELECT 
                               id AS Id,
                               email AS Email,
                               email_verified AS EmailVerified,
                               email_verification_token AS EmailVerificationToken,
                               email_verification_expires AS EmailVerificationExpires,
                               password_hash AS PasswordHash,
                               phone AS Phone,
                               phone_verified AS PhoneVerified,
                               status AS Status,
                               role AS Role,
                               last_login_at AS LastLoginAt,
                               created_at AS CreatedAt,
                               updated_at AS UpdatedAt
                           FROM users
                           WHERE email = @Email
                           LIMIT 1
                           """;

        var user = await connection.QuerySingleOrDefaultAsync<User>(sql, new { Email = email });
        return user;
    }

    public async Task<User> CreateUserAsync(User user)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = """
                           INSERT INTO users
                               (
                                 id,
                                 email,
                                 password_hash,
                                 status,
                                 role,
                                 created_at,
                                 updated_at
                               )
                           VALUES
                               (
                                 @Id,
                                 @Email,
                                 @PasswordHash,
                                 @Status,
                                 @Role,
                                 @CreatedAt,
                                 @UpdatedAt
                               )
                           RETURNING 
                               id AS Id,
                               email AS Email,
                               email_verified AS EmailVerified,
                               email_verification_token AS EmailVerificationToken,
                               email_verification_expires AS EmailVerificationExpires,
                               password_hash AS PasswordHash,
                               phone AS Phone,
                               phone_verified AS PhoneVerified,
                               status AS Status,
                               role AS Role,
                               last_login_at AS LastLoginAt,
                               created_at AS CreatedAt,
                               updated_at AS UpdatedAt
                           """;

        var result = await connection.QuerySingleAsync<User>(sql, new
        {
            user.Id,
            user.Email,
            user.PasswordHash,
            user.Status,
            user.Role,
            user.CreatedAt,
            user.UpdatedAt
        });

        return result;
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = "SELECT COUNT(*) FROM users WHERE email = @Email";
        var count = await connection.ExecuteScalarAsync<int>(sql, new { Email = email });

        return count > 0;
    }

    public async Task UpdateLastLoginAsync(Guid userId)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = "UPDATE users SET last_login_at = @Now, updated_at = @Now WHERE id = @Id";
        await connection.ExecuteAsync(sql, new { Id = userId, Now = DateTime.UtcNow });
    }
}
