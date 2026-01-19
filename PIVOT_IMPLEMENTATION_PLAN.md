# Inner City Pivot: Event Discovery → City Pulse Social Media

## Implementation Plan

### Phase 1: Database Schema Updates
1. ✅ Extend `user_posts` table with new columns
2. ✅ Create `saved_items` table (generic saves)
3. ✅ Add indexes for feed queries

### Phase 2: Type System Updates
4. ✅ Update TypeScript types for new post types and recommendations

### Phase 3: Backend Services
5. ✅ Create `services/eventRecommendations.ts` with scoring algorithm
6. ✅ Create `services/pulse.ts` for unified feed aggregation
7. ✅ Update `services/social.ts` to support new post types

### Phase 4: UI Updates
8. ✅ Transform `screens/Feed.tsx` → Pulse feed with card types
9. ✅ Update `screens/MapScreen.tsx` for activity-first view
10. ✅ Transform `screens/Saved.tsx` → Plans screen
11. ✅ Update navigation in `components/Layout.tsx`

### Phase 5: Integration
12. ✅ Update `store.tsx` to use pulse feed
13. ✅ Update `App.tsx` routing if needed

---

## Step-by-Step Implementation

### Step 1: Database Migrations

#### Migration 1: Extend user_posts
- Add `type` column (post|checkin|plan|spot|drop)
- Add `expires_at` column (nullable TIMESTAMPTZ)
- Add location fields: `lat`, `lng`, `address`, `place_name` (nullable)
- Add `city_id` reference for filtering
- Add `organization_id` for curator drops

#### Migration 2: Create saved_items table
- Generic saves: (user_id, item_type, item_id)
- Supports events, posts, plans, spots

#### Migration 3: Add indexes
- user_posts: (city_id, type, created_at DESC, expires_at)
- user_posts: (user_id, type, created_at DESC)
- event_attendees: (event_id, user_id, is_public)
- follows: (follower_id, following_id)

### Step 2: TypeScript Types
- Add `PostType` union type
- Extend `UserPost` interface
- Add `RecommendedEvent` interface with score/reasons
- Add `PulseItem` union type

### Step 3: Event Recommendations Service
- Implement scoring algorithm with configurable weights
- Batch queries for performance
- Return events with scores and reasons

### Step 4: Pulse Service
- Aggregate posts, check-ins, drops, plans, spots
- Interleave recommended events (sparse)
- Rank by recency, engagement, proximity

### Step 5: UI Components
- Create card components: PostCard, CheckinCard, PlanCard, SpotCard, DropCard, EventCard
- Add quick composer modal
- Update feed to render different card types

### Step 6: Navigation Updates
- Rename "Feed" → "Pulse"
- Rename "Map" → "Live Map"
- Rename "Saved" → "Plans"
- Reorder tabs: Pulse, Live Map, Plans, Profile

---

## Implementation Order

1. Database migrations (foundation)
2. Type updates (compile-time safety)
3. Backend services (data layer)
4. UI components (presentation)
5. Integration (wire everything together)
