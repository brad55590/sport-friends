# SportFriends - Technical Specification

## Document Information
- **Version**: 1.0
- **Date**: January 8, 2026
- **Status**: Draft for Review

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Database Design](#database-design)
5. [API Specifications](#api-specifications)
6. [Security](#security)
7. [Infrastructure](#infrastructure)
8. [Development Approach](#development-approach)

---

## System Overview

### Application Type
- **Phase 1**: Mobile-responsive progressive web application (PWA)
- **Phase 2**: Native iOS and Android applications

### Core Capabilities
1. User authentication and profile management
2. Location-based user discovery
3. Social networking (posts, feed, friends)
4. Event creation and management
5. Real-time messaging
6. Marketplace for equipment
7. Push notifications
8. Media upload and storage

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Web App    │  │   iOS App    │  │ Android App  │  │
│  │   (React)    │  │  (Phase 2)   │  │  (Phase 2)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │
┌─────────────────────────────────────────────────────────┐
│                    API Gateway Layer                     │
│                    (Load Balancer)                       │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │         ASP.NET Core Web API (.NET 8)            │  │
│  │                                                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────┐ │  │
│  │  │   Auth     │  │  Business  │  │   Data    │ │  │
│  │  │  Services  │  │   Logic    │  │  Access   │ │  │
│  │  └────────────┘  └────────────┘  └───────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                     Data Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │    Redis     │  │     S3       │  │
│  │  (Primary)   │  │   (Cache)    │  │   (Media)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                  External Services                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   SendGrid   │  │   Firebase   │  │  Ad Network  │  │
│  │   (Email)    │  │   (Push)     │  │  (Revenue)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Architecture Principles
- **Separation of Concerns**: Clear boundaries between layers
- **Scalability**: Horizontal scaling capability for API layer
- **Security**: Defense in depth approach
- **Performance**: Caching strategy to minimize database calls
- **Maintainability**: Clean code, SOLID principles, comprehensive testing

---

## Technology Stack

### Frontend

#### Web Application (Phase 1)
- **Framework**: React 18+
- **Language**: TypeScript
- **State Management**: Redux Toolkit or Zustand
- **Routing**: React Router v6
- **UI Framework**: Material-UI (MUI) or Tailwind CSS
- **Forms**: React Hook Form + Yup validation
- **API Client**: Axios
- **Maps**: Mapbox GL JS or Google Maps JavaScript API
- **Real-time**: SignalR client for messaging
- **Build Tool**: Vite
- **PWA**: Workbox for service workers

#### Mobile Applications (Phase 2)
- **iOS**: React Native or Swift (TBD)
- **Android**: React Native or Kotlin (TBD)
- **Option**: React Native for cross-platform consistency

### Backend

#### API Server
- **Framework**: ASP.NET Core 8.0 Web API
- **Language**: C# 12
- **Authentication**: ASP.NET Core Identity + JWT
- **Real-time**: SignalR for WebSocket connections
- **ORM**: Entity Framework Core 8.0
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Serilog
- **Validation**: FluentValidation

#### Architecture Pattern
- **Clean Architecture**: Domain, Application, Infrastructure, Presentation layers
- **CQRS**: Command Query Responsibility Segregation for complex operations
- **Repository Pattern**: Data access abstraction
- **Unit of Work**: Transaction management

### Database

#### Primary Database
- **Database**: PostgreSQL 16+
- **Extensions**:
  - PostGIS for geospatial queries (location-based search)
  - pg_trgm for fuzzy text search
  - uuid-ossp for UUID generation
- **Connection Pooling**: Npgsql with pgBouncer

#### Caching Layer
- **Cache**: Redis 7+
- **Use Cases**:
  - Session management
  - API response caching
  - Rate limiting
  - Real-time presence (online users)

#### File Storage
- **Storage**: AWS S3 or Azure Blob Storage
- **Use Cases**:
  - Profile images
  - Event photos
  - Marketplace listing images
  - User-generated content
- **CDN**: CloudFront or Azure CDN for global distribution

### DevOps & Infrastructure

#### Hosting
- **Platform**: AWS, Azure, or DigitalOcean
- **Compute**: Docker containers on Kubernetes or managed container service
- **Database**: Managed PostgreSQL (AWS RDS, Azure Database)
- **Cache**: Managed Redis (AWS ElastiCache, Azure Cache)

#### CI/CD
- **Version Control**: Git (GitHub/GitLab)
- **CI/CD Pipeline**: GitHub Actions or GitLab CI
- **Container Registry**: Docker Hub or AWS ECR
- **Deployment**: Blue-green or rolling deployments

#### Monitoring & Analytics
- **APM**: Application Insights or New Relic
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana) or cloud-native logging
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Mixpanel for user behavior

### Third-Party Services

#### Communication
- **Email**: SendGrid or AWS SES
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **SMS** (future): Twilio

#### Payments (Future)
- **Payment Processing**: Stripe or PayPal
- **Use Case**: Premium subscriptions, marketplace transactions

#### Maps & Location
- **Geocoding**: Google Maps Geocoding API or Mapbox
- **Map Display**: Mapbox GL JS or Google Maps
- **Distance Calculation**: PostGIS functions

#### Authentication (Optional)
- **Social Login**: OAuth 2.0 (Google, Facebook, Apple)
- **Identity Provider**: Auth0 or native ASP.NET Core Identity

---

## Database Design

### Entity Relationship Overview

```
Users ──┬── Profiles ──┬── UserInterests
        │              └── UserSports
        ├── Posts
        ├── Events (creator)
        ├── EventAttendees (attendee)
        ├── Friendships
        ├── Messages (sender/receiver)
        ├── MarketplaceListings
        └── Notifications

Sports ───┬── UserSports
          └── Events

Interests ─── UserInterests

Locations ─── Events
          └── MarketplaceListings
```

### Core Tables

#### Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, deleted
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
```

#### Profiles
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    date_of_birth DATE,
    gender VARCHAR(20),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_country VARCHAR(100),
    location_display VARCHAR(255), -- "Sydney, NSW, Australia"
    privacy_show_location BOOLEAN DEFAULT TRUE,
    privacy_show_age BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PostGIS geography type for efficient distance calculations
ALTER TABLE profiles ADD COLUMN location GEOGRAPHY(POINT, 4326);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_location_gist ON profiles USING GIST(location);
CREATE INDEX idx_profiles_location_coords ON profiles(location_lat, location_lng);
```

#### Sports
```sql
CREATE TABLE sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO sports (name, slug, description) VALUES
    ('Golf', 'golf', 'Golf activities and meetups'),
    ('Netball', 'netball', 'Netball games and training');
```

#### UserSports
```sql
CREATE TABLE user_sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    skill_level VARCHAR(20), -- beginner, intermediate, advanced, expert
    years_experience INT,
    frequency VARCHAR(20), -- daily, weekly, monthly, occasionally
    preferred_days TEXT[], -- ['monday', 'wednesday', 'saturday']
    preferred_times TEXT[], -- ['morning', 'afternoon', 'evening']
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, sport_id)
);

CREATE INDEX idx_user_sports_user_id ON user_sports(user_id);
CREATE INDEX idx_user_sports_sport_id ON user_sports(sport_id);
CREATE INDEX idx_user_sports_skill_level ON user_sports(skill_level);
```

#### Interests
```sql
CREATE TABLE interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50), -- sports, music, food, travel, etc.
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interest_id UUID NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, interest_id)
);

CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_interests_interest_id ON user_interests(interest_id);
```

#### Friendships
```sql
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, declined, blocked
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT no_self_friendship CHECK (requester_id != addressee_id),
    UNIQUE(requester_id, addressee_id)
);

CREATE INDEX idx_friendships_requester ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX idx_friendships_status ON friendships(status);
```

#### Events
```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES users(id),
    sport_id UUID NOT NULL REFERENCES sports(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(20) DEFAULT 'casual', -- casual, competitive, training
    skill_level VARCHAR(20), -- any, beginner, intermediate, advanced
    visibility VARCHAR(20) DEFAULT 'public', -- public, friends, private
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    location_name VARCHAR(255),
    location_address TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location GEOGRAPHY(POINT, 4326),
    max_attendees INT,
    current_attendees INT DEFAULT 0,
    cost DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, ongoing, completed, cancelled
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_creator ON events(creator_id);
CREATE INDEX idx_events_sport ON events(sport_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_location_gist ON events USING GIST(location);
```

#### EventAttendees
```sql
CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'going', -- going, maybe, declined
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_attendees_event ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user ON event_attendees(user_id);
```

#### Posts
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sport_id UUID REFERENCES sports(id),
    media_urls TEXT[], -- array of image/video URLs
    visibility VARCHAR(20) DEFAULT 'public', -- public, friends, private
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_sport_id ON posts(sport_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

#### PostLikes
```sql
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id);
```

#### PostComments
```sql
CREATE TABLE post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_post_comments_post ON post_comments(post_id);
CREATE INDEX idx_post_comments_user ON post_comments(user_id);
```

#### Messages
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_one_id UUID NOT NULL REFERENCES users(id),
    participant_two_id UUID NOT NULL REFERENCES users(id),
    last_message_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT no_self_conversation CHECK (participant_one_id != participant_two_id),
    UNIQUE(participant_one_id, participant_two_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

#### MarketplaceListings
```sql
CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sport_id UUID NOT NULL REFERENCES sports(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    condition VARCHAR(20), -- new, like_new, good, fair, poor
    category VARCHAR(50), -- equipment, apparel, accessories
    brand VARCHAR(100),
    size VARCHAR(50),
    images TEXT[], -- array of image URLs
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location GEOGRAPHY(POINT, 4326),
    status VARCHAR(20) DEFAULT 'active', -- active, sold, expired, deleted
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE INDEX idx_marketplace_user ON marketplace_listings(user_id);
CREATE INDEX idx_marketplace_sport ON marketplace_listings(sport_id);
CREATE INDEX idx_marketplace_status ON marketplace_listings(status);
CREATE INDEX idx_marketplace_price ON marketplace_listings(price);
CREATE INDEX idx_marketplace_location_gist ON marketplace_listings USING GIST(location);
CREATE INDEX idx_marketplace_created_at ON marketplace_listings(created_at DESC);
```

#### Notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- friend_request, message, event_invite, etc.
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link VARCHAR(500), -- deep link to relevant content
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

## API Specifications

### API Architecture
- **Style**: RESTful API
- **Format**: JSON
- **Versioning**: URL-based (/api/v1/)
- **Authentication**: JWT Bearer tokens
- **Rate Limiting**: Redis-based rate limiting

### Authentication Flow

#### Register
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "token": "jwt-token"
  }
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### Refresh Token
```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "token": "new-jwt-token",
    "refreshToken": "new-refresh-token"
  }
}
```

### User Profile Endpoints

#### Get Current User Profile
```
GET /api/v1/profile
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "displayName": "Johnny",
    "bio": "Avid golfer...",
    "avatarUrl": "https://...",
    "location": {
      "city": "Sydney",
      "state": "NSW",
      "country": "Australia"
    },
    "sports": [
      {
        "id": "uuid",
        "name": "Golf",
        "skillLevel": "intermediate",
        "yearsExperience": 5
      }
    ],
    "interests": [...]
  }
}
```

#### Update Profile
```
PUT /api/v1/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "bio": "Updated bio...",
  "location": {
    "lat": -33.8688,
    "lng": 151.2093,
    "city": "Sydney"
  }
}

Response: 200 OK
```

#### Upload Avatar
```
POST /api/v1/profile/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary]

Response: 200 OK
{
  "success": true,
  "data": {
    "avatarUrl": "https://cdn.../avatar.jpg"
  }
}
```

### Discovery Endpoints

#### Search Users by Location
```
GET /api/v1/users/search?lat=-33.8688&lng=151.2093&radius=10&sport=golf&page=1&limit=20
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "displayName": "Jane Smith",
        "avatarUrl": "https://...",
        "distance": 5.2,
        "sports": ["Golf"],
        "bio": "..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

#### Get User Profile (Public)
```
GET /api/v1/users/{userId}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "displayName": "Jane Smith",
    "bio": "...",
    "sports": [...],
    "mutualFriends": 3,
    "isFriend": false
  }
}
```

### Friend Management

#### Send Friend Request
```
POST /api/v1/friends/request
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "uuid"
}

Response: 201 Created
```

#### Get Friend Requests
```
GET /api/v1/friends/requests?type=received
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "displayName": "...",
          "avatarUrl": "..."
        },
        "createdAt": "2026-01-08T12:00:00Z"
      }
    ]
  }
}
```

#### Accept/Decline Friend Request
```
PUT /api/v1/friends/requests/{requestId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "action": "accept" // or "decline"
}

