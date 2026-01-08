-- Migration: 004_create_sports_and_user_sports_tables.sql
-- Description: Create sports table and user_sports preference table
-- Date: 2026-01-08

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

-- Initial sports data
INSERT INTO sports (name, slug, description, display_order) VALUES
    ('Golf', 'golf', 'Connect with golfers for rounds at local courses', 1),
    ('Netball', 'netball', 'Find netball teams, players and training sessions', 2);

-- User Sports Preferences Table
CREATE TABLE user_sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_experience INT,
    frequency VARCHAR(20) CHECK (frequency IN ('daily', 'weekly', 'monthly', 'occasionally')),
    preferred_days TEXT[],
    preferred_times TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, sport_id)
);

-- Indexes
CREATE INDEX idx_user_sports_user_id ON user_sports(user_id);
CREATE INDEX idx_user_sports_sport_id ON user_sports(sport_id);
CREATE INDEX idx_user_sports_skill_level ON user_sports(skill_level);

COMMENT ON TABLE sports IS 'Available sports on the platform';
COMMENT ON TABLE user_sports IS 'User sport preferences and skill levels';
