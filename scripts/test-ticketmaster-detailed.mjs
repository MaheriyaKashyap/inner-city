/**
 * Detailed test for ticketmaster-proxy
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gdsblffnkiswaweqokcm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkc2JsZmZua2lzd2F3ZXFva2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2ODI4MjEsImV4cCI6MjA4NDI1ODgyMX0.lRyoGyMAtuGtKOfgJJclY2U3oqaatKvtXOk3DhNs1WM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Detailed Ticketmaster Function Test');
console.log('');

try {
  const { data, error } = await supabase.functions.invoke('ticketmaster-proxy', {
    body: { city: 'Berlin', countryCode: 'DE', category: 'music', size: 5 }
  });
  
  if (error) {
    console.log('❌ Error:', error);
    console.log('Error message:', error.message);
    console.log('Error context:', error.context);
  } else {
    console.log('✅ Success!');
    console.log('Data received:', data ? 'Yes' : 'No');
    if (data) {
      console.log('Events count:', data._embedded?.events?.length || 0);
    }
  }
} catch (err) {
  console.log('❌ Exception:', err.message);
  console.log('Full error:', err);
}

console.log('');
console.log('💡 If you see an error about TICKETMASTER_API_KEY:');
console.log('   → Check that the secret is set in Functions Settings');
console.log('   → Secret name must be exactly: TICKETMASTER_API_KEY');
console.log('');
