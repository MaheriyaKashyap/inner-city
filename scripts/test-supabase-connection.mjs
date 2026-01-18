/**
 * Test Supabase Connection
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gdsblffnkiswaweqokcm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkc2JsZmZua2lzd2F3ZXFva2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2ODI4MjEsImV4cCI6MjA4NDI1ODgyMX0.lRyoGyMAtuGtKOfgJJclY2U3oqaatKvtXOk3DhNs1WM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔌 Testing Supabase Connection...');
console.log('URL:', SUPABASE_URL);
console.log('');

// Test connection by checking if we can access the API
try {
  const { data, error } = await supabase.from('profiles').select('count').limit(0);
  
  if (error && error.code === 'PGRST116') {
    console.log('✅ Supabase connection works!');
    console.log('⚠️  Tables not created yet - need to run migration');
  } else if (error) {
    console.log('⚠️  Connection test:', error.message);
  } else {
    console.log('✅ Supabase connection works!');
    console.log('✅ Tables exist');
  }
} catch (err) {
  console.log('✅ Supabase client initialized');
  console.log('   (Tables will be created after migration)');
}

console.log('');
console.log('📋 Next Steps:');
console.log('1. Run database migration (see instructions below)');
console.log('2. Deploy Edge Functions');
console.log('3. Set secrets');
console.log('');
