namespace SportFriends.Data.Repositories;

/// <summary>
/// Unit of Work pattern implementation for managing database transactions
/// </summary>
public interface IUnitOfWork : IAsyncDisposable
{
    /// <summary>
    /// User repository for user account operations
    /// </summary>
    IUserRepository Users { get; }
    
    /// <summary>
    /// Profile repository for user profile operations
    /// </summary>
    IProfileRepository Profiles { get; }
    
    /// <summary>
    /// Sport repository for sports management
    /// </summary>
    ISportRepository Sports { get; }
    
    /// <summary>
    /// User sport repository for sport preferences
    /// </summary>
    IUserSportRepository UserSports { get; }
    
    /// <summary>
    /// Event repository for event operations
    /// </summary>
    IEventRepository Events { get; }
    
    /// <summary>
    /// Event attendees repository for event participation
    /// </summary>
    IEventAttendeeRepository EventAttendees { get; }
    
    /// <summary>
    /// Friendship repository for friend connections
    /// </summary>
    IFriendshipRepository Friendships { get; }
    
    /// <summary>
    /// Post repository for social feed posts
    /// </summary>
    IPostRepository Posts { get; }
    
    /// <summary>
    /// Message repository for direct messaging
    /// </summary>
    IMessageRepository Messages { get; }
    
    /// <summary>
    /// Conversation repository for message conversations
    /// </summary>
    IConversationRepository Conversations { get; }
    
    /// <summary>
    /// Marketplace listing repository for equipment trading
    /// </summary>
    IMarketplaceListingRepository MarketplaceListings { get; }
    
    /// <summary>
    /// Notification repository for user notifications
    /// </summary>
    INotificationRepository Notifications { get; }
    
    /// <summary>
    /// Begin a transaction
    /// </summary>
    Task<IAsyncTransaction> BeginTransactionAsync();
    
    /// <summary>
    /// Save all changes to database
    /// </summary>
    Task SaveAsync();
    
    /// <summary>
    /// Rollback all changes (used in transaction)
    /// </summary>
    Task RollbackAsync();
}

/// <summary>
/// Represents an async database transaction
/// </summary>
public interface IAsyncTransaction : IAsyncDisposable
{
    /// <summary>
    /// Commit the transaction
    /// </summary>
    Task CommitAsync();
    
    /// <summary>
    /// Rollback the transaction
    /// </summary>
    Task RollbackAsync();
}
