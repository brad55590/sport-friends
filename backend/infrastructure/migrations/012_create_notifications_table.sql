-- Migration: 012_create_notifications_table.sql
-- Description: Create notifications table for user notifications
-- Date: 2026-01-08

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'friend_request', 'friend_accepted',
        'event_invitation', 'event_reminder', 'event_cancelled',
        'message_received',
        'post_liked', 'post_commented',
        'listing_inquiry', 'listing_sold',
        'profile_viewed',
        'user_mentioned'
    )),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    actor_id UUID REFERENCES users(id),
    related_entity_id UUID,
    related_entity_type VARCHAR(50),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    is_dismissed BOOLEAN DEFAULT FALSE,
    dismissed_at TIMESTAMP,
    
    -- Delivery
    send_email BOOLEAN DEFAULT TRUE,
    send_push BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_actor ON notifications(actor_id);

COMMENT ON TABLE notifications IS 'User notifications for various events';
