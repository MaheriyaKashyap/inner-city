/**
 * Supabase Setup via REST API
 * This script uses the Supabase REST API to set up the database and functions
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const SUPABASE_URL = 'https://gdsblffnkiswaweqokcm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkc2JsZmZua2lzd2F3ZXFva2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2ODI4MjEsImV4cCI6MjA4NDI1ODgyMX0.lRyoGyMAtuGtKOfgJJclY2U3oqaatKvtXOk3DhNs1WM';

console.log('🚀 Supabase Setup via API');
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

const functionContents = {};
for (const func of functions) {
  try {
    functionContents[func.name] = readFileSync(func.path, 'utf-8');
    console.log(`✅ ${func.name} function loaded`);
  } catch (error) {
    console.error(`❌ Could not read ${func.name}:`, error.message);
  }
}

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 Setup Instructions');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// Step 1: Database Migration
console.log('STEP 1: Run Database Migration');
console.log('────────────────────────────────────────────────────────────');
console.log('1. Open: https://app.supabase.com/project/gdsblffnkiswaweqokcm/sql/new');
console.log('2. Copy the SQL from: supabase/migrations/001_initial_schema.sql');
console.log('3. Paste and click "Run"');
console.log('');

// Step 2: Edge Functions
console.log('STEP 2: Deploy Edge Functions');
console.log('────────────────────────────────────────────────────────────');
console.log('Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions');
console.log('');
console.log('For ticketmaster-proxy:');
console.log('1. Click "Create a new function"');
console.log('2. Name: ticketmaster-proxy');
console.log('3. Copy from: supabase/functions/ticketmaster-proxy/index.ts');
console.log('4. Deploy');
console.log('');
console.log('For eventbrite-proxy:');
console.log('1. Click "Create a new function"');
console.log('2. Name: eventbrite-proxy');
console.log('3. Copy from: supabase/functions/eventbrite-proxy/index.ts');
console.log('4. Deploy');
console.log('');

// Step 3: Secrets
console.log('STEP 3: Set Edge Function Secrets');
console.log('────────────────────────────────────────────────────────────');
console.log('1. Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions');
console.log('2. Click "Settings" tab');
console.log('3. Add secrets:');
console.log('   - TICKETMASTER_API_KEY = KQn9TlNEODUds0G80guxp9SAHnYF9jYg');
console.log('   - EVENTBRITE_API_TOKEN = XNQKAZVGU2ZB7AXITETR');
console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ After completing these steps, restart: npm run dev');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