Response: 200 OK
```

#### Get Friends List
```
GET /api/v1/friends?page=1&limit=50
Authorization: Bearer {token}

Response: 200 OK
```

### Event Endpoints

#### Create Event
```
POST /api/v1/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "sportId": "uuid",
  "title": "Weekend Golf Round",
  "description": "Looking for 2 more players...",
  "startTime": "2026-01-15T09:00:00Z",
  "endTime": "2026-01-15T13:00:00Z",
  "location": {
    "name": "Sydney Golf Club",
    "address": "123 Golf Rd, Sydney",
    "lat": -33.8688,
    "lng": 151.2093
  },
  "maxAttendees": 4,
  "skillLevel": "intermediate",
  "visibility": "public"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Weekend Golf Round",
    ...
  }
}
```

#### Search Events
```
GET /api/v1/events/search?lat=-33.8688&lng=151.2093&radius=20&sport=golf&startDate=2026-01-15
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "events": [...]
  }
}
```

#### Join Event
```
POST /api/v1/events/{eventId}/join
Authorization: Bearer {token}

Response: 200 OK
```

#### Get My Events
```
GET /api/v1/events/my?filter=upcoming
Authorization: Bearer {token}

Response: 200 OK
```

### Social Feed

#### Get Feed
```
GET /api/v1/feed?page=1&limit=20
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "user": {...},
        "content": "Great game today!",
        "mediaUrls": [...],
        "likesCount": 15,
        "commentsCount": 3,
        "isLiked": false,
        "createdAt": "2026-01-08T10:30:00Z"
      }
    ]
  }
}
```

#### Create Post
```
POST /api/v1/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Looking for golf partners this weekend!",
  "sportId": "uuid",
  "visibility": "public"
}

