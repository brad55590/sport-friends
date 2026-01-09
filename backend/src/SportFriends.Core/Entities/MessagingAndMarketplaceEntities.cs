namespace SportFriends.Core.Entities;

/// <summary>
/// Conversation entity for direct messaging between two users
/// </summary>
public class Conversation : Entity
{
    /// <summary>
    /// First participant
    /// </summary>
    public required Guid ParticipantOneId { get; set; }

    /// <summary>
    /// Second participant
    /// </summary>
    public required Guid ParticipantTwoId { get; set; }

    /// <summary>
    /// Reference to last message
    /// </summary>
    public Guid? LastMessageId { get; set; }

    /// <summary>
    /// Timestamp of last message
    /// </summary>
    public DateTime LastMessageAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Message entity for direct messages in conversations
/// </summary>
public class Message : Entity
{
    /// <summary>
    /// Reference to conversation
    /// </summary>
    public required Guid ConversationId { get; set; }

    /// <summary>
    /// Reference to sender
    /// </summary>
    public required Guid SenderId { get; set; }

    /// <summary>
    /// Reference to receiver
    /// </summary>
    public required Guid ReceiverId { get; set; }

    /// <summary>
    /// Message content
    /// </summary>
    public required string Content { get; set; }

    /// <summary>
    /// Is message read by receiver
    /// </summary>
    public bool IsRead { get; set; } = false;

    /// <summary>
    /// When message was read
    /// </summary>
    public DateTime? ReadAt { get; set; }

    /// <summary>
    /// Is message deleted by sender
    /// </summary>
    public bool IsDeletedBySender { get; set; } = false;

    /// <summary>
    /// Is message deleted by receiver
    /// </summary>
    public bool IsDeletedByReceiver { get; set; } = false;
}

/// <summary>
/// MarketplaceListing entity for second-hand sports equipment trading
/// </summary>
public class MarketplaceListing : Entity
{
    /// <summary>
    /// Reference to seller
    /// </summary>
    public required Guid UserId { get; set; }

    /// <summary>
    /// Reference to sport
    /// </summary>
    public required Guid SportId { get; set; }

    // Listing details

    /// <summary>
    /// Listing title
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// Listing description
    /// </summary>
    public required string Description { get; set; }

    /// <summary>
    /// Asking price
    /// </summary>
    public required decimal Price { get; set; }

    /// <summary>
    /// Currency code
    /// </summary>
    public string Currency { get; set; } = "USD";

    /// <summary>
    /// Item condition: new, like_new, good, fair, poor
    /// </summary>
    public string? Condition { get; set; }

    /// <summary>
    /// Item category: equipment, apparel, accessories, other
    /// </summary>
    public string? Category { get; set; }

    /// <summary>
    /// Brand name
    /// </summary>
    public string? Brand { get; set; }

    /// <summary>
    /// Size
    /// </summary>
    public string? Size { get; set; }

    /// <summary>
    /// Color
    /// </summary>
    public string? Color { get; set; }

    /// <summary>
    /// Image URLs (Azure Blob Storage)
    /// </summary>
    public string[]? Images { get; set; }

    // Location

    /// <summary>
    /// City
    /// </summary>
    public string? LocationCity { get; set; }

    /// <summary>
    /// State/Province
    /// </summary>
    public string? LocationState { get; set; }

    /// <summary>
    /// Country
    /// </summary>
    public string? LocationCountry { get; set; }

    /// <summary>
    /// Latitude
    /// </summary>
    public decimal? LocationLat { get; set; }

    /// <summary>
    /// Longitude
    /// </summary>
    public decimal? LocationLng { get; set; }

    /// <summary>
    /// Shipping available
    /// </summary>
    public bool ShippingAvailable { get; set; } = false;

    /// <summary>
    /// Local pickup only
    /// </summary>
    public bool LocalPickupOnly { get; set; } = true;

    // Status

    /// <summary>
    /// Listing status: active, sold, expired, deleted
    /// </summary>
    public string Status { get; set; } = "active";

    /// <summary>
    /// Reference to buyer (if sold)
    /// </summary>
    public Guid? SoldToUserId { get; set; }

    /// <summary>
    /// When item was sold
    /// </summary>
    public DateTime? SoldAt { get; set; }

    // Engagement

    /// <summary>
    /// Number of views
    /// </summary>
    public int ViewsCount { get; set; } = 0;

    /// <summary>
    /// Number of inquiries
    /// </summary>
    public int InquiriesCount { get; set; } = 0;

    /// <summary>
    /// Is listing featured
    /// </summary>
    public bool IsFeatured { get; set; } = false;

    /// <summary>
    /// When listing expires
    /// </summary>
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(60);
}

/// <summary>
/// Notification entity for user notifications
/// </summary>
public class Notification : Entity
{
    /// <summary>
    /// Reference to notification recipient
    /// </summary>
    public required Guid UserId { get; set; }

    /// <summary>
    /// Notification type
    /// </summary>
    public required string Type { get; set; }

    /// <summary>
    /// Notification title
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// Notification content/body
    /// </summary>
    public string? Content { get; set; }

    /// <summary>
    /// Reference to user who triggered notification (actor)
    /// </summary>
    public Guid? ActorId { get; set; }

    /// <summary>
    /// Reference to related entity (event, post, etc.)
    /// </summary>
    public Guid? RelatedEntityId { get; set; }

    /// <summary>
    /// Type of related entity
    /// </summary>
    public string? RelatedEntityType { get; set; }

    // Status

    /// <summary>
    /// Is notification read
    /// </summary>
    public bool IsRead { get; set; } = false;

    /// <summary>
    /// When notification was read
    /// </summary>
    public DateTime? ReadAt { get; set; }

    /// <summary>
    /// Is notification dismissed/archived
    /// </summary>
    public bool IsDismissed { get; set; } = false;

    /// <summary>
    /// When notification was dismissed
    /// </summary>
    public DateTime? DismissedAt { get; set; }

    // Delivery preferences

    /// <summary>
    /// Send email notification
    /// </summary>
    public bool SendEmail { get; set; } = true;

    /// <summary>
    /// Send push notification
    /// </summary>
    public bool SendPush { get; set; } = true;
}
