namespace SportFriends.Core.Entities;

/// <summary>
/// Friendship entity for friend connections and requests
/// </summary>
public class Friendship : Entity
{
    /// <summary>
    /// Reference to requester user
    /// </summary>
    public required Guid RequesterId { get; set; }

    /// <summary>
    /// Reference to addressee user
    /// </summary>
    public required Guid AddresseeId { get; set; }

    /// <summary>
    /// Friendship status: pending, accepted, declined, blocked
    /// </summary>
    public string Status { get; set; } = "pending";

    /// <summary>
    /// When friend request was sent
    /// </summary>
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// When request was responded to
    /// </summary>
    public DateTime? RespondedAt { get; set; }
}

/// <summary>
/// Post entity for social feed
/// </summary>
public class Post : Entity
{
    /// <summary>
    /// Reference to post creator
    /// </summary>
    public required Guid UserId { get; set; }

    /// <summary>
    /// Post content/text
    /// </summary>
    public required string Content { get; set; }

    /// <summary>
    /// Related sport (optional)
    /// </summary>
    public Guid? SportId { get; set; }

    /// <summary>
    /// Media URLs (Azure Blob Storage)
    /// </summary>
    public string[]? MediaUrls { get; set; }

    /// <summary>
    /// Media types (e.g., 'image', 'video')
    /// </summary>
    public string[]? MediaTypes { get; set; }

    /// <summary>
    /// Post visibility: public, friends, private
    /// </summary>
    public string Visibility { get; set; } = "public";

    // Engagement

    /// <summary>
    /// Number of likes
    /// </summary>
    public int LikesCount { get; set; } = 0;

    /// <summary>
    /// Number of comments
    /// </summary>
    public int CommentsCount { get; set; } = 0;

    /// <summary>
    /// Number of shares
    /// </summary>
    public int SharesCount { get; set; } = 0;

    // Moderation

    /// <summary>
    /// Is post reported
    /// </summary>
    public bool IsReported { get; set; } = false;

    /// <summary>
    /// Is post hidden by moderator
    /// </summary>
    public bool IsHidden { get; set; } = false;

    /// <summary>
    /// Moderation status: pending, approved, rejected
    /// </summary>
    public string ModerationStatus { get; set; } = "approved";
}

/// <summary>
/// PostComment entity for nested comments on posts
/// </summary>
public class PostComment : Entity
{
    /// <summary>
    /// Reference to post
    /// </summary>
    public required Guid PostId { get; set; }

    /// <summary>
    /// Reference to comment author
    /// </summary>
    public required Guid UserId { get; set; }

    /// <summary>
    /// Parent comment for nested replies
    /// </summary>
    public Guid? ParentCommentId { get; set; }

    /// <summary>
    /// Comment content
    /// </summary>
    public required string Content { get; set; }

    /// <summary>
    /// Is comment edited
    /// </summary>
    public bool IsEdited { get; set; } = false;

    /// <summary>
    /// Is comment soft-deleted
    /// </summary>
    public bool IsDeleted { get; set; } = false;
}

/// <summary>
/// PostLike entity for tracking post likes
/// </summary>
public class PostLike : Entity
{
    /// <summary>
    /// Reference to post
    /// </summary>
    public required Guid PostId { get; set; }

    /// <summary>
    /// Reference to user who liked
    /// </summary>
    public required Guid UserId { get; set; }
}
