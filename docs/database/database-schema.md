# SportFriends - Database Schema Design

## Document Information
- **Version**: 1.0
- **Date**: January 8, 2026
- **Database**: PostgreSQL 16+ with PostGIS extension

---

## Table of Contents
1. [Schema Overview](#schema-overview)
2. [Core Tables](#core-tables)
3. [Relationships](#relationships)
4. [Indexes](#indexes)
5. [Constraints](#constraints)
6. [Sample Queries](#sample-queries)
7. [Migration Strategy](#migration-strategy)

---

## Schema Overview

### Extensions Required
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### Schema Diagram

```
┌─────────────┐
│    users    │
└──────┬──────┘
       │
       ├──────────────────────────────┐
       │                              │
       ▼                              ▼
┌──────────────┐              ┌──────────────┐
│   profiles    │              │ friendships  │
└──────┬───────┘              └──────────────┘
       │
       ├─────────┬─────────┬────────────┬─────────────┐
       │         │         │            │             │
       ▼         ▼         ▼            ▼             ▼
┌─────────┐  ┌───────┐  ┌────-───┐  ┌─────────┐  ┌─────────-─┐
│  posts  │  │events │  │messages│  │listings │  │user_sports│
└─────────┘  └───────┘  └────────┘  └─────────┘  └──────────-┘
       │         │                                     │
       ▼         ▼                                     ▼
┌─────────┐  ┌──────────────┐                  ┌───────────┐
│post_    │  │event_        │                  │  sports   │
│likes    │  │attendees     │                  └───────────┘
└─────────┘  └──────────────┘
       │
       ▼
┌──────────┐
│post_     │
│comments  │
└──────────┘
```

---

## Core Tables

### 1. Users Table
Core authentication and account information.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status) WHERE status = 'active';
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Comments
COMMENT ON TABLE users IS 'Core user authentication and account table';
COMMENT ON COLUMN users.status IS 'active: normal user, suspended: temporarily banned, deleted: soft delete';
COMMENT ON COLUMN users.role IS 'user: regular user, moderator: can moderate content, admin: full access';
```

---

### 2. Profiles Table
User profile information and preferences.

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    date_of_birth DATE,
    gender VARCHAR(20),
    
    -- Location fields
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_country VARCHAR(100),
    location_display VARCHAR(255),
    location GEOGRAPHY(POINT, 4326), -- PostGIS geography type
    
    -- Privacy settings
    privacy_show_location BOOLEAN DEFAULT TRUE,
    privacy_show_age BOOLEAN DEFAULT TRUE,
    privacy_profile_visibility VARCHAR(20) DEFAULT 'public' CHECK (privacy_profile_visibility IN ('public', 'friends', 'private')),
    privacy_last_seen VARCHAR(20) DEFAULT 'everyone' CHECK (privacy_last_seen IN ('everyone', 'friends', 'nobody')),
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verification_document_url VARCHAR(500),
    verified_at TIMESTAMP,
    
    -- Activity tracking
    last_active_at TIMESTAMP DEFAULT NOW(),
    profile_completion_percentage INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_location_gist ON profiles USING GIST(location);
CREATE INDEX idx_profiles_location_coords ON profiles(location_lat, location_lng);
CREATE INDEX idx_profiles_last_active ON profiles(last_active_at DESC);
CREATE INDEX idx_profiles_verified ON profiles(is_verified) WHERE is_verified = TRUE;

-- Full-text search on names
CREATE INDEX idx_profiles_display_name_trgm ON profiles USING GIN (display_name gin_trgm_ops);

-- Function to update location geography from lat/lng
CREATE OR REPLACE FUNCTION update_profile_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.location_lat IS NOT NULL AND NEW.location_lng IS NOT NULL THEN
        NEW.location := ST_SetSRID(ST_MakePoint(NEW.location_lng, NEW.location_lat), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profile_location
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_location();

COMMENT ON TABLE profiles IS 'User profile information and preferences';
COMMENT ON COLUMN profiles.location IS 'PostGIS geography point for efficient distance calculations';
```

---

### 3. Sports Table
Available sports on the platform.

```sql
CREATE TABLE sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    total_users INT DEFAULT 0,
    total_events INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sports_slug ON sports(slug);
CREATE INDEX idx_sports_is_active ON sports(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_sports_display_order ON sports(display_order);

-- Initial data
INSERT INTO sports (name, slug, description, display_order) VALUES
    ('Golf', 'golf', 'Connect with golfers for rounds at local courses', 1),
    ('Netball', 'netball', 'Find netball teams, players and training sessions', 2);

COMMENT ON TABLE sports IS 'Available sports on the platform';
```

---

### 4. User Sports Table
User's sports preferences and skill levels.

```sql
CREATE TABLE user_sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_experience INT,
    frequency VARCHAR(20) CHECK (frequency IN ('daily', 'weekly', 'monthly', 'occasionally')),
    preferred_days TEXT[], -- ['monday', 'wednesday', 'saturday']
    preferred_times TEXT[], -- ['morning', 'afternoon', 'evening']
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, sport_id)
);

-- Indexes
CREATE INDEX idx_user_sports_user_id ON user_sports(user_id);
CREATE INDEX idx_user_sports_sport_id ON user_sports(sport_id);
CREATE INDEX idx_user_sports_skill_level ON user_sports(skill_level);

COMMENT ON TABLE user_sports IS 'User sport preferences and skill levels';
```

---

### 5. Interests Table
General interests for user matching.

```sql
CREATE TABLE interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interest_id UUID NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, interest_id)
);

-- Indexes
CREATE INDEX idx_interests_category ON interests(category);
CREATE INDEX idx_interests_usage_count ON interests(usage_count DESC);
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_interests_interest_id ON user_interests(interest_id);

-- Sample data
INSERT INTO interests (name, category) VALUES
    ('Travel', 'lifestyle'),
    ('Photography', 'hobbies'),
    ('Cooking', 'hobbies'),
    ('Music', 'entertainment'),
    ('Fitness', 'health'),
    ('Reading', 'hobbies'),
    ('Movies', 'entertainment'),
    ('Technology', 'interests'),
    ('Nature', 'lifestyle'),
    ('Food', 'lifestyle');

COMMENT ON TABLE interests IS 'General interests for user profile enrichment';
```

---

### 6. Friendships Table
Friend connections and requests.

```sql
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
    requested_at TIMESTAMP DEFAULT NOW(),
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT no_self_friendship CHECK (requester_id != addressee_id),
    UNIQUE(requester_id, addressee_id)
);

-- Indexes
CREATE INDEX idx_friendships_requester ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX idx_friendships_status ON friendships(status);
CREATE INDEX idx_friendships_both_users ON friendships(requester_id, addressee_id);

-- Function to get all friends for a user (accepted friendships)
CREATE OR REPLACE FUNCTION get_user_friends(user_uuid UUID)
RETURNS TABLE(friend_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT addressee_id FROM friendships 
    WHERE requester_id = user_uuid AND status = 'accepted'
    UNION
    SELECT requester_id FROM friendships 
    WHERE addressee_id = user_uuid AND status = 'accepted';
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE friendships IS 'Friend relationships and requests';
```

---

### 7. Events Table
Sports events and meetups.

```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES users(id),
    sport_id UUID NOT NULL REFERENCES sports(id),
    
    -- Event details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(20) DEFAULT 'casual' CHECK (event_type IN ('casual', 'competitive', 'training', 'tournament')),
    skill_level VARCHAR(20) CHECK (skill_level IN ('any', 'beginner', 'intermediate', 'advanced', 'expert')),
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
    
    -- Date and time
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Location
    location_name VARCHAR(255),
    location_address TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location GEOGRAPHY(POINT, 4326),
    location_details TEXT, -- parking, entry instructions, etc.
    
    -- Capacity
    max_attendees INT,
    current_attendees INT DEFAULT 0,
    
    -- Additional
    cost DECIMAL(10, 2) DEFAULT 0,
    cost_currency VARCHAR(3) DEFAULT 'USD',
    image_url VARCHAR(500),
    external_link VARCHAR(500), -- link to venue, registration, etc.
    
    -- Status
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    cancelled_reason TEXT,
    cancelled_at TIMESTAMP,
    
    -- Metadata
    views_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_creator ON events(creator_id);
CREATE INDEX idx_events_sport ON events(sport_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_visibility ON events(visibility);
CREATE INDEX idx_events_location_gist ON events USING GIST(location);
CREATE INDEX idx_events_skill_level ON events(skill_level);
CREATE INDEX idx_events_featured ON events(is_featured) WHERE is_featured = TRUE;

-- Trigger to update location
CREATE TRIGGER trigger_update_event_location
BEFORE INSERT OR UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_profile_location(); -- Reuse same function

COMMENT ON TABLE events IS 'Sports events and meetups';
COMMENT ON COLUMN events.cost IS 'Cost per person in local currency';
```

---

### 8. Event Attendees Table
Event participation tracking.

```sql
CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'declined')),
    joined_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Indexes
CREATE INDEX idx_event_attendees_event ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user ON event_attendees(user_id);
CREATE INDEX idx_event_attendees_status ON event_attendees(status);

-- Trigger to update event attendee count
CREATE OR REPLACE FUNCTION update_event_attendees_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'going' THEN
        UPDATE events SET current_attendees = current_attendees + 1 WHERE id = NEW.event_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'going' AND NEW.status = 'going' THEN
            UPDATE events SET current_attendees = current_attendees + 1 WHERE id = NEW.event_id;
        ELSIF OLD.status = 'going' AND NEW.status != 'going' THEN
            UPDATE events SET current_attendees = current_attendees - 1 WHERE id = NEW.event_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'going' THEN
        UPDATE events SET current_attendees = current_attendees - 1 WHERE id = OLD.event_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_attendees_count
AFTER INSERT OR UPDATE OR DELETE ON event_attendees
FOR EACH ROW
EXECUTE FUNCTION update_event_attendees_count();

COMMENT ON TABLE event_attendees IS 'Event participation tracking';
```

---

### 9. Posts Table
Social feed posts.

```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sport_id UUID REFERENCES sports(id),
    media_urls TEXT[], -- array of Azure Blob Storage URLs
    media_types TEXT[], -- ['image', 'image', 'video']
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
    
    -- Engagement
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    
    -- Moderation
    is_reported BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_sport_id ON posts(sport_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_visibility ON posts(visibility);
CREATE INDEX idx_posts_moderation ON posts(moderation_status) WHERE moderation_status = 'pending';

COMMENT ON TABLE posts IS 'User posts in social feed';
```

---

### 10. Post Likes Table

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

-- Trigger to update likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_likes_count
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW
EXECUTE FUNCTION update_post_likes_count();
```

---

### 11. Post Comments Table

```sql
CREATE TABLE post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_post_comments_post ON post_comments(post_id);
CREATE INDEX idx_post_comments_user ON post_comments(user_id);
CREATE INDEX idx_post_comments_parent ON post_comments(parent_comment_id);
CREATE INDEX idx_post_comments_created ON post_comments(created_at);

-- Trigger to update comments count
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.is_deleted = FALSE THEN
        UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.is_deleted = FALSE AND NEW.is_deleted = TRUE THEN
        UPDATE posts SET comments_count = comments_count - 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' AND OLD.is_deleted = FALSE THEN
        UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_comments_count
AFTER INSERT OR UPDATE OR DELETE ON post_comments
FOR EACH ROW
EXECUTE FUNCTION update_post_comments_count();
```

---

### 12. Conversations & Messages Tables

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_one_id UUID NOT NULL REFERENCES users(id),
    participant_two_id UUID NOT NULL REFERENCES users(id),
    last_message_id UUID,
    last_message_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT no_self_conversation CHECK (participant_one_id != participant_two_id)
);

-- Ensure unique conversation regardless of order
CREATE UNIQUE INDEX idx_conversations_unique 
ON conversations (LEAST(participant_one_id, participant_two_id), GREATEST(participant_one_id, participant_two_id));

CREATE INDEX idx_conversations_participant_one ON conversations(participant_one_id);
CREATE INDEX idx_conversations_participant_two ON conversations(participant_two_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    is_deleted_by_sender BOOLEAN DEFAULT FALSE,
    is_deleted_by_receiver BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read) WHERE is_read = FALSE;

-- Trigger to update conversation last_message
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET last_message_id = NEW.id, last_message_at = NEW.created_at 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_last_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();

COMMENT ON TABLE conversations IS 'One-on-one conversations between users';
COMMENT ON TABLE messages IS 'Direct messages within conversations';
```

---

### 13. Marketplace Listings Table

```sql
CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sport_id UUID NOT NULL REFERENCES sports(id),
    
    -- Listing details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    condition VARCHAR(20) CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
    category VARCHAR(50) CHECK (category IN ('equipment', 'apparel', 'accessories', 'other')),
    brand VARCHAR(100),
    size VARCHAR(50),
    color VARCHAR(50),
    images TEXT[], -- array of Azure Blob Storage URLs
    
    -- Location
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_country VARCHAR(100),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location GEOGRAPHY(POINT, 4326),
    shipping_available BOOLEAN DEFAULT FALSE,
    local_pickup_only BOOLEAN DEFAULT TRUE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'deleted')),
    sold_to_user_id UUID REFERENCES users(id),
    sold_at TIMESTAMP,
    
    -- Engagement
    views_count INT DEFAULT 0,
    inquiries_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Expiry
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '60 days'),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_marketplace_user ON marketplace_listings(user_id);
CREATE INDEX idx_marketplace_sport ON marketplace_listings(sport_id);
CREATE INDEX idx_marketplace_status ON marketplace_listings(status);
CREATE INDEX idx_marketplace_price ON marketplace_listings(price);
CREATE INDEX idx_marketplace_condition ON marketplace_listings(condition);
CREATE INDEX idx_marketplace_location_gist ON marketplace_listings USING GIST(location);
CREATE INDEX idx_marketplace_created_at ON marketplace_listings(created_at DESC);
CREATE INDEX idx_marketplace_featured ON marketplace_listings(is_featured) WHERE is_featured = TRUE;

-- Trigger for location
CREATE TRIGGER trigger_update_listing_location
BEFORE INSERT OR UPDATE ON marketplace_listings
FOR EACH ROW
EXECUTE FUNCTION update_profile_location();

COMMENT ON TABLE marketplace_listings IS 'Second-hand sports equipment marketplace';
```

---

### 14. Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification details
    type VARCHAR(50) NOT NULL, -- friend_request, message, event_join, event_reminder, post_like, post_comment
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link VARCHAR(500), -- deep link or URL to relevant content
    
    -- Related entities (nullable, depends on type)
    related_user_id UUID REFERENCES users(id),
    related_event_id UUID REFERENCES events(id),
    related_post_id UUID REFERENCES posts(id),
    related_listing_id UUID REFERENCES marketplace_listings(id),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Delivery
    is_push_sent BOOLEAN DEFAULT FALSE,
    is_email_sent BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

COMMENT ON TABLE notifications IS 'In-app and push notifications';
```

---

### 15. User Blocks & Reports Tables

```sql
CREATE TABLE user_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id),
    CONSTRAINT no_self_block CHECK (blocker_id != blocked_id)
);

CREATE INDEX idx_user_blocks_blocker ON user_blocks(blocker_id);
CREATE INDEX idx_user_blocks_blocked ON user_blocks(blocked_id);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id),
    reported_user_id UUID REFERENCES users(id),
    reported_post_id UUID REFERENCES posts(id),
    reported_event_id UUID REFERENCES events(id),
    reported_listing_id UUID REFERENCES marketplace_listings(id),
    
    report_type VARCHAR(50) NOT NULL, -- spam, harassment, inappropriate, scam, other
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
    moderator_notes TEXT,
    resolved_by_user_id UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

COMMENT ON TABLE user_blocks IS 'Blocked user relationships';
COMMENT ON TABLE reports IS 'User reports for content moderation';
```

---

## Sample Queries

### 1. Find users within radius by sport

```sql
-- Find golfers within 10km of a location
SELECT 
    u.id,
    p.display_name,
    p.avatar_url,
    p.bio,
    us.skill_level,
    ST_Distance(p.location, ST_SetSRID(ST_MakePoint(-73.9857, 40.7580), 4326)::geography) / 1000 AS distance_km
FROM users u
JOIN profiles p ON u.id = p.user_id
JOIN user_sports us ON u.id = us.user_id
JOIN sports s ON us.sport_id = s.id
WHERE 
    u.status = 'active'
    AND s.slug = 'golf'
    AND p.location IS NOT NULL
    AND ST_DWithin(
        p.location,
        ST_SetSRID(ST_MakePoint(-73.9857, 40.7580), 4326)::geography,
        10000 -- 10km in meters
    )
ORDER BY distance_km ASC
LIMIT 20;
```

### 2. Get user's feed (friends + public posts nearby)

```sql
-- Get feed posts for user
WITH user_location AS (
    SELECT location FROM profiles WHERE user_id = '...'
),
user_friends AS (
    SELECT * FROM get_user_friends('...') -- user_id
)
SELECT DISTINCT
    p.id,
    p.content,
    p.media_urls,
    p.likes_count,
    p.comments_count,
    p.created_at,
    u.id AS author_id,
    pr.display_name,
    pr.avatar_url
FROM posts p
JOIN users u ON p.user_id = u.id
JOIN profiles pr ON u.id = pr.user_id
WHERE 
    p.is_hidden = FALSE
    AND (
        -- Posts from friends
        (p.visibility = 'friends' AND p.user_id IN (SELECT friend_id FROM user_friends))
        OR
        -- Public posts from users within 50km
        (p.visibility = 'public' AND pr.location IS NOT NULL AND 
         ST_DWithin(pr.location, (SELECT location FROM user_location), 50000))
    )
ORDER BY p.created_at DESC
LIMIT 20;
```

### 3. Search events by location and sport

```sql
-- Find golf events in next 30 days within 25km
SELECT 
    e.id,
    e.title,
    e.description,
    e.start_time,
    e.location_name,
    e.current_attendees,
    e.max_attendees,
    ST_Distance(e.location, ST_SetSRID(ST_MakePoint(-73.9857, 40.7580), 4326)::geography) / 1000 AS distance_km,
    p.display_name AS creator_name,
    p.avatar_url AS creator_avatar,
    EXISTS(
        SELECT 1 FROM event_attendees ea 
        WHERE ea.event_id = e.id AND ea.user_id = '...' AND ea.status = 'going'
    ) AS is_joined
FROM events e
JOIN profiles p ON e.creator_id = p.user_id
JOIN sports s ON e.sport_id = s.id
WHERE 
    e.status = 'upcoming'
    AND s.slug = 'golf'
    AND e.start_time BETWEEN NOW() AND NOW() + INTERVAL '30 days'
    AND (e.visibility = 'public' OR e.creator_id = '...')
    AND ST_DWithin(
        e.location,
        ST_SetSRID(ST_MakePoint(-73.9857, 40.7580), 4326)::geography,
        25000
    )
    AND (e.max_attendees IS NULL OR e.current_attendees < e.max_attendees)
ORDER BY e.start_time ASC, distance_km ASC
LIMIT 20;
```

### 4. Get marketplace listings with distance

```sql
-- Find golf equipment listings under $500 within 50km
SELECT 
    ml.id,
    ml.title,
    ml.price,
    ml.currency,
    ml.condition,
    ml.images,
    ml.created_at,
    ST_Distance(ml.location, ST_SetSRID(ST_MakePoint(-73.9857, 40.7580), 4326)::geography) / 1000 AS distance_km,
    p.display_name AS seller_name,
    p.avatar_url AS seller_avatar
FROM marketplace_listings ml
JOIN profiles p ON ml.user_id = p.user_id
JOIN sports s ON ml.sport_id = s.id
WHERE 
    ml.status = 'active'
    AND s.slug = 'golf'
    AND ml.price <= 500
    AND ST_DWithin(
        ml.location,
        ST_SetSRID(ST_MakePoint(-73.9857, 40.7580), 4326)::geography,
        50000
    )
ORDER BY ml.created_at DESC
LIMIT 24;
```

### 5. Get mutual friends count

```sql
-- Count mutual friends between two users
SELECT COUNT(*) AS mutual_friends_count
FROM (
    SELECT friend_id FROM get_user_friends('user1_id')
    INTERSECT
    SELECT friend_id FROM get_user_friends('user2_id')
) AS mutual;
```

---

## Migration Strategy

### Phase 1: Initial Schema (Week 1)
- Core tables: users, profiles, sports
- Authentication and basic profile functionality

### Phase 2: Social Features (Week 2-3)
- friendships, user_sports, user_interests, interests
- User discovery and connection features

### Phase 3: Events & Messaging (Week 4-6)
- events, event_attendees, conversations, messages
- Real-time communication setup

### Phase 4: Content & Commerce (Week 7-9)
- posts, post_likes, post_comments
- marketplace_listings
- Social feed and marketplace

### Phase 5: Notifications & Moderation (Week 10-12)
- notifications, user_blocks, reports
- Safety and engagement features

### Migration Best Practices
1. **Version Control**: Use EF Core migrations with meaningful names
2. **Rollback Plan**: Test rollback for every migration
3. **Data Preservation**: Never drop columns without backup
4. **Zero Downtime**: Use backwards-compatible changes
5. **Seed Data**: Include sample data for testing
6. **Index Strategy**: Add indexes after data insertion in production

---

## Performance Optimization

### Recommended Indexes (Already included above)
- Spatial indexes (GIST) for all geography columns
- Composite indexes for common query patterns
- Partial indexes for filtered queries (e.g., active users only)

### Caching Strategy
- User profiles: 5 minutes
- Search results: 2 minutes
- Event lists: 5 minutes
- Feed content: 2 minutes

### Query Optimization
- Use EXPLAIN ANALYZE for slow queries
- Consider materialized views for complex aggregations
- Implement pagination for all list queries
- Use connection pooling (pgBouncer recommended)

---

**Document Version**: 1.0  
**Last Updated**: January 8, 2026  
**Next Review**: After schema implementation
