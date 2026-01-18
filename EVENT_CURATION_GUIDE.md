# Event Curation Guide

## Overview

Inner City now aggregates events from multiple sources to provide comprehensive city-wide event discovery. The system combines:

- **Ticketmaster Discovery API** - Large-scale concerts, sports, theater, and official events
- **Eventbrite API** - Community events, underground parties, workshops, and smaller venues
- **Future sources** - Easy to add more (Songkick, Bandsintown, Facebook Events, etc.)

## How It Works

### 1. Event Aggregator Service

The `eventAggregator.ts` service:
- Fetches events from multiple sources simultaneously
- Deduplicates events (same title, date, venue)
- Filters to only upcoming events
- Sorts by date (soonest first)
- Combines results into a unified feed

### 2. Current Sources

#### Ticketmaster
- **Categories**: Music, Sports, Arts, Theater, Comedy, etc.
- **Coverage**: Major venues and official events
- **Rate Limit**: 5,000/day, 5/sec
- **Setup**: Already configured ✅

#### Eventbrite
- **Categories**: Community events, underground parties, workshops
- **Coverage**: Smaller venues, independent organizers
- **Rate Limit**: 2,000/hour
- **Setup**: Requires API token + organization IDs (see `EVENTBRITE_SETUP.md`)

### 3. Event Categories

The system now fetches events from multiple categories:
- **Music** - Concerts, DJ sets, live music
- **Sports** - Games, matches, tournaments
- **Arts** - Theater, comedy, cultural events
- **Underground** - Raves, warehouse parties (via Eventbrite)

## Setting Up Event Curation

### Step 1: Ticketmaster (Already Done ✅)

Your Ticketmaster API key is already configured. The system automatically fetches:
- Music events
- Sports events
- Arts events

### Step 2: Eventbrite (Optional)

To add Eventbrite events:

1. **Get API Token**
   - Follow `EVENTBRITE_SETUP.md`
   - Add `VITE_EVENTBRITE_API_TOKEN` to `.env.local` and Vercel

2. **Find Organization IDs**
   - Search Eventbrite for popular venues/organizers in your cities
   - Extract organization IDs from URLs
   - Add them to `services/eventbrite.ts` → `CITY_ORGANIZATIONS`

3. **Example for Berlin**:
   ```typescript
   'Berlin': [
     '1234567890', // Berghain organization ID
     '0987654321', // Another venue
   ],
   ```

### Step 3: Test the Integration

1. Go to Settings → Enable "Ticketmaster Relay"
2. Check console logs for event fetching
3. Events should appear in your feed

## Finding Underground Events

### Eventbrite Organizations

Look for:
- **Music venues** - Clubs, bars, warehouses
- **Event production companies** - Party organizers
- **Community spaces** - Art spaces, warehouses
- **DJ collectives** - Electronic music groups

### Popular Eventbrite Categories

- Electronic Music
- Techno/House Events
- Underground Parties
- Warehouse Raves
- Community Gatherings

## Expanding Event Sources

### Easy to Add:

1. **Songkick API** - Concerts and live music
2. **Bandsintown API** - Artist tour dates
3. **Facebook Events API** - Social events (requires app)
4. **Meetup API** - Community meetups
5. **Resy/OpenTable** - Restaurant events

### How to Add a New Source:

1. Create `services/newSource.ts` with:
   - API client functions
   - Event conversion function
   - Search functions

2. Update `services/eventAggregator.ts`:
   - Add import
   - Add to `aggregateCityEvents` function
   - Update `AggregatorResult` interface

3. Update `store.tsx`:
   - Add source toggle option
   - Update aggregation call

## Event Filtering & Curation

### Automatic Filtering

The system automatically:
- ✅ Removes duplicates
- ✅ Filters to upcoming events only
- ✅ Sorts by date
- ✅ Merges multiple sources

### Manual Curation

You can add filtering in `eventAggregator.ts`:

```typescript
// Filter by keywords
const filtered = filterEventsByCategory(events, ['techno', 'underground', 'warehouse']);

// Filter by date range
const upcoming = filterUpcomingEvents(events);

// Sort by relevance
const sorted = sortEventsByDate(events);
```

## Rate Limits & Best Practices

### Ticketmaster
- **5,000 requests/day**
- **5 requests/second**
- Cache results when possible
- Use pagination for large result sets

### Eventbrite
- **2,000 requests/hour**
- Batch organization requests
- Cache organization lists

### Recommendations

1. **Cache events** - Store fetched events locally
2. **Batch requests** - Fetch multiple categories together
3. **Paginate** - Use pagination for large result sets
4. **Error handling** - Gracefully handle API failures
5. **Fallback** - Use Ticketmaster as fallback if Eventbrite fails

## Monitoring & Debugging

### Console Logs

The system logs:
- Number of events fetched per source
- API errors (non-blocking)
- Deduplication stats

### Check Logs

```javascript
// In browser console:
// "Fetched 45 events: 30 from Ticketmaster, 15 from Eventbrite"
```

## Next Steps

1. ✅ Ticketmaster integration (done)
2. ⏳ Add Eventbrite organization IDs for your cities
3. ⏳ Test event aggregation
4. ⏳ Add more sources (Songkick, Bandsintown)
5. ⏳ Implement event caching
6. ⏳ Add event filtering UI

## Questions?

- See `EVENTBRITE_SETUP.md` for Eventbrite setup
- See `TICKETMASTER_SETUP.md` for Ticketmaster setup
- Check `services/eventAggregator.ts` for aggregation logic
