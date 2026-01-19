# Pulse Pivot Implementation Guide

## Summary of Changes

### ✅ Completed Backend
1. Database migrations (022, 023, 024)
2. Type system updates
3. Event recommendations service
4. Pulse feed service
5. Social service updates

### 🔄 In Progress: Frontend
1. Feed.tsx → Pulse feed with card types
2. MapScreen.tsx → Activity-first view
3. Saved.tsx → Plans screen
4. Navigation labels updated ✅

## Key Changes Needed in Feed.tsx

### 1. Replace event/post fetching with Pulse service
```typescript
// OLD:
const feedPosts = await getFeedPosts(user?.id);
const displayEvents = useMemo(() => { ... });

// NEW:
const pulseFeed = await getPulseFeed({
  userId: user?.id || '',
  cityId: activeCity.id,
  limit: 50,
  includeEvents: true,
  eventInterleaveRatio: 10,
});
```

### 2. Add card components for different post types
- `PostCard` (existing, update for new types)
- `CheckinCard` - Shows check-in with event info
- `PlanCard` - Ephemeral plan posts
- `SpotCard` - Location recommendations
- `DropCard` - Curator drops
- `EventCard` (existing, update to show recommendation reasons)

### 3. Add quick composer
- Quick action buttons: "Post", "Check in", "Make a plan", "Recommend a spot"
- Modal for each post type

### 4. Update rendering logic
- Render PulseItems based on type
- Show "Recommended" section for top events
- Interleave events sparsely

## Next Steps

1. Update Feed.tsx to use pulse service
2. Create card components for each post type
3. Add quick composer UI
4. Update MapScreen.tsx for activity view
5. Update Saved.tsx to Plans screen
