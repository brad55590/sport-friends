-- Migration: 007_create_events_table.sql
-- Description: Create events table for sports events and meetups
-- Date: 2026-01-08

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
    location_details TEXT,
    
    -- Capacity
    max_attendees INT,
    current_attendees INT DEFAULT 0,
    
    -- Additional
    cost DECIMAL(10, 2) DEFAULT 0,
    cost_currency VARCHAR(3) DEFAULT 'USD',
    image_url VARCHAR(500),
    external_link VARCHAR(500),
    
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
EXECUTE FUNCTION update_profile_location();

COMMENT ON TABLE events IS 'Sports events and meetups';
COMMENT ON COLUMN events.cost IS 'Cost per person in local currency';
