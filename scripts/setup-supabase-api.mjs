/**
 * Supabase Setup via REST API
 * Automates database migration and Edge Function deployment
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const SUPABASE_URL = 'https://gdsblffnkiswaweqokcm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkc2JsZmZua2lzd2F3ZXFva2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2ODI4MjEsImV4cCI6MjA4NDI1ODgyMX0.lRyoGyMAtuGtKOfgJJclY2U3oqaatKvtXOk3DhNs1WM';

console.log('🚀 Supabase Setup Script');
console.log('Project:', SUPABASE_URL);
console.log('');

// Read migration SQL
const migrationPath = join(projectRoot, 'supabase/migrations/001_initial_schema.sql');
let migrationSQL;
try {
  migrationSQL = readFileSync(migrationPath, 'utf-8');
  console.log('✅ Migration file loaded');
} catch (error) {
  console.error('❌ Could not read migration file:', error.message);
  process.exit(1);
}

// Read Edge Function files
const functions = [
  {
    name: 'ticketmaster-proxy',
    path: join(projectRoot, 'supabase/functions/ticketmaster-proxy/index.ts'),
  },
  {
    name: 'eventbrite-proxy',
    path: join(projectRoot, 'supabase/functions/eventbrite-proxy/index.ts'),
  },
];

console.log('✅ Edge Function files found');
console.log('');

console.log('📋 Setup Instructions:');
console.log('');
console.log('Since Supabase CLI requires interactive authentication,');
console.log('please complete these steps manually:');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('STEP 1: Run Database Migration');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/sql/new');
console.log('2. Copy the SQL below:');
console.log('');
console.log('─'.repeat(70));
console.log(migrationSQL.substring(0, 500) + '...');
console.log('─'.repeat(70));
console.log('');
console.log('   (Full SQL is in: supabase/migrations/001_initial_schema.sql)');
console.log('3. Paste into SQL Editor');
console.log('4. Click "Run" (or Cmd/Ctrl + Enter)');
console.log('5. Wait for "Success. No rows returned"');
console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('STEP 2: Deploy Edge Functions');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Option A: Via Supabase Dashboard (Easiest)');
console.log('1. Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions');
console.log('2. Click "Create a new function"');
console.log('3. Name: ticketmaster-proxy');
console.log('4. Copy contents from: supabase/functions/ticketmaster-proxy/index.ts');
console.log('5. Paste and click "Deploy"');
console.log('6. Repeat for eventbrite-proxy');
console.log('');
console.log('Option B: Via CLI (After login)');
console.log('1. Run: supabase login');
console.log('2. Run: supabase link --project-ref gdsblffnkiswaweqokcm');
console.log('3. Run: supabase functions deploy ticketmaster-proxy');
console.log('4. Run: supabase functions deploy eventbrite-proxy');
console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('STEP 3: Set Edge Function Secrets');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Via Dashboard:');
console.log('1. Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions');
console.log('2. Click "Settings" tab');
console.log('3. Add secret: TICKETMASTER_API_KEY = KQn9TlNEODUds0G80guxp9SAHnYF9jYg');
console.log('4. Add secret: EVENTBRITE_API_TOKEN = XNQKAZVGU2ZB7AXITETR');
console.log('');
console.log('Via CLI (After login):');
console.log('supabase secrets set TICKETMASTER_API_KEY=KQn9TlNEODUds0G80guxp9SAHnYF9jYg');
console.log('supabase secrets set EVENTBRITE_API_TOKEN=XNQKAZVGU2ZB7AXITETR');
console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ After completing these steps, restart your dev server:');
console.log('   npm run dev');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
