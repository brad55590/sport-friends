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
public class AuthRepository : IAuthRepository
{
    private readonly string _connectionString;
    
    public AuthRepository(string connectionString)
    {
        _connectionString = connectionString;
    }
    
    public async Task<User?> GetUserByEmailAsync(string email)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        
        var sql = @"
            SELECT id, email, email_verified, email_verification_token, 
                   email_verification_expires, password_hash, phone, phone_verified,
                   status, role, last_login_at, created_at, updated_at
            FROM users
            WHERE email = @Email
            LIMIT 1
        ";
        
        var user = await connection.QuerySingleOrDefaultAsync<User>(sql, new { Email = email });
        return user;
    }
    
    public async Task<User> CreateUserAsync(User user)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        
        var sql = @"
            INSERT INTO users (id, email, password_hash, status, role, created_at, updated_at)
            VALUES (@Id, @Email, @PasswordHash, @Status, @Role, @CreatedAt, @UpdatedAt)
            RETURNING *
        ";
        
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
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        
        var sql = "SELECT COUNT(*) FROM users WHERE email = @Email";
        var count = await connection.ExecuteScalarAsync<int>(sql, new { Email = email });
        
        return count > 0;
    }
    
    public async Task UpdateLastLoginAsync(Guid userId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        
        var sql = "UPDATE users SET last_login_at = @Now, updated_at = @Now WHERE id = @Id";
        await connection.ExecuteAsync(sql, new { Id = userId, Now = DateTime.UtcNow });
    }
}
