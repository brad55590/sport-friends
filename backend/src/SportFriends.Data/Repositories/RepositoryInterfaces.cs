using SportFriends.Core.Entities;

namespace SportFriends.Data.Repositories;

/// <summary>
/// User repository interface for user account operations
/// </summary>
public interface IUserRepository : IRepository<User>
{
    /// <summary>
    /// Get user by email
    /// </summary>
    Task<User?> GetByEmailAsync(string email);

    /// <summary>
    /// Check if email exists
    /// </summary>
    Task<bool> EmailExistsAsync(string email);

    /// <summary>
    /// Verify user email
    /// </summary>
    Task VerifyEmailAsync(Guid userId);

    /// <summary>
    /// Update last login timestamp
    /// </summary>
    Task UpdateLastLoginAsync(Guid userId);
}

/// <summary>
/// Profile repository interface for user profile operations
/// </summary>
public interface IProfileRepository : IRepository<Profile>
{
    /// <summary>
    /// Get profile by user ID
    /// </summary>
    Task<Profile?> GetByUserIdAsync(Guid userId);

    /// <summary>
    /// Search profiles by display name and location
    /// </summary>
    Task<IEnumerable<Profile>> SearchAsync(string displayName, decimal? latitude, decimal? longitude, double radiusKm = 50);

    /// <summary>
    /// Get profiles near location
    /// </summary>
    Task<IEnumerable<Profile>> GetNearbyAsync(decimal latitude, decimal longitude, double radiusKm = 50);

    /// <summary>
    /// Update profile location
    /// </summary>
    Task UpdateLocationAsync(Guid profileId, decimal latitude, decimal longitude);

    /// <summary>
    /// Update last active timestamp
    /// </summary>
    Task UpdateLastActiveAsync(Guid userId);
}

/// <summary>
/// Sport repository interface
/// </summary>
public interface ISportRepository : IRepository<Sport>
{
    /// <summary>
    /// Get sport by slug
    /// </summary>
    Task<Sport?> GetBySlugAsync(string slug);

    /// <summary>
    /// Get all active sports ordered by display order
    /// </summary>
    Task<IEnumerable<Sport>> GetActiveSportsAsync();
}

/// <summary>
/// User sport repository interface for sport preferences
/// </summary>
public interface IUserSportRepository : IRepository<UserSport>
{
    /// <summary>
    /// Get user's sports
    /// </summary>
    Task<IEnumerable<UserSport>> GetByUserIdAsync(Guid userId);

    /// <summary>
    /// Get users interested in a sport
    /// </summary>
    Task<IEnumerable<UserSport>> GetBySportIdAsync(Guid sportId);

    /// <summary>
    /// Get user's sport by sport ID
    /// </summary>
    Task<UserSport?> GetByUserAndSportAsync(Guid userId, Guid sportId);
}

/// <summary>
/// Event repository interface for event operations
/// </summary>
public interface IEventRepository : IRepository<Event>
{
    /// <summary>
    /// Get upcoming events
    /// </summary>
    Task<(IEnumerable<Event> Items, int Total)> GetUpcomingAsync(int page, int limit, Guid? sportId = null);

    /// <summary>
    /// Get events by sport
    /// </summary>
    Task<IEnumerable<Event>> GetBySportIdAsync(Guid sportId);

    /// <summary>
    /// Get events created by user
    /// </summary>
    Task<IEnumerable<Event>> GetByCreatorIdAsync(Guid creatorId);

    /// <summary>
    /// Get events near location
    /// </summary>
    Task<IEnumerable<Event>> GetNearbyAsync(decimal latitude, decimal longitude, double radiusKm = 50);

    /// <summary>
    /// Search events
    /// </summary>
    Task<(IEnumerable<Event> Items, int Total)> SearchAsync(string title, Guid? sportId, string? skillLevel, int page, int limit);
}

/// <summary>
/// Event attendee repository interface
/// </summary>
public interface IEventAttendeeRepository : IRepository<EventAttendee>
{
    /// <summary>
    /// Get event attendees
    /// </summary>
    Task<IEnumerable<EventAttendee>> GetByEventIdAsync(Guid eventId);

    /// <summary>
    /// Get events attended by user
    /// </summary>
    Task<IEnumerable<EventAttendee>> GetByUserIdAsync(Guid userId);

    /// <summary>
    /// Get attendee status
    /// </summary>
    Task<EventAttendee?> GetByEventAndUserAsync(Guid eventId, Guid userId);

    /// <summary>
    /// Get attendee count by status
    /// </summary>
    Task<Dictionary<string, int>> GetAttendeeCountsByStatusAsync(Guid eventId);
}

