namespace SportFriends.Core.Entities;

/// <summary>
/// Event entity representing a sports event or meetup
/// </summary>
public class Event : Entity
{
    /// <summary>
    /// Reference to creator user
    /// </summary>
    public required Guid CreatorId { get; set; }
    
    /// <summary>
    /// Reference to sport
    /// </summary>
    public required Guid SportId { get; set; }
    
    // Event details
    
    /// <summary>
    /// Event title
    /// </summary>
    public required string Title { get; set; }
    
    /// <summary>
    /// Event description
    /// </summary>
    public string? Description { get; set; }
    
    /// <summary>
    /// Event type: casual, competitive, training, tournament
    /// </summary>
    public string EventType { get; set; } = "casual";
    
    /// <summary>
    /// Required skill level: any, beginner, intermediate, advanced, expert
    /// </summary>
    public string? SkillLevel { get; set; }
    
    /// <summary>
    /// Visibility: public, friends, private
    /// </summary>
    public string Visibility { get; set; } = "public";
    
    // Date and time
    
    /// <summary>
    /// Event start time
    /// </summary>
    public required DateTime StartTime { get; set; }
    
    /// <summary>
    /// Event end time
    /// </summary>
    public DateTime? EndTime { get; set; }
    
    /// <summary>
    /// Timezone for event (IANA timezone)
    /// </summary>
    public string Timezone { get; set; } = "UTC";
    
    // Location
    
    /// <summary>
    /// Location name (venue name)
    /// </summary>
    public string? LocationName { get; set; }
    
    /// <summary>
    /// Location address
    /// </summary>
    public string? LocationAddress { get; set; }
    
    /// <summary>
    /// Latitude
    /// </summary>
    public decimal? LocationLat { get; set; }
    
    /// <summary>
    /// Longitude
    /// </summary>
    public decimal? LocationLng { get; set; }
    
    /// <summary>
    /// Additional location details (parking, entry instructions, etc.)
    /// </summary>
    public string? LocationDetails { get; set; }
    
    // Capacity
    
    /// <summary>
    /// Maximum attendees allowed
    /// </summary>
    public int? MaxAttendees { get; set; }
    
    /// <summary>
    /// Current attendee count
    /// </summary>
    public int CurrentAttendees { get; set; } = 0;
    
    // Additional details
    
    /// <summary>
    /// Cost per person
    /// </summary>
    public decimal Cost { get; set; } = 0;
    
    /// <summary>
    /// Currency code (ISO 4217)
    /// </summary>
    public string CostCurrency { get; set; } = "USD";
    
    /// <summary>
    /// Event image URL (Azure Blob Storage)
    /// </summary>
    public string? ImageUrl { get; set; }
    
    /// <summary>
    /// External link (to venue, registration, etc.)
    /// </summary>
    public string? ExternalLink { get; set; }
    
    // Status
    
    /// <summary>
    /// Event status: upcoming, ongoing, completed, cancelled
    /// </summary>
    public string Status { get; set; } = "upcoming";
    
    /// <summary>
    /// Reason for cancellation
    /// </summary>
    public string? CancelledReason { get; set; }
    
    /// <summary>
    /// Timestamp of cancellation
    /// </summary>
    public DateTime? CancelledAt { get; set; }
    
    // Metadata
    
    /// <summary>
    /// Number of views
    /// </summary>
    public int ViewsCount { get; set; } = 0;
    
    /// <summary>
    /// Number of shares
    /// </summary>
    public int SharesCount { get; set; } = 0;
    
    /// <summary>
    /// Is event featured on homepage
    /// </summary>
    public bool IsFeatured { get; set; } = false;
}

/// <summary>
/// EventAttendee entity for event participation
/// </summary>
public class EventAttendee : Entity
{
    /// <summary>
    /// Reference to event
    /// </summary>
    public required Guid EventId { get; set; }
    
    /// <summary>
    /// Reference to user
    /// </summary>
    public required Guid UserId { get; set; }
    
    /// <summary>
    /// Attendance status: going, maybe, declined
    /// </summary>
    public string Status { get; set; } = "going";
    
    /// <summary>
    /// When user joined the event
    /// </summary>
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}
