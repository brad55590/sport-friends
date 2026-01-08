-- Migration: 003_create_profiles_table.sql
-- Description: Create profiles table for user profile information and preferences
-- Date: 2026-01-08

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
    location GEOGRAPHY(POINT, 4326),
    
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

-- Trigger to automatically update location from lat/lng
CREATE TRIGGER trigger_update_profile_location
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_location();

COMMENT ON TABLE profiles IS 'User profile information and preferences';
COMMENT ON COLUMN profiles.location IS 'PostGIS geography point for efficient distance calculations';
