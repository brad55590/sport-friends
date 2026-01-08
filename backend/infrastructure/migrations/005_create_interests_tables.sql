-- Migration: 005_create_interests_tables.sql
-- Description: Create interests and user_interests tables for user profile enrichment
-- Date: 2026-01-08

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

-- Sample interests data
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
COMMENT ON TABLE user_interests IS 'User interest selections';
