-- Migration: 006_create_friendships_table.sql
-- Description: Create friendships table for friend connections and requests
-- Date: 2026-01-08

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
