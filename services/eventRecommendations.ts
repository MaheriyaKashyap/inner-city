/**
 * Event Recommendations Service
 * 
 * Provides personalized event recommendations based on:
 * - User interests
 * - Follow graph attendance
 * - Follow graph interest affinity
 * - Engagement metrics
 * - Time/proximity factors
 */

import { supabase } from '../lib/supabase';
import { Event, User, RecommendedEvent } from '../types';

// Recommendation scoring weights (configurable)
export const RECOMMENDATION_WEIGHTS = {
  interestOverlap: 3,      // W1: Direct interest match
  followGraphAttendance: 6, // W2: People you follow are going/interested
  followGraphInterests: 2,  // W3: Interests of people you follow
  engagement: 1,            // W4: Event engagement (RSVPs, posts)
  timeRecency: 2,           // W5: Events happening soon
  proximity: 2,             // W6: Distance-based boost (if location available)
};

export interface RecommendationOptions {
  userId: string;
  cityId: string;
  limit?: number;
  now?: Date;
  userLatLng?: { lat: number; lng: number };
  minScore?: number; // Minimum score threshold
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get recommended events for a user
 */
export async function getRecommendedEvents(
  options: RecommendationOptions
): Promise<RecommendedEvent[]> {
  const {
    userId,
    cityId,
    limit = 20,
    now = new Date(),
    userLatLng,
    minScore = 0,
  } = options;

  // 1. Fetch user profile with interests
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('interests')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching user profile:', profileError);
    return [];
  }

  const userInterests = (profile.interests || []).map((i: string) => i.toLowerCase());

