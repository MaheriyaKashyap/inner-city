/**
 * Supabase Edge Function: Ticketmaster API Proxy
 * 
 * This function proxies Ticketmaster API requests to avoid CORS issues.
 * 
 * Usage:
 * POST /functions/v1/ticketmaster-proxy
 * Body: { city: "Berlin", countryCode: "DE", category: "music", size: 20 }
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// CORS headers for Edge Functions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

const TICKETMASTER_API_KEY = Deno.env.get('TICKETMASTER_API_KEY') || '';
const TICKETMASTER_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!TICKETMASTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'TICKETMASTER_API_KEY not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body - handle both JSON and form data
    let body;
    try {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    } catch {
      body = {};
    }
    
    const { city, countryCode = 'US', category, size = 20, page = 0 } = body;

    if (!city) {
      return new Response(
        JSON.stringify({ error: 'city parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build Ticketmaster API URL
    const params = new URLSearchParams({
      apikey: TICKETMASTER_API_KEY,
      city,
      countryCode,
      size: String(size),
      page: String(page),
      sort: 'date,asc',
    });

    if (category) {
      params.append('classificationName', category);
    }

    const url = `${TICKETMASTER_BASE_URL}/events.json?${params.toString()}`;

    // Make request to Ticketmaster API
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ticketmaster API error:', response.status, errorText);
      
      // Return empty results for rate limiting or errors
      if (response.status === 429 || response.status >= 500) {
        return new Response(
          JSON.stringify({
            _embedded: { events: [] },
            _links: { self: { href: '' } },
            page: { size: 0, totalElements: 0, totalPages: 0, number: 0 },
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: `Ticketmaster API error: ${response.status}` }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in ticketmaster-proxy:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
