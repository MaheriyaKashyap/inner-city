# Inner City - Website Version Prompt for Bolt.new

Create a modern, high-contrast event discovery web application called **Inner City** - a rave-first social platform for discovering underground events, concerts, and nightlife experiences in major cities worldwide.

## Core Concept

Inner City is a dark, cyberpunk-inspired event discovery platform that combines the aesthetic of underground rave culture with modern web design. Think Blade Runner meets Resident Advisor meets a minimalist design system. The app helps users discover events, connect with communities, and purchase tickets through both native and Ticketmaster integration.

## Design Aesthetic

- **Visual Style**: Dark, high-contrast, neon-accented cyberpunk aesthetic
- **Typography**: Bold, uppercase, italic headings (Unbounded font family), clean body text (Inter/Space Grotesk)
- **Color Schemes**: Multiple theme options including:
  - Dark Neutral (default): Black backgrounds with white accents
  - Neon Purple: Deep purple with bright purple neon
  - Neon Cyan: Dark teal with cyan accents
  - Vaporwave: Pink/purple gradient aesthetic
  - Bright Studio: Light mode option
- **UI Elements**: Rounded corners (2xl-3xl), glassmorphism effects, neon glows, minimal borders
- **Animations**: Smooth transitions using Framer Motion, subtle hover effects, page transitions

## Technical Stack

- **Framework**: React 19+ with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS (via CDN or configured)
- **Icons**: Lucide React
- **Maps**: Mapbox GL (optional, with fallback UI)
- **Date Handling**: date-fns
- **State Management**: React Context API

## Key Features & Screens

### 1. **Feed Screen** (`/`)
- Horizontal scrolling "City Pulse" cards showing neighborhood trends
- Vertical feed of event cards with:
  - Hero image
  - Event title (bold, italic, uppercase)
  - Date/time with "LIVE" badges for ongoing events
  - Venue location
  - Like, save, share buttons
  - RSVP counts
- Filter by category (Music, Nightlife, Art, Tech, Food)
- Responsive grid layout (1 column mobile, 2-3 columns desktop)

### 2. **Event Detail** (`/event/:id`)
- Full-screen hero image with gradient overlay
- Event title, description, venue details
- "Access Key Gateway" button for ticket purchase
- Two purchase modes:
  - **Neural Key**: Native ticket system (simulated)
  - **Ticketmaster Relay**: Redirects to Ticketmaster for real tickets
- Community chat link
- RSVP buttons (Going/Interested)
- Event metadata (categories, official/community tier badges)

### 3. **Map Screen** (`/map`)
- Interactive map showing event locations
- Mapbox integration with dark theme
- Fallback cyberpunk grid UI if Mapbox fails
- Click markers to see event details
- Filter by event type

### 4. **Create Event** (`/create`)
- Multi-step form (3 steps):
  - Step 1: Upload hero image, title, category selection
  - Step 2: Description, date/time, venue
  - Step 3: Event tier selection (Community/Official)
- Success animation on publish

### 5. **Profile** (`/profile`)
- User avatar, bio, social links
- User's created events
- Saved events
- Stats (events attended, created, etc.)

### 6. **Wallet** (`/wallet`)
- Display user's tickets (QR codes)
- Filter by active/used/expired
- Ticketmaster tickets shown with special badge
- Ticket details (event, date, gate, section)

### 7. **Saved Events** (`/saved`)
- Grid of saved/bookmarked events
- Filter and sort options

### 8. **Notifications** (`/notifications`)
- List of notifications (follows, comments, reminders)
- Mark as read functionality

### 9. **Settings** (`/settings`)
- Theme selector (visual theme cards)
- Ticketmaster connection toggle
- Account settings
- Privacy settings
- Sign out

### 10. **Chat Room** (`/event/:id/chat`)
- Real-time chat interface for event discussions
- Message bubbles with user avatars
- Input field at bottom

### 11. **Onboarding** (`/onboarding`)
- City selection
- Interest selection
- Welcome screen

## Layout & Navigation

### Desktop Layout
- **Header**: Fixed top bar with:
  - City selector (dropdown)
  - "INNER CITY" logo (centered)
  - Notifications bell
- **Sidebar Navigation**: Left sidebar with icons for:
  - Feed (Home)
  - Map
  - Create (+)
  - Wallet (Tickets)
  - Saved (Bookmark)
  - Profile (User)
- **Main Content**: Scrollable content area with max-width container
- **No bottom nav** (desktop uses sidebar)

### Mobile Layout
- **Header**: Same as desktop but compact
- **Bottom Navigation Bar**: Fixed bottom bar with 6 icons
- **Full-width content**: No max-width constraint

## UI Components

### NeonButton
- Primary action button with neon glow effect
- Accent color background, bold uppercase text
- Hover: scale animation
- Variants: primary, secondary, ghost