  // 2. Fetch users that current user follows
  const { data: follows, error: followsError } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId);

  if (followsError) {
    console.error('Error fetching follows:', followsError);
    return [];
  }

  const followingIds = (follows || []).map((f: any) => f.following_id);

  // 3. Fetch candidate events for city (next 30 days, active status)
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .eq('city_id', cityId)
    .eq('status', 'active')
    .gte('start_at', now.toISOString())
    .lte('start_at', thirtyDaysFromNow.toISOString())
    .limit(300); // Fetch more than needed for scoring

  if (eventsError || !events) {
    console.error('Error fetching events:', eventsError);
    return [];
  }

  // 4. Fetch attendee data for followed users (batch query)
  let followedAttendees: Map<string, { going: number; interested: number }> = new Map();
  
  if (followingIds.length > 0) {
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('event_id, user_id, status')
      .in('user_id', followingIds)
      .eq('is_public', true);

    if (!attendeesError && attendees) {
      // Group by event_id
      attendees.forEach((att: any) => {
        if (!followedAttendees.has(att.event_id)) {
          followedAttendees.set(att.event_id, { going: 0, interested: 0 });
        }
        const counts = followedAttendees.get(att.event_id)!;
        if (att.status === 'going') counts.going++;
        if (att.status === 'interested') counts.interested++;
      });
    }
  }

  // 5. Fetch interests of followed users (for follow graph interest affinity)
  let followInterestVector: Set<string> = new Set();
  
  if (followingIds.length > 0) {
    const { data: followedProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('interests')
      .in('id', followingIds);

    if (!profilesError && followedProfiles) {
      followedProfiles.forEach((p: any) => {
        (p.interests || []).forEach((interest: string) => {
          followInterestVector.add(interest.toLowerCase());
        });
      });
    }
  }

  // 6. Fetch post counts per event (for engagement scoring)
  const eventIds = events.map((e: any) => e.id);
  const { data: posts, error: postsError } = await supabase
    .from('user_posts')
    .select('event_id')
    .in('event_id', eventIds)
    .not('event_id', 'is', null);

  const postCountsByEvent: Map<string, number> = new Map();
  if (!postsError && posts) {
    posts.forEach((p: any) => {
      if (p.event_id) {
        postCountsByEvent.set(p.event_id, (postCountsByEvent.get(p.event_id) || 0) + 1);
      }
    });
  }

  // 7. Score each event
  const scoredEvents: RecommendedEvent[] = events.map((event: any) => {
    const eventCategories = [
      ...(event.categories || []).map((c: string) => c.toLowerCase()),
      ...(event.subcategories || []).map((c: string) => c.toLowerCase()),
    ];

    // A) Interest overlap
    const interestMatches = userInterests.filter((interest) =>
      eventCategories.some((cat) => cat.includes(interest) || interest.includes(cat))
    );
    const interestScore = interestMatches.length * RECOMMENDATION_WEIGHTS.interestOverlap;

    // B) Follow graph attendance
    const attendeeData = followedAttendees.get(event.id) || { going: 0, interested: 0 };
    const followAttendanceScore =
      (attendeeData.going * 2 + attendeeData.interested) * RECOMMENDATION_WEIGHTS.followGraphAttendance;

    // C) Follow graph interest affinity
    const followInterestMatches = Array.from(followInterestVector).filter((interest) =>
      eventCategories.some((cat) => cat.includes(interest) || interest.includes(cat))
    );
    const followInterestScore =
      followInterestMatches.length * RECOMMENDATION_WEIGHTS.followGraphInterests;

    // D) Engagement
    const rsvpGoing = event.counts?.rsvpGoing || 0;
    const rsvpInterested = event.counts?.rsvpInterested || 0;
    const postCount = postCountsByEvent.get(event.id) || 0;
    const engagementScore =
      (rsvpGoing + rsvpInterested + postCount) * RECOMMENDATION_WEIGHTS.engagement;

    // E) Time and recency
    const eventStart = new Date(event.start_at);
    const daysUntilEvent = Math.floor(
      (eventStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    let timeScore = 0;
    if (daysUntilEvent >= 0 && daysUntilEvent <= 7) {
      // Strong boost for next 7 days
      timeScore = (8 - daysUntilEvent) * RECOMMENDATION_WEIGHTS.timeRecency;
    } else if (daysUntilEvent > 7 && daysUntilEvent <= 14) {
      // Moderate boost for next 2 weeks
      timeScore = (15 - daysUntilEvent) * 0.5 * RECOMMENDATION_WEIGHTS.timeRecency;
    } else if (daysUntilEvent > 14 && daysUntilEvent <= 30) {
      // Small boost for next month
      timeScore = (31 - daysUntilEvent) * 0.2 * RECOMMENDATION_WEIGHTS.timeRecency;
    }
    // Penalize past events (shouldn't happen due to query, but safety check)
    if (daysUntilEvent < 0) {
      timeScore = -100;
    }

    // F) Proximity (optional)
    let proximityScore = 0;
    if (userLatLng && event.lat && event.lng) {
      const distanceKm = calculateDistance(
        userLatLng.lat,
        userLatLng.lng,
        event.lat,
        event.lng
      );
      if (distanceKm <= 5) {
        // Max boost for events within 5km
        proximityScore = (5 - distanceKm) * RECOMMENDATION_WEIGHTS.proximity;
      } else if (distanceKm <= 20) {
        // Moderate boost for events within 20km
        proximityScore = (20 - distanceKm) * 0.3 * RECOMMENDATION_WEIGHTS.proximity;
      }
    }

    const totalScore =
      interestScore +
      followAttendanceScore +
      followInterestScore +
      engagementScore +
      timeScore +
      proximityScore;

    // Convert event to Event type (simplified - you may need to map more fields)
    const eventObj: Event = {
      id: event.id,
      cityId: event.city_id,
      organizerId: event.organizer_id || '',
      organizationId: event.organization_id,
      tier: event.tier || 'community',
      title: event.title,
      shortDesc: event.short_desc || '',
      longDesc: event.long_desc || '',
      startAt: event.start_at,
      endAt: event.end_at,
      venueName: event.venue_name || '',
      address: event.address || '',
      lat: event.lat || 0,
      lng: event.lng || 0,
      categories: event.categories || [],
      subcategories: event.subcategories || [],
      mediaUrls: event.media_urls || [],
      ticketUrl: event.ticket_url,
      ticketmasterId: event.ticketmaster_id,
      eventbriteId: event.eventbrite_id,
      status: event.status,
      counts: event.counts || {
        likes: 0,
        saves: 0,
        comments: 0,
        rsvpGoing: 0,
        rsvpInterested: 0,
      },
      priceRanges: event.price_ranges,
      ageRestrictions: event.age_restrictions,
      ticketLimit: event.ticket_limit,
      promoter: event.promoter,
      venueDetails: event.venue_details,
      sales: event.sales,
      timezone: event.timezone,
      locale: event.locale,
      onlineEvent: event.online_event,
      capacity: event.capacity,
      currency: event.currency,
    };

    return {
      ...eventObj,
      recommendationScore: totalScore,
      reasons: {
        interestMatch: interestMatches,
        followedGoingCount: attendeeData.going,
        followedInterestedCount: attendeeData.interested,
        followInterestMatch: followInterestMatches,
        engagementScore,
        timeScore,
        proximityScore: userLatLng ? proximityScore : undefined,
      },
    };
  });

  // Filter by minimum score and sort
  const filtered = scoredEvents
    .filter((e) => e.recommendationScore >= minScore)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);

  return filtered;
}
