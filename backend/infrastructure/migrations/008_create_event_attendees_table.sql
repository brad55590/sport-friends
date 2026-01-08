-- Migration: 008_create_event_attendees_table.sql
-- Description: Create event_attendees table for event participation tracking
-- Date: 2026-01-08

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