/// <summary>
/// Friendship repository interface
/// </summary>
public interface IFriendshipRepository : IRepository<Friendship>
{
    /// <summary>
    /// Get pending friend requests for user
    /// </summary>
    Task<IEnumerable<Friendship>> GetPendingRequestsAsync(Guid userId);

    /// <summary>
    /// Get friends of user (accepted friendships)
    /// </summary>
    Task<IEnumerable<Friendship>> GetFriendsAsync(Guid userId);

    /// <summary>
    /// Check if users are friends
    /// </summary>
    Task<bool> AreFriendsAsync(Guid userId1, Guid userId2);

    /// <summary>
    /// Get friendship status between two users
    /// </summary>
    Task<Friendship?> GetFriendshipAsync(Guid userId1, Guid userId2);
}

/// <summary>
/// Post repository interface for social feed
/// </summary>
public interface IPostRepository : IRepository<Post>
{
    /// <summary>
    /// Get user's posts
    /// </summary>
    Task<(IEnumerable<Post> Items, int Total)> GetByUserIdAsync(Guid userId, int page, int limit);

    /// <summary>
    /// Get feed posts for user (from followed users)
    /// </summary>
    Task<(IEnumerable<Post> Items, int Total)> GetFeedAsync(Guid userId, int page, int limit);

    /// <summary>
    /// Get posts by sport
    /// </summary>
    Task<(IEnumerable<Post> Items, int Total)> GetBySportIdAsync(Guid sportId, int page, int limit);

    /// <summary>
    /// Get pending moderation posts
    /// </summary>
    Task<IEnumerable<Post>> GetPendingModerationAsync();
}

/// <summary>
/// Message repository interface
/// </summary>
public interface IMessageRepository : IRepository<Message>
{
    /// <summary>
    /// Get messages in conversation
    /// </summary>
    Task<(IEnumerable<Message> Items, int Total)> GetByConversationIdAsync(Guid conversationId, int page, int limit);

    /// <summary>
    /// Get unread messages for user
    /// </summary>
    Task<IEnumerable<Message>> GetUnreadAsync(Guid userId);

    /// <summary>
    /// Mark message as read
    /// </summary>
    Task MarkAsReadAsync(Guid messageId);
}

/// <summary>
/// Conversation repository interface
/// </summary>
public interface IConversationRepository : IRepository<Conversation>
{
    /// <summary>
    /// Get user's conversations
    /// </summary>
    Task<(IEnumerable<Conversation> Items, int Total)> GetByUserIdAsync(Guid userId, int page, int limit);

    /// <summary>
    /// Get or create conversation between two users
    /// </summary>
    Task<Conversation> GetOrCreateAsync(Guid userId1, Guid userId2);

    /// <summary>
    /// Get conversation between two specific users
    /// </summary>
    Task<Conversation?> GetByParticipantsAsync(Guid userId1, Guid userId2);
}

/// <summary>
/// Marketplace listing repository interface
/// </summary>
public interface IMarketplaceListingRepository : IRepository<MarketplaceListing>
{
    /// <summary>
    /// Get active listings
    /// </summary>
    Task<(IEnumerable<MarketplaceListing> Items, int Total)> GetActiveAsync(int page, int limit);

    /// <summary>
    /// Get user's listings
    /// </summary>
    Task<IEnumerable<MarketplaceListing>> GetByUserIdAsync(Guid userId);

    /// <summary>
    /// Search listings by sport
    /// </summary>
    Task<(IEnumerable<MarketplaceListing> Items, int Total)> GetBySportIdAsync(Guid sportId, int page, int limit);

    /// <summary>
    /// Get listings near location
    /// </summary>
    Task<IEnumerable<MarketplaceListing>> GetNearbyAsync(decimal latitude, decimal longitude, double radiusKm = 50);

    /// <summary>
    /// Search listings
    /// </summary>
    Task<(IEnumerable<MarketplaceListing> Items, int Total)> SearchAsync(string title, Guid? sportId, string? condition, decimal? minPrice, decimal? maxPrice, int page, int limit);
}

/// <summary>
/// Notification repository interface
/// </summary>
public interface INotificationRepository : IRepository<Notification>
{
    /// <summary>
    /// Get user's notifications
    /// </summary>
    Task<(IEnumerable<Notification> Items, int Total)> GetByUserIdAsync(Guid userId, int page, int limit);

    /// <summary>
    /// Get unread notifications count
    /// </summary>
    Task<int> GetUnreadCountAsync(Guid userId);

    /// <summary>
    /// Mark notification as read
    /// </summary>
    Task MarkAsReadAsync(Guid notificationId);

    /// <summary>
    /// Mark all notifications as read for user
    /// </summary>
    Task MarkAllAsReadAsync(Guid userId);
}
