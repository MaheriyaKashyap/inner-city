-- Add indexes for feed queries and recommendation scoring
-- Optimizes queries for Pulse feed and event recommendations

-- Indexes for event recommendations (follow graph queries)
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_user_public ON public.event_attendees(event_id, user_id, is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_status ON public.event_attendees(user_id, status) WHERE is_public = true;

-- Indexes for follows (used in recommendation scoring)
CREATE INDEX IF NOT EXISTS idx_follows_follower_following ON public.follows(follower_id, following_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_follower ON public.follows(following_id, follower_id);

-- Indexes for events (city and time filtering)
-- Note: Time-based filtering (start_at > NOW()) is done in queries, not in index predicates
-- because NOW() is not IMMUTABLE
CREATE INDEX IF NOT EXISTS idx_events_city_start_status ON public.events(city_id, start_at, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_events_city_start ON public.events(city_id, start_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_events_categories ON public.events USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_events_subcategories ON public.events USING GIN(subcategories);

-- Index for user_posts with event reference (for post counts per event)
CREATE INDEX IF NOT EXISTS idx_user_posts_event_type ON public.user_posts(event_id, type) WHERE event_id IS NOT NULL;
