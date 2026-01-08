/**
 * Shared C# types used in the backend
 * Mirror of TypeScript shared types for API contract
 * Location: SportFriends.Core/Shared/
 */

using System;
using System.Collections.Generic;

namespace SportFriends.Core.Shared
{
    // API Response wrapper
    public class ApiResponse<T>
    {
        public T Data { get; set; }
        public string Error { get; set; }
        public string Message { get; set; }
        public int StatusCode { get; set; }
    }

    public class ApiPagedResponse<T>
    {
        public List<T> Data { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
    }

    // User Types
    public class UserProfileDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Bio { get; set; }
        public string Avatar { get; set; }
        public double LocationLatitude { get; set; }
        public double LocationLongitude { get; set; }
        public List<SportDto> Sports { get; set; }
        public SkillLevel SkillLevel { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class UserRegistrationRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<string> Sports { get; set; }
        public SkillLevel SkillLevel { get; set; }
    }

    public class AuthToken
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public int ExpiresIn { get; set; }
    }

    // Sport Types
    public class SportDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
    }

    public enum SkillLevel
    {
        Beginner = 0,
        Intermediate = 1,
        Advanced = 2,
        Professional = 3
    }

    // Event Types
    public class EventDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public SportDto Sport { get; set; }
        public DateTime DateTime { get; set; }
        public double LocationLatitude { get; set; }
        public double LocationLongitude { get; set; }
        public int? MaxParticipants { get; set; }
        public int CurrentParticipants { get; set; }
        public UserProfileDto Organizer { get; set; }
        public bool IsPublic { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateEventRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string SportId { get; set; }
        public DateTime DateTime { get; set; }
        public double LocationLatitude { get; set; }
        public double LocationLongitude { get; set; }
        public int? MaxParticipants { get; set; }
        public bool IsPublic { get; set; }
    }

    // Marketplace Types
    public class ListingDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public SportDto Sport { get; set; }
        public decimal Price { get; set; }
        public List<string> Images { get; set; }
        public UserProfileDto Seller { get; set; }
        public ListingStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public enum ListingStatus
    {
        Available = 0,
        Sold = 1,
        Removed = 2
    }

    // Message Types
    public class MessageDto
    {
        public string Id { get; set; }
        public string ConversationId { get; set; }
        public string SenderId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }
    }

    // Post/Feed Types
    public class PostDto
    {
        public string Id { get; set; }
        public string AuthorId { get; set; }
        public UserProfileDto Author { get; set; }
        public string Content { get; set; }
        public List<string> Images { get; set; }
        public int Likes { get; set; }
        public int Comments { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CommentDto
    {
        public string Id { get; set; }
        public string PostId { get; set; }
        public string AuthorId { get; set; }
        public UserProfileDto Author { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    // Error Types
    public class ApiError
    {
        public string Code { get; set; }
        public string Message { get; set; }
        public Dictionary<string, object> Details { get; set; }
    }
}
