-- Migration: 011_create_marketplace_listings_table.sql
-- Description: Create marketplace_listings table for second-hand sports equipment trading
-- Date: 2026-01-08

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
    images TEXT[],
    
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
