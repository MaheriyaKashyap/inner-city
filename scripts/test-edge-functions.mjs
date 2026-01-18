/**
 * Test Edge Functions
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gdsblffnkiswaweqokcm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkc2JsZmZua2lzd2F3ZXFva2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2ODI4MjEsImV4cCI6MjA4NDI1ODgyMX0.lRyoGyMAtuGtKOfgJJclY2U3oqaatKvtXOk3DhNs1WM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧪 Testing Edge Functions...');
console.log('');

// Test ticketmaster-proxy
console.log('Testing ticketmaster-proxy...');
try {
  const { data, error } = await supabase.functions.invoke('ticketmaster-proxy', {
    body: { city: 'Berlin', countryCode: 'DE', category: 'music', size: 5 }
  });
  
  if (error) {
    console.log('❌ ticketmaster-proxy error:', error.message);
    if (error.message.includes('TICKETMASTER_API_KEY')) {
      console.log('   → Need to set TICKETMASTER_API_KEY secret');
    }
  } else {
    console.log('✅ ticketmaster-proxy is working!');
    console.log('   Response:', data ? 'Received data' : 'Empty response');
  }
} catch (err) {
  console.log('⚠️  ticketmaster-proxy:', err.message);
}

console.log('');

// Test eventbrite-proxy
console.log('Testing eventbrite-proxy...');
try {
  const { data, error } = await supabase.functions.invoke('eventbrite-proxy', {
    body: { organizationId: '18147223532', pageSize: 5 }
  });
  
  if (error) {
    console.log('❌ eventbrite-proxy error:', error.message);
    if (error.message.includes('EVENTBRITE_API_TOKEN')) {
      console.log('   → Need to set EVENTBRITE_API_TOKEN secret');
    }
  } else {
    console.log('✅ eventbrite-proxy is working!');
    console.log('   Response:', data ? 'Received data' : 'Empty response');
  }
} catch (err) {
  console.log('⚠️  eventbrite-proxy:', err.message);
}

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 Next: Set Edge Function Secrets');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('1. Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions');
console.log('2. Click "Settings" tab');
console.log('3. Add secrets:');
console.log('   - TICKETMASTER_API_KEY = KQn9TlNEODUds0G80guxp9SAHnYF9jYg');
console.log('   - EVENTBRITE_API_TOKEN = XNQKAZVGU2ZB7AXITETR');
console.log('');
