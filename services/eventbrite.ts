/**
 * Eventbrite API Integration
 * Note: Eventbrite removed global search in 2019, so we use organization/venue-specific endpoints
 * Documentation: https://www.eventbrite.com/platform/api/
 */

export interface EventbriteEvent {
  id: string;
  name: {
    text: string;
    html: string;
  };
  description: {
    text: string;
    html: string;
  };
  url: string;
  start: {
    timezone: string;
    local: string;
    utc: string;
  };
  end: {
    timezone: string;
    local: string;
    utc: string;
  };
  created: string;
  changed: string;
  published: string;
  status: string;
  currency: string;
  online_event: boolean;
  organization_id: string;
  organizer_id: string;
  venue_id?: string;
  format_id?: string;
  category_id?: string;
  subcategory_id?: string;
  capacity?: number;
  capacity_is_custom?: boolean;
  logo?: {
    id: string;
    url: string;
    aspect_ratio: string;
    edge_color?: string;
    edge_color_set?: boolean;
  };
  ticket_availability: {
    has_available_tickets: boolean;
    is_sold_out: boolean;
    minimum_ticket_price?: {
      currency: string;
      value: number;
      display: string;
    };
    maximum_ticket_price?: {
      currency: string;
      value: number;
      display: string;
    };
  };
  venue?: {
    id: string;
    name: string;
    address?: {
      address_1?: string;
      address_2?: string;
      city?: string;
      region?: string;
      postal_code?: string;
      country?: string;
      localized_area_display?: string;
    };
    latitude?: string;
    longitude?: string;
  };
  organizer?: {
    id: string;
    name: string;
    description?: string;
  };
  format?: {
    id: string;
    name: string;
    short_name: string;
  };
  category?: {
    id: string;
    name: string;
    short_name: string;
  };
  subcategory?: {
    id: string;
    name: string;
    short_name: string;
  };
}

export interface EventbriteSearchResponse {
  events: EventbriteEvent[];
  pagination: {
    object_count: number;
    page_number: number;
    page_size: number;
    page_count: number;
    has_more_items: boolean;
  };
}

const API_BASE_URL = 'https://www.eventbriteapi.com/v3';

/**
 * Get API token from environment
 */
function getApiToken(): string | null {
  const token = (import.meta as any).env?.VITE_EVENTBRITE_API_TOKEN || 
         (typeof process !== 'undefined' && process.env?.VITE_EVENTBRITE_API_TOKEN) ||
         null;
  // Trim whitespace and newlines from token
  return token ? token.trim() : null;
}

/**
 * Search events by organization ID
 * You'll need to maintain a list of popular organizations/venues per city
 */
export async function searchEventsByOrganization(
  organizationId: string,
  options: {
    status?: string; // 'live', 'started', 'ended', 'completed', 'canceled'
    order_by?: string; // 'start_asc', 'start_desc', 'created_asc', 'created_desc'
    page_size?: number; // max 100
    page?: number;
  } = {}
): Promise<EventbriteSearchResponse> {
  const token = getApiToken();
  if (!token) {
    // Return empty results instead of throwing
    return { events: [], pagination: { object_count: 0, page_number: 1, page_size: 0, page_count: 0, has_more_items: false } };
  }

  try {
    // Use Supabase Edge Function if available, otherwise fallback to direct API
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    if (supabaseUrl) {
      // Use Supabase Edge Function (solves CORS)
      const { invokeSupabaseFunction } = await import('../lib/supabase');
      try {
        const data = await invokeSupabaseFunction<EventbriteSearchResponse>('eventbrite-proxy', {
          organizationId,
          pageSize: options.page_size || 50,
          page: options.page || 1,
          status: options.status || 'live',
        });
        return data;
      } catch (supabaseError) {
        // Fallback to direct API if Supabase function fails
        if (import.meta.env.DEV) {
          console.warn('Supabase function failed, falling back to direct API:', supabaseError);
        }
      }
    }

    // Fallback: Direct API call
    const params = new URLSearchParams({
      token: token.trim(),
      page_size: String(options.page_size || 50),
      page: String(options.page || 1),
      order_by: options.order_by || 'start_asc',
    });

    if (options.status) {
      params.append('status', options.status);
    }

    const response = await fetch(`${API_BASE_URL}/organizations/${organizationId}/events/?${params.toString()}`);
    
    if (!response.ok) {
      // If 401 (unauthorized), 403 (forbidden), or 404 (not found), fail silently
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        return { events: [], pagination: { object_count: 0, page_number: 1, page_size: 0, page_count: 0, has_more_items: false } };
      }
      const errorText = await response.text();
      if (import.meta.env.DEV) {
        console.warn(`Eventbrite API error for org ${organizationId}: ${response.status} - ${errorText}`);
      }
      return { events: [], pagination: { object_count: 0, page_number: 1, page_size: 0, page_count: 0, has_more_items: false } };
    }

    const data = await response.json();
    return data as EventbriteSearchResponse;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`Error fetching Eventbrite events for org ${organizationId}:`, error);
    }
    return { events: [], pagination: { object_count: 0, page_number: 1, page_size: 0, page_count: 0, has_more_items: false } };
  }
}