Response: 201 Created
```

#### Like Post
```
POST /api/v1/posts/{postId}/like
Authorization: Bearer {token}

Response: 200 OK
```

### Messaging

#### Get Conversations
```
GET /api/v1/messages/conversations
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "participant": {...},
        "lastMessage": {
          "content": "See you tomorrow!",
          "createdAt": "..."
        },
        "unreadCount": 2
      }
    ]
  }
}
```

#### Get Messages
```
GET /api/v1/messages/conversations/{conversationId}?page=1&limit=50
Authorization: Bearer {token}

Response: 200 OK
```

#### Send Message
```
POST /api/v1/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "receiverId": "uuid",
  "content": "Hey, want to play golf tomorrow?"
}

Response: 201 Created
```

### Marketplace

#### Create Listing
```
POST /api/v1/marketplace/listings
Authorization: Bearer {token}
Content-Type: application/json

{
  "sportId": "uuid",
  "title": "Titleist Golf Clubs Set",
  "description": "Excellent condition...",
  "price": 450.00,
  "condition": "good",
  "category": "equipment",
  "brand": "Titleist",
  "location": {
    "city": "Sydney",
    "lat": -33.8688,
    "lng": 151.2093
  }
}

Response: 201 Created
```

#### Upload Listing Images
```
POST /api/v1/marketplace/listings/{listingId}/images
Authorization: Bearer {token}
Content-Type: multipart/form-data

