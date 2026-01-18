export type City = 'berlin' | 'london' | 'new_york' | 'tokyo' | 'los_angeles';

export type EventTier = 'community' | 'official';

export type EventStatus = 'active' | 'under_review' | 'removed';

export interface Event {
  title: string;
  short_desc?: string;
  long_desc?: string;
  city: City;
  tier?: EventTier;
  start_at: string; // ISO date-time string
  end_at?: string; // ISO date-time string
  venue_name: string;
  address?: string;
  lat?: number;
  lng?: number;
  categories?: string[];
  image_url?: string;
  ticket_url?: string;
  ticket_price?: number;
  likes_count?: number;
  saves_count?: number;
  rsvp_going?: number;
  rsvp_interested?: number;
  status?: EventStatus;
}