/**
 * Search events by venue ID
 */
export async function searchEventsByVenue(
  venueId: string,
  options: {
    status?: string;
    order_by?: string;
    page_size?: number;
    page?: number;
  } = {}
): Promise<EventbriteSearchResponse> {
  const token = getApiToken();
  if (!token) {
    // Return empty results instead of throwing
    return { events: [], pagination: { object_count: 0, page_number: 1, page_size: 0, page_count: 0, has_more_items: false } };
  }

  const params = new URLSearchParams({
    token,
    page_size: String(options.page_size || 50),
    page: String(options.page || 1),
    order_by: options.order_by || 'start_asc',
  });

  if (options.status) {
    params.append('status', options.status);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/venues/${venueId}/events/?${params.toString()}`);
    
    if (!response.ok) {
      // If 401 (unauthorized), 403 (forbidden), or 404 (not found), fail silently
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        return { events: [], pagination: { object_count: 0, page_number: 1, page_size: 0, page_count: 0, has_more_items: false } };
      }
      const errorText = await response.text();
      // Only log in development
      if (import.meta.env.DEV) {
        console.warn(`Eventbrite API error for venue ${venueId}: ${response.status} - ${errorText}`);
      }
      return { events: [], pagination: { object_count: 0, page_number: 1, page_size: 0, page_count: 0, has_more_items: false } };
    }

    const data = await response.json();
    return data as EventbriteSearchResponse;
  } catch (error) {
    // Only log in development, fail silently in production
    if (import.meta.env.DEV) {
      console.warn(`Error fetching Eventbrite events for venue ${venueId}:`, error);
    }
    return { events: [], pagination: { object_count: 0, page_number: 1, page_size: 0, page_count: 0, has_more_items: false } };
  }
}

/**
 * Convert Eventbrite event to Inner City Event format
 */
export function convertEventbriteEventToInnerCity(
  ebEvent: EventbriteEvent,
  cityId: string,
  organizerId: string = 'eventbrite'
): any {
  const imageUrl = ebEvent.logo?.url || 'https://picsum.photos/800/600';
  
  const startDate = new Date(ebEvent.start.local);
  const endDate = new Date(ebEvent.end.local);

  // Determine tier based on event status and organizer
  let tier: 'official' | 'community' | 'underground' = 'community';
  if (ebEvent.organizer?.name && ebEvent.organizer.name.toLowerCase().includes('official')) {
    tier = 'official';
  } else if (ebEvent.category?.name?.toLowerCase().includes('music') || 
             ebEvent.subcategory?.name?.toLowerCase().includes('electronic')) {
    tier = 'underground';
  }

  return {
    id: `eb_${ebEvent.id}`,
    cityId,
    organizerId: organizerId || ebEvent.organizer_id,
    tier,
    title: ebEvent.name.text,
    shortDesc: ebEvent.category?.name || ebEvent.format?.name || 'Event',
    longDesc: ebEvent.description.text || ebEvent.name.text,
    startAt: startDate.toISOString(),
    endAt: endDate.toISOString(),
    venueName: ebEvent.venue?.name || (ebEvent.online_event ? 'Online Event' : 'Venue TBA'),
    address: ebEvent.venue?.address?.localized_area_display || 
             `${ebEvent.venue?.address?.address_1 || ''} ${ebEvent.venue?.address?.city || ''}`.trim() ||
             '',
    lat: ebEvent.venue?.latitude ? parseFloat(ebEvent.venue.latitude) : 0,
    lng: ebEvent.venue?.longitude ? parseFloat(ebEvent.venue.longitude) : 0,
    categories: [ebEvent.category?.name || 'General'],
    subcategories: [ebEvent.subcategory?.name || ebEvent.format?.name || ''],
    mediaUrls: [imageUrl],
    ticketUrl: ebEvent.url,
    eventbriteId: ebEvent.id,
    status: ebEvent.status === 'live' ? 'active' as const : 'active' as const,
    counts: {
      likes: 0,
      saves: 0,
      comments: 0,
      rsvpGoing: 0,
      rsvpInterested: 0,
    },
  };
}

/**
 * Popular organizations/venues by city
 * You'll need to populate this with actual organization IDs from Eventbrite
 */
export const CITY_ORGANIZATIONS: Record<string, string[]> = {
  'Berlin': [
    '18147223532',
    '85950258523',
    '20249008757',
    '42340492183',
    '30583119682',
    '48687361433',
    '50794730473',
    '118974152861',
    '112438753071',
    '61677601013',
    '120714547940',
    '7983092193',
    '2306625137',
    '50013368963',
    '112556682841',
    '12448110053',
    '30273710876',
    '30164999184',
    '2319663773',
    '25052159091',
    '18594831004',
    '105976471551',
    '33895977485',
    '47961807863',
    '30045262856',
    '52798408723',
    '99895128061',
    '77447754723',
    '69356207623',
    '55412802263',
    '54200948253',
    '37935491523',
    '17165660352',
    '85602833453',
    '60238326123',
    '33827739137',
    '118219537271',
    '50691049753',
    '69837130683',
    '66795154873',
    '82815064723',
    '120800866973',
    '77256716753',
    '37777060213',
    '105571405801',
    '60108695013',
    '104453253141',
    '105693997981',
    '44885281883',
    '120764551532',
    '49288622',
    '120677048267',
    '66792456113',
    '17817834839',
    '53004078403',
    '66977875023',
    '117817462311',
    '80759858283',
    '83884780683',
    '59070860673',
    '83671608853',
    '29395158761'
  ],
  'London': [
    // Add Eventbrite organization IDs for London
  ],
  'New York': [
    // Add Eventbrite organization IDs for NYC
  ],
  'Los Angeles': [
    // Add Eventbrite organization IDs for LA
  ],
  'Vancouver': [
    '2943850379711',
    '120831497899',
    '34871563113',
    '87690002073',
    '59178760723',
    '9484299597',
    '37276933663',
    '75820795173',
    '93303090563',
    '119476444461',
    '77280653143',
    '120831069924',
    '12281209873',
    '59327444273',
    '57337400803',
    '106815795981',
    '16030559882',
    '60099430613',
    '2772244818',
    '32899867183',
    '30273710876',
    '112556682841',
    '12448110053',
    '28551465965',
    '2319663773',
    '90433442663',
    '5687498741',
    '30942772753',
    '30830903109',
    '63157921223',
    '80331339503',
    '63403105583',
    '82620381413'
  ],
  'Calgary': [
    '2835847444521',
    '59517535663',
    '4115384439',
    '31525163147',
    '17542473710',
    '113774256611',
    '50372314113',
    '16030559882',
    '18116068966',
    '17376122345',
    '4534018507',
    '100788105451',
    '9377090349',
    '33867485427',
    '33377471171',
    '12448110053',
    '44844296983',
    '81614408553',
    '17437217035',
    '8503627612',
    '120823764139',
    '59290608213',
    '36582133873',
    '120790883575',
    '17371048072',
    '95698370973',
    '83879403303',
    '1251148157',
    '17906771065',
    '13412231993',
    '22927194740',
    '71945234833',
    '32808320813',
    '18437233490',
    '35293053033',
    '81021758843',
    '71670787053',
    '114121661541',
    '120769869499',
    '115211708831',
    '15659791545',
    '19690461102',
    '70713673833',
    '69730600153',
    '17103752006',
    '120237444431',
    '51570080193',
    '21609830291',
    '120723362211',
    '103964797721',
    '46467278883',
    '45905765613',
    '41606449603',
    '115669954251',
    '5869493851',
    '102376456621',
    '16620811925',
    '74198477893',
    '58852804893',
    '61074770533',
    '67405557993',
    '8436980324',
    '40276504703'
  ],
};

/**
 * Search events for a city using known organizations
 */
export async function searchEventsByCity(
  cityName: string,
  options: {
    status?: string;
    page_size?: number;
  } = {}
): Promise<EventbriteEvent[]> {
  const organizations = CITY_ORGANIZATIONS[cityName] || [];
  const allEvents: EventbriteEvent[] = [];

  for (const orgId of organizations) {
    try {
      const response = await searchEventsByOrganization(orgId, {
        status: options.status || 'live',
        page_size: options.page_size || 20,
      });
      if (response && response.events) {
        allEvents.push(...response.events);
      }
    } catch (error) {
      // Silently continue - errors are already handled in searchEventsByOrganization
      // Only log in development
      if (import.meta.env.DEV) {
        console.warn(`Failed to fetch events for organization ${orgId}:`, error);
      }
    }
  }

  return allEvents;
}