### Badge
- Small pill-shaped badges
- Types: official, community, live, tonight
- Uppercase, tracking-widest, small text

### Card
- Rounded container with border
- Surface color background
- Subtle shadow

### Input
- Rounded input fields
- SurfaceAlt background
- Border on focus with accent color

## Ticketmaster Integration

- **API Service**: Create `services/ticketmaster.ts` with:
  - `searchEventsByCity()` - Search events by city name
  - `getEventDetails()` - Get specific event details
  - `convertTicketmasterEventToInnerCity()` - Transform TM events to app format
- **Environment Variable**: `VITE_TICKETMASTER_API_KEY`
- **Settings**: Toggle to connect/disconnect Ticketmaster
- **Event Display**: Ticketmaster events appear in feed with special indicator
- **Purchase Flow**: Clicking Ticketmaster events redirects to Ticketmaster website

## State Management

- React Context for global state:
  - User data
  - Active city
  - Events list (merged native + Ticketmaster)
  - Tickets
  - Theme selection
  - Saved events
  - Notifications
  - Ticketmaster connection status

## Data Structure

### Event Object
```typescript
{
  id: string;
  cityId: string;
  organizerId: string;
  tier: 'community' | 'official';
  title: string;
  shortDesc: string;
  longDesc: string;
  startAt: string; // ISO date
  endAt: string; // ISO date
  venueName: string;
  address: string;
  lat: number;
  lng: number;
  categories: string[];
  subcategories: string[];
  mediaUrls: string[];
  ticketUrl?: string; // For Ticketmaster events
  ticketmasterId?: string;
  status: 'active' | 'under_review' | 'removed';
  counts: {
    likes: number;
    saves: number;
    comments: number;
    rsvpGoing: number;
    rsvpInterested: number;
  };
}
```

## Responsive Design Requirements

- **Mobile First**: Design for mobile, enhance for desktop
- **Breakpoints**: 
  - Mobile: < 768px (single column, bottom nav)
  - Tablet: 768px - 1024px (2 columns, sidebar nav)
  - Desktop: > 1024px (3 columns, sidebar nav, max-width container)
- **Touch Targets**: Minimum 44x44px for interactive elements
- **Typography**: Scales appropriately (smaller on mobile, larger on desktop)

## Key Interactions

1. **Event Cards**: Hover effect (scale up slightly), click to view details
2. **Theme Switching**: Smooth color transitions (0.5s ease)
3. **Page Transitions**: Fade in/out between routes
4. **Loading States**: Spinner animations, skeleton screens
5. **Success States**: Checkmark animations, success messages

## Mock Data

Include sample data for:
- 3-5 cities (Berlin, London, New York, Tokyo, etc.)
- 10-15 sample events with various categories
- Sample user profile
- Sample tickets
- City "pulse" cards (trending neighborhoods/trends)

## Error Handling

- Error boundary for React errors
- Graceful fallbacks for:
  - Mapbox failures (show cyberpunk grid UI)
  - API failures (show error message, allow retry)
  - Missing images (use placeholder)

## Performance Considerations

- Lazy load images
- Code splitting for routes
- Optimize animations (use transform/opacity)
- Debounce search inputs
- Cache API responses

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Color contrast ratios (WCAG AA minimum)
- Screen reader friendly

## Additional Notes

- Use localStorage for:
  - Theme preference
  - Onboarding completion
  - Saved events
  - Ticketmaster connection status
- All dates should use date-fns for formatting
- Use relative dates ("Tonight", "Tomorrow", "In 3 days")
- Show "LIVE" badge for events happening now
- Show "TONIGHT" badge for events happening today

## Example Code Structure

```
src/
  components/
    Layout.tsx (AppShell with header/sidebar)
    UI.tsx (NeonButton, Badge, Card, Input)
  screens/
    Feed.tsx
    EventDetail.tsx
    MapScreen.tsx
    Create.tsx
    Profile.tsx
    Wallet.tsx
    Saved.tsx
    Notifications.tsx
    Settings.tsx
    ChatRoom.tsx
    Onboarding.tsx
  services/
    ticketmaster.ts (API integration)
  store.tsx (Context provider)
  theme.ts (Theme definitions)
  types.ts (TypeScript types)
  mockData.ts (Sample data)
```

## Design Inspiration

- Blade Runner aesthetic (neon, dark, high contrast)
- Resident Advisor (event discovery focus)
- Dribbble dark mode designs
- Cyberpunk 2077 UI elements
- Minimalist luxury design systems

---

**Start by creating the basic layout structure, then build out each screen one by one. Focus on the Feed and Event Detail screens first as they are the core experience. Use the dark-neutral theme as the default, but ensure all themes work correctly.**
