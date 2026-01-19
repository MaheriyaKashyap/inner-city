-- Extend user_posts table to support Pulse feed post types
-- Adds type, expires_at, location fields, and city_id for filtering

-- Add new columns to user_posts
ALTER TABLE public.user_posts
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'post' CHECK (type IN ('post', 'checkin', 'plan', 'spot', 'drop')),
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS lat DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS lng DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS place_name TEXT,
ADD COLUMN IF NOT EXISTS city_id TEXT REFERENCES public.cities(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

-- Update existing posts to have type 'post'
UPDATE public.user_posts SET type = 'post' WHERE type IS NULL;

-- Create indexes for feed queries
-- Note: Time-based filtering (expires_at > NOW()) is done in queries, not in index predicates
-- because NOW() is not IMMUTABLE
CREATE INDEX IF NOT EXISTS idx_user_posts_city_type_created ON public.user_posts(city_id, type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_posts_city_expires ON public.user_posts(city_id, expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_posts_user_type_created ON public.user_posts(user_id, type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_posts_organization ON public.user_posts(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_posts_non_expiring ON public.user_posts(city_id, created_at DESC) WHERE expires_at IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.user_posts.type IS 'Post type: post (general), checkin (event check-in), plan (ephemeral plan), spot (location recommendation), drop (curator drop)';
COMMENT ON COLUMN public.user_posts.expires_at IS 'For ephemeral content (plan/drop), content expires after this time';
COMMENT ON COLUMN public.user_posts.city_id IS 'City where post is relevant, for filtering Pulse feed by city';
