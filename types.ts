
export type Tier = 'community' | 'official';
export type ContentStatus = 'active' | 'under_review' | 'removed';
export type TicketStatus = 'active' | 'used' | 'expired';
export type TicketSource = 'native' | 'ticketmaster';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  socials: { twitter?: string; instagram?: string };
  interests: string[];
  homeCity: string;
  travelCities: string[];
  profileMode: 'full' | 'minimal';
  organizerTier: 'none' | 'official';
  verified: boolean;
  createdAt: string;
  isTicketmasterConnected?: boolean;
}

export interface City {
  id: string;
  name: string;
  country: string;
  timezone: string;
  lore?: string;
  coordinates?: { lat: number, lng: number };
}

export interface CityPulse {
  id: string;
  cityId: string;
  type: 'neighborhood' | 'trend' | 'history';
  title: string;
  description: string;
  imageUrl: string;
  metric?: string; // e.g., "PEAKING NOW" or "12 NEW EVENTS"
}

export interface Event {
  id: string;
  cityId: string;
  organizerId: string;
  tier: Tier;
  title: string;
  shortDesc: string;
  longDesc: string;
  startAt: string;
  endAt: string;
  venueName: string;
  address: string;
  lat: number;
  lng: number;
  categories: string[];
  subcategories: string[];
  mediaUrls: string[];
  ticketUrl?: string;
  ticketmasterId?: string; // New field for TM integration
  status: ContentStatus;
  counts: {
    likes: number;
    saves: number;
    comments: number;
    rsvpGoing: number;
    rsvpInterested: number;
  };
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  qrCode: string;
  status: TicketStatus;
  type: string;
  gate?: string;
  section?: string;
  purchaseDate: string;
  source: TicketSource; // New field
}

export interface ThemeTokens {
  name: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textDim: string;
  border: string;
  accent: string;
  accentSecondary?: string;
  glowIntensity: string;
}

export interface Notification {
  id: string;
  type: 'follow' | 'comment' | 'dm' | 'reminder';
  fromUserId: string;
  text: string;
  createdAt: string;
  read: boolean;
}
