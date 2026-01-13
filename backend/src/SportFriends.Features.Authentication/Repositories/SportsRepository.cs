using Npgsql;
using Dapper;
using SportFriends.Shared.Entities;
using SportFriends.Shared.DTOs;

namespace SportFriends.Features.Authentication.Repositories;

/// <summary>
/// Sports repository interface
/// </summary>
public interface ISportsRepository
{
    /// <summary>
    /// Get all sports
    /// </summary>
    Task<IEnumerable<SportsListResponse>> GetAllSportsAsync();

    /// <summary>
    /// Get sport by ID
    /// </summary>
    Task<Sport?> GetSportByIdAsync(Guid sportId);

    /// <summary>
    /// Search sports by name
    /// </summary>
    Task<IEnumerable<SportsListResponse>> SearchSportsAsync(string query);
}

/// <summary>
/// Sports repository implementation using Dapper
/// </summary>
public class SportsRepository(string connectionString) : ISportsRepository
{
    public async Task<IEnumerable<SportsListResponse>> GetAllSportsAsync()
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = """
                           SELECT 
                               id,
                               name,
                               slug,
                               description,
                               icon_url,
                               is_active,
                               display_order
                           FROM sports
                           WHERE is_active = true
                           ORDER BY display_order, name
                           """;

        var sports = await connection.QueryAsync<SportsListResponse>(sql);
        return sports;
    }

    public async Task<Sport?> GetSportByIdAsync(Guid sportId)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = """
                           SELECT 
                               id,
                               name,
                               slug,
                               description,
                               icon_url,
                               is_active,
                               display_order,
                               created_at
                           FROM sports
                           WHERE id = @SportId
                           LIMIT 1
                           """;

        var sport = await connection.QuerySingleOrDefaultAsync<Sport>(sql, new { SportId = sportId });
        return sport;
    }

    public async Task<IEnumerable<SportsListResponse>> SearchSportsAsync(string query)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = """
                           SELECT 
                               id,
                               name,
                               slug,
                               description,
                               icon_url,
                               is_active,
                               display_order
                           FROM sports
                           WHERE is_active = true 
                             AND (name ILIKE @Query OR slug ILIKE @Query)
                           ORDER BY display_order, name
                           """;

        var sports = await connection.QueryAsync<SportsListResponse>(sql, new { Query = $"%{query}%" });
        return sports;
    }
}