files: [binary array]

Response: 200 OK
```

#### Search Listings
```
GET /api/v1/marketplace/search?sport=golf&maxPrice=500&condition=good&lat=-33.8688&lng=151.2093&radius=50
Authorization: Bearer {token}

Response: 200 OK
```

### Notifications

#### Get Notifications
```
GET /api/v1/notifications?page=1&limit=20&unreadOnly=true
Authorization: Bearer {token}

Response: 200 OK
```

#### Mark as Read
```
PUT /api/v1/notifications/{notificationId}/read
Authorization: Bearer {token}

Response: 200 OK
```

### Real-Time (SignalR)

#### WebSocket Connection
```
wss://api.sportfriends.com/hubs/chat
Authorization: Bearer {token}

// Client sends
{
  "type": "SendMessage",
  "conversationId": "uuid",
  "content": "Hello!"
}

// Server broadcasts
{
  "type": "ReceiveMessage",
  "conversationId": "uuid",
  "message": {...}
}
```

---

## Security

### Authentication & Authorization
- **JWT Tokens**: Short-lived access tokens (15 minutes), long-lived refresh tokens (7 days)
- **Password Requirements**: Minimum 8 characters, uppercase, lowercase, number, special character
- **Password Hashing**: BCrypt with salt rounds of 12
- **Token Storage**: Refresh tokens stored in httpOnly cookies or secure storage
- **Role-Based Access Control**: User, Moderator, Admin roles

### Data Protection
- **Encryption in Transit**: TLS 1.3 for all API communication
- **Encryption at Rest**: Database encryption, encrypted S3 buckets
- **PII Protection**: Separate table for sensitive data, access logging
- **Location Privacy**: Configurable location sharing, fuzzy location display

### API Security
- **Rate Limiting**: 
  - Authentication: 5 requests per 15 minutes per IP
  - API calls: 100 requests per minute per user
  - File uploads: 10 requests per hour per user
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries, ORM usage
- **XSS Prevention**: Content sanitization, CSP headers
- **CSRF Protection**: Anti-CSRF tokens for state-changing operations

### User Safety
- **Content Moderation**: Automated filters + manual review
- **Reporting System**: Report users, posts, listings
- **Blocking**: Users can block other users
- **Verification**: Optional identity verification for trusted users
- **Age Verification**: Birth date required, age restrictions

### Compliance
- **GDPR**: Data export, right to deletion, consent management
- **Privacy Policy**: Clear data usage policies
- **Terms of Service**: User agreements and acceptable use
- **Cookie Policy**: Cookie consent and management

---

## Infrastructure

### Development Environment
- **Local**: Docker Compose with PostgreSQL, Redis, Mailhog
- **Backend**: Visual Studio / VS Code + .NET 8 SDK
- **Frontend**: VS Code + Node.js 20+
- **Database Tools**: pgAdmin, DBeaver

### Staging Environment
- **Purpose**: Pre-production testing, client demos
- **Infrastructure**: Scaled-down production replica
- **Data**: Anonymized production data or synthetic data
- **Access**: Restricted to internal team and beta testers

### Production Environment
- **Hosting**: AWS / Azure / DigitalOcean
- **Compute**: 
  - API: Kubernetes cluster or App Service
  - Initial: 2-4 API instances behind load balancer
  - Auto-scaling based on CPU/memory
- **Database**:
  - PostgreSQL: Managed service with automated backups
  - Primary-replica setup for read scaling
  - Daily automated backups, 30-day retention
  - Point-in-time recovery enabled
- **Cache**: 
  - Redis cluster with persistence
  - Failover and high availability
- **Storage**:
  - S3/Blob Storage for media
  - CDN for global content delivery
- **Monitoring**:
  - Uptime monitoring (99.9% SLA target)
  - Performance monitoring (APM)
  - Log aggregation and analysis
  - Alerting for critical issues

### Deployment Strategy
- **Blue-Green Deployment**: Zero-downtime deployments
- **Database Migrations**: Automated with rollback capability
- **Feature Flags**: Gradual feature rollout, A/B testing
- **Backup Strategy**: 
  - Database: Automated daily backups
  - Media: S3 versioning and cross-region replication

### Disaster Recovery
- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 1 hour
- **Backup Locations**: Multi-region redundancy
- **Incident Response Plan**: Documented procedures

---

## Development Approach

### Phase 1: MVP (Months 1-3)

#### Sprint 1-2: Foundation (Weeks 1-4)
- [ ] Project setup and repository structure
- [ ] CI/CD pipeline configuration
- [ ] Database schema design and implementation
- [ ] Authentication system (register, login, JWT)
- [ ] Basic user profile CRUD

#### Sprint 3-4: Core Features (Weeks 5-8)
- [ ] Profile browsing with location filters
- [ ] User search with radius-based filtering
- [ ] Sport and interest management
- [ ] Friend request system
- [ ] Basic messaging (REST API)

#### Sprint 5-6: Events & Social (Weeks 9-12)
- [ ] Event creation and management
- [ ] Event search and discovery
- [ ] Join/leave events
- [ ] Social feed (posts)
- [ ] Like and comment functionality

#### Sprint 7: Marketplace (Weeks 13-14)
- [ ] Marketplace listing creation
- [ ] Image upload for listings
- [ ] Listing search and filters
- [ ] Contact seller functionality

#### Sprint 8: Polish & Testing (Weeks 15-16)
- [ ] Notifications system
- [ ] Real-time messaging (SignalR)
- [ ] UI/UX refinements
- [ ] Performance optimization
- [ ] Security audit
- [ ] Beta testing

### Phase 2: Enhancement (Months 4-6)
- [ ] Admin dashboard
- [ ] Content moderation tools
- [ ] Advanced search filters
- [ ] User analytics
- [ ] Email notifications
- [ ] Push notification infrastructure
- [ ] Ad integration preparation

### Phase 3: Native Apps (Months 7-12)
- [ ] iOS app development
- [ ] Android app development
- [ ] App store optimization
- [ ] In-app purchases for premium
- [ ] Native push notifications

### Development Best Practices

#### Code Quality
- **Linting**: ESLint (frontend), StyleCop (backend)
- **Formatting**: Prettier (frontend), EditorConfig (backend)
- **Code Reviews**: Required for all PRs
- **Testing**: 
  - Unit tests: 80%+ coverage target
  - Integration tests for critical paths
  - E2E tests for user journeys

#### Git Workflow
- **Branching**: GitFlow (main, develop, feature/*, hotfix/*)
- **Commits**: Conventional commits format
- **Pull Requests**: Description, screenshots, test plan
- **Protected Branches**: main and develop require PR approval

#### Documentation
- **API**: OpenAPI/Swagger documentation
- **Code**: XML comments (C#), JSDoc (TypeScript)
- **Architecture**: Architecture decision records (ADRs)
- **README**: Setup instructions, architecture overview

#### Testing Strategy
- **Unit Tests**: Jest (frontend), xUnit (backend)
- **Integration Tests**: Supertest (API), TestContainers (database)
- **E2E Tests**: Cypress or Playwright
- **Performance Tests**: k6 or JMeter for load testing

---

## Scalability Considerations

### Performance Targets
- **API Response Time**: < 200ms (p95)
- **Page Load Time**: < 2 seconds
- **Database Queries**: < 100ms (p95)
- **Concurrent Users**: 10,000+ support

### Scaling Strategy
- **Horizontal Scaling**: Stateless API servers, load balancing
- **Database Scaling**: Read replicas, connection pooling
- **Caching**: Redis for sessions, API responses, computed data
- **CDN**: Global content delivery for static assets
- **Media Optimization**: Image compression, lazy loading, responsive images

### Future Optimizations
- **Database Sharding**: If single database becomes bottleneck
- **Microservices**: Split monolith if specific domains need independent scaling
- **Message Queue**: RabbitMQ/SQS for async processing (emails, notifications)
- **Search Engine**: Elasticsearch for advanced search capabilities

---

## Maintenance & Support

### Monitoring
- **Application Performance**: Response times, error rates, throughput
- **Infrastructure**: CPU, memory, disk, network usage
- **Business Metrics**: User registrations, events created, messages sent
- **Alerts**: PagerDuty or similar for critical issues

### Logging
- **Structured Logging**: JSON format with correlation IDs
- **Log Levels**: Debug, Info, Warning, Error, Critical
- **Log Retention**: 30 days production, 7 days staging
- **Log Analysis**: ELK stack or cloud-native solution

### Support
- **In-App Support**: Help center, contact form
- **Email Support**: support@sportfriends.com
- **Response Times**: 24 hours for general, 4 hours for critical
- **Knowledge Base**: FAQs, tutorials, troubleshooting

---

## Appendices

### API Error Responses

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Email is required"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}
```

### Standard HTTP Status Codes
- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Validation error
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

---

**Document Version**: 1.0  
**Last Updated**: January 8, 2026  
**Next Review**: Sprint 4 completion
