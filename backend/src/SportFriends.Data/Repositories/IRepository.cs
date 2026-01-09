namespace SportFriends.Data.Repositories;

/// <summary>
/// Generic repository interface for CRUD operations with Dapper
/// </summary>
/// <typeparam name="T">Entity type</typeparam>
public interface IRepository<T> where T : class
{
    /// <summary>
    /// Get entity by ID
    /// </summary>
    Task<T?> GetByIdAsync(Guid id);

    /// <summary>
    /// Get all entities
    /// </summary>
    Task<IEnumerable<T>> GetAllAsync();

    /// <summary>
    /// Get entities with pagination
    /// </summary>
    Task<(IEnumerable<T> Items, int Total)> GetPagedAsync(int page, int limit);

    /// <summary>
    /// Create new entity
    /// </summary>
    Task<Guid> CreateAsync(T entity);

    /// <summary>
    /// Update existing entity
    /// </summary>
    Task<bool> UpdateAsync(T entity);

    /// <summary>
    /// Delete entity by ID
    /// </summary>
    Task<bool> DeleteAsync(Guid id);

    /// <summary>
    /// Check if entity exists
    /// </summary>
    Task<bool> ExistsAsync(Guid id);
}
