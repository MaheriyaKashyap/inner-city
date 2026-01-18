# Eventbrite API Setup Guide

## Overview

Eventbrite's API allows you to fetch events from specific organizations and venues. Unlike Ticketmaster, Eventbrite doesn't offer a global search API (it was removed in 2019), so you'll need to maintain a list of organization/venue IDs for each city.

## Getting Your Eventbrite API Token

1. **Visit Eventbrite Developer Portal**
   - Go to: https://www.eventbrite.com/platform/api/
   - Click "Get Started" or "Sign In"

2. **Create a Developer Account**
   - Sign up or log in with your Eventbrite account
   - Accept the API Terms of Service

3. **Get Your Personal OAuth Token**
   - Go to: https://www.eventbrite.com/account-settings/apps
   - Click "Create API Key" or use your existing token
   - Copy your **Personal OAuth Token**

4. **API Token Details**
   - **Rate Limits**: 2000 requests per hour
   - **Free Tier**: Yes, free to use
   - **Documentation**: https://www.eventbrite.com/platform/api/

## Setting Up the API Token

### Local Development

1. Add to your `.env.local` file:
   ```
   VITE_EVENTBRITE_API_TOKEN=your_personal_oauth_token_here
   ```

2. Restart your dev server

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add a new variable:
   - **Name**: `VITE_EVENTBRITE_API_TOKEN`
   - **Value**: Your Personal OAuth Token
   - **Environment**: Production, Preview, Development (select all)
4. Redeploy your application

## Finding Organization/Venue IDs

Since Eventbrite doesn't have global search, you need to find organization IDs for popular venues/organizers in each city:

### Method 1: From Eventbrite Website

1. Go to an event page on Eventbrite
2. Look at the URL: `https://www.eventbrite.com/e/event-name-tickets-1234567890`
3. Click on the organizer name
4. The organization ID is in the URL: `https://www.eventbrite.com/o/organizer-name-1234567890`
   - The number at the end is the organization ID

### Method 2: Using the API

1. Search for events on Eventbrite website
2. Use browser dev tools to inspect API calls
3. Organization IDs will be in the API responses

### Method 3: Popular Venues/Organizations

For major cities, you can find popular event organizers:
- Music venues
- Nightclubs
- Event production companies
- Community organizations
- Sports venues

## Populating City Organizations

Update `services/eventbrite.ts` with organization IDs:

```typescript
export const CITY_ORGANIZATIONS: Record<string, string[]> = {
  'Berlin': [
    '1234567890', // Example: Berghain organization ID
    '0987654321', // Example: Another venue
  ],
  'London': [
    // Add London organization IDs
  ],
  // ... more cities
};
```

## Example: Finding Berlin Organizations

1. Search "Berlin events" on Eventbrite
2. Click on popular venues/organizers
3. Extract organization IDs from URLs
4. Add them to `CITY_ORGANIZATIONS['Berlin']`

## Testing the Integration

1. Start the app: `npm run dev`
2. Go to Settings screen
3. Enable "Ticketmaster Relay" (this also enables Eventbrite if configured)
4. Check the console for event fetching logs
5. Events should appear in your feed

## Limitations

- **No Global Search**: Must maintain organization/venue lists per city
- **Rate Limits**: 2000 requests/hour (plan accordingly)
- **Organization-Dependent**: Only get events from organizations you've added

## Alternative: Web Scraping

If you need broader coverage, consider:
- Using Apify scrapers: https://apify.com/hypebridge/eventbrite-search
- Building your own scraper (ensure compliance with ToS)
- Using other event APIs (Songkick, Bandsintown, etc.)

## Next Steps

1. Get your API token
2. Find organization IDs for your target cities
3. Add them to `CITY_ORGANIZATIONS` in `services/eventbrite.ts`
4. Test the integration
5. Monitor rate limits and adjust as needed
