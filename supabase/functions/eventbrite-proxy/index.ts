/**
 * Supabase Edge Function: Eventbrite API Proxy
 * 
 * This function proxies Eventbrite API requests to avoid CORS issues.
 * 
 * Usage:
 * POST /functions/v1/eventbrite-proxy
 * Body: { organizationId: "123456", pageSize: 10, page: 1 }
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// CORS headers for Edge Functions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

const EVENTBRITE_API_TOKEN = Deno.env.get('EVENTBRITE_API_TOKEN') || '';
const EVENTBRITE_BASE_URL = 'https://www.eventbriteapi.com/v3';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Note: This function doesn't require authentication - it's a public proxy
    // The Eventbrite API token is stored server-side and not exposed to clients
    // This allows anonymous access while keeping the API token secure

    if (!EVENTBRITE_API_TOKEN) {
      console.error('EVENTBRITE_API_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'EVENTBRITE_API_TOKEN not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { organizationId, pageSize = 10, page = 1, status = 'live' } = await req.json();

    if (!organizationId) {
      return new Response(
        JSON.stringify({ error: 'organizationId parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build Eventbrite API URL
    const params = new URLSearchParams({
      token: EVENTBRITE_API_TOKEN.trim(), // Trim to remove any whitespace
      page_size: String(pageSize),
      page: String(page),
      order_by: 'start_asc',
    });

    if (status) {
      params.append('status', status);
    }

    const url = `${EVENTBRITE_BASE_URL}/organizations/${organizationId}/events/?${params.toString()}`;

    // Log the request for debugging
    console.log(`Eventbrite API request: ${url.replace(EVENTBRITE_API_TOKEN, 'TOKEN_REDACTED')}`);
    console.log(`Organization ID: ${organizationId}, Page Size: ${pageSize}, Status: ${status}`);

    // Make request to Eventbrite API
    const response = await fetch(url);
    
    console.log(`Eventbrite API response status: ${response.status}`);

    if (!response.ok) {
      // Handle 401, 403, 404 gracefully (return empty results)
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        console.log(`Eventbrite API returned ${response.status} for org ${organizationId} - returning empty results`);
        const emptyResponse = {
          events: [],
          pagination: {
            object_count: 0,
            page_number: 1,
            page_size: 0,
            page_count: 0,
            has_more_items: false,
          },
          is404: response.status === 404, // Flag to indicate 404
        };
        return new Response(
          JSON.stringify(emptyResponse),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const errorText = await response.text();
      console.error('Eventbrite API error:', response.status, errorText);

      return new Response(
        JSON.stringify({
          events: [],
          pagination: {
            object_count: 0,
            page_number: 1,
            page_size: 0,
            page_count: 0,
            has_more_items: false,
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    
    // Log the response for debugging
    console.log(`Eventbrite API response: ${data.events?.length || 0} events found for org ${organizationId}`);
    if (data.events && data.events.length > 0) {
      console.log(`First event: ${data.events[0].name?.text || 'unnamed'}`);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in eventbrite-proxy:', error);
    return new Response(
      JSON.stringify({
        events: [],
        pagination: {
          object_count: 0,
          page_number: 1,
          page_size: 0,
          page_count: 0,
          has_more_items: false,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
