# Interest-Based Event Filtering Guide

## Overview

Inner City now uses intelligent interest-based filtering to prioritize events that match user interests while keeping less relevant events visible as "background noise."

## How It Works

### 1. Event Scoring System

Events are scored based on:
- **User Interest Matches** (highest weight)
  - Category matches: +10 points
  - Subcategory matches: +7 points
  - Title contains interest: +8 points
  - Description mentions interest: +5 points
  - Venue matches interest: +3 points

- **Event Quality**
  - Official/verified events: +5 points
  - High engagement (>50): +3 points
  - Moderate engagement (>20): +1 point
  - Has media/images: +2 points
  - Has location data: +1 point

- **Timing**
  - Happening within 7 days: +4 points
  - Happening within 14 days: +2 points
  - Too far in future (>90 days): -5 points

### 2. Priority Levels

Events are categorized into three priority levels:

- **High Priority** (score ≥ 15): Front and center
- **Medium Priority** (score 8-14): Still prominent
- **Low Priority** (score < 8): Background noise (reduced opacity)

### 3. Display Strategy

**Priority Events:**
- Shown first in the feed
- Full opacity and visibility
- Appear in "Now Peaking" section
- Normal styling

**Background Events:**
- Shown after priority events
- 40% opacity (60% opacity on hover)
- Grouped under "More Events" section
- Still clickable and accessible

## User Interests

### Current Mock User Interests
```typescript
interests: ['Techno', 'Hardcore', 'Berlin', 'Vinyl']
```

### How to Update Interests

Users can update their interests in the Profile or Settings screen. The ranking system automatically updates when interests change.

### Interest Keywords

The system expands interests with related keywords:
- `techno` → electronic, edm, rave, warehouse, underground
- `house` → deep house, tech house, electronic
- `hip hop` → rap, urban, r&b
- `sports` → game, match, tournament
- etc.

## Example Scoring

**High-Scoring Event (Priority):**
- Title: "Warehouse Techno Night"
- User Interest: "Techno"
- Score: 8 (title) + 10 (category) + 4 (soon) + 2 (media) = **24 points** → **High Priority**

**Low-Scoring Event (Background):**
- Title: "Jazz Concert"
- User Interest: "Techno"
- Score: 0 (no matches) + 2 (media) = **2 points** → **Low Priority**

## Customization

### Adjusting Scoring Weights

Edit `services/eventRanking.ts` → `calculateEventScore()`:
```typescript
// Increase weight for category matches
if (event.categories?.some(cat => cat.toLowerCase().includes(interestLower))) {
  score += 15; // Increased from 10
}
```

### Changing Priority Thresholds

Edit `services/eventRanking.ts` → `rankEventsByInterest()`:
```typescript
// Make it easier to get high priority
if (score >= 10) { // Changed from 15
  priority = 'high';
}
```

### Adjusting Background Opacity

Edit `screens/Feed.tsx`:
```typescript
// Make background events more visible
<div className="flex flex-col opacity-60"> // Changed from opacity-40
```

## Testing

1. **Check User Interests:**
   - Go to Profile screen
   - Verify interests are set

2. **View Feed:**
   - Priority events should appear first
   - Background events should have reduced opacity
   - "More Events" section should appear if background events exist

3. **Update Interests:**
   - Change interests in Profile/Settings
   - Feed should automatically re-rank events

## Benefits

✅ **Personalized Feed** - See what matters to you first
✅ **No Events Hidden** - Everything still accessible
✅ **Smart Ranking** - Considers multiple factors
✅ **Automatic Updates** - Re-ranks when interests change
✅ **Visual Hierarchy** - Clear distinction between priority and background

## Future Enhancements

- Machine learning for better interest matching
- User feedback (thumbs up/down) to improve ranking
- Interest categories (music genres, event types, etc.)
- Location-based interest weighting
- Time-of-day preferences
- Social signals (friends' interests)
