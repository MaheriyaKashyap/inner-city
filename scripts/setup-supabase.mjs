/**
 * Supabase Setup Script
 * This script automates the Supabase setup process
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Read environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gdsblffnkiswaweqokcm.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY not found in environment');
  process.exit(1);
}

console.log('📋 Supabase Setup Script');
console.log('Project URL:', supabaseUrl);
console.log('');

// Read migration file
const migrationPath = join(projectRoot, 'supabase/migrations/001_initial_schema.sql');
let migrationSQL;
try {
  migrationSQL = readFileSync(migrationPath, 'utf-8');
  console.log('✅ Migration file loaded');
} catch (error) {
  console.error('❌ Could not read migration file:', error.message);
  process.exit(1);
}

console.log('');
console.log('📝 Next steps:');
console.log('');
console.log('1. Run the database migration:');
console.log('   - Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/sql/new');
console.log('   - Copy/paste the SQL from: supabase/migrations/001_initial_schema.sql');
console.log('   - Click "Run"');
console.log('');
console.log('2. Deploy Edge Functions via CLI:');
console.log('   supabase link --project-ref gdsblffnkiswaweqokcm');
console.log('   supabase functions deploy ticketmaster-proxy');
console.log('   supabase functions deploy eventbrite-proxy');
console.log('');
console.log('3. Set Edge Function secrets:');
console.log('   supabase secrets set TICKETMASTER_API_KEY=KQn9TlNEODUds0G80guxp9SAHnYF9jYg');
console.log('   supabase secrets set EVENTBRITE_API_TOKEN=XNQKAZVGU2ZB7AXITETR');
console.log('');
