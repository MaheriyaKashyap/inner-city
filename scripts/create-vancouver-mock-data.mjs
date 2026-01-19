#!/usr/bin/env node
/**
 * Create Mock Data for Vancouver
 * 
 * Creates 100 mock users in Vancouver, events hosted by them, and 83 followers for Joshua_1
 * 
 * Usage:
 *   node scripts/create-vancouver-mock-data.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');

try {
  config({ path: envPath });
} catch (e) {
  console.warn('⚠️  .env.local not found, using environment variables');
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || 
                    process.env.SUPABASE_URL || 
                    'https://gdsblffnkiswaweqokcm.supabase.co';
                    
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                           process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ Missing Supabase Service Role Key!');
  console.error('Add SUPABASE_SERVICE_ROLE_KEY to .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Vancouver coordinates and venues
const VANCOUVER_COORDS = { lat: 49.2827, lng: -123.1207 };
const VANCOUVER_VENUES = [
  'The Commodore Ballroom', 'Celebrities Nightclub', 'Fortune Sound Club', 
  'The Roxy', 'The Biltmore Cabaret', 'The Cobalt', 'The Fox Cabaret',
  'Honey Lounge', 'The Railway Club', 'The Media Club', 'The Vogue Theatre',
  'Orpheum Theatre', 'Queen Elizabeth Theatre', 'Pacific Coliseum',
  'Rogers Arena', 'BC Place', 'Science World', 'Granville Island',
  'Gastown', 'Yaletown', 'Kitsilano Beach', 'Spanish Banks',
  'Stanley Park', 'Commercial Drive', 'Main Street', 'East Van Warehouse',
  'Underground Loft', 'The Warehouse', 'The Basement', 'The Attic'
];

const EVENT_TITLES = [
  'Neon Nights', 'Underground Sessions', 'Warehouse Rave', 'Sunset Sessions',
  'Midnight Pulse', 'Deep Dark', 'High Energy', 'Techno Underground',
  'House Party', 'Bass Drop', 'Electronic Dreams', 'Night Shift',
  'After Hours', 'Late Night Vibes', 'Dark Room', 'Sound System',
  'Bass Culture', 'Drum & Bass Night', 'House Music', 'Techno Tuesday',
  'Weekend Warriors', 'Friday Night Lights', 'Saturday Sessions', 'Sunday Funday',
  'Midnight Madness', 'Early Morning Rave', 'Sunrise Sessions', 'Twilight Zone',
  'The Vault', 'The Basement', 'The Loft', 'The Warehouse', 'The Attic',
  'Underground', 'Secret Location', 'Hidden Gem', 'Exclusive Event',
  'VIP Experience', 'Members Only', 'Private Party', 'Invite Only'
];

const EVENT_DESCRIPTIONS = [
  'Join us for an unforgettable night of electronic music in the heart of Vancouver.',
  'Experience the best underground sounds the city has to offer.',
  'A night of non-stop beats and incredible energy.',
  'Where music meets community. Come dance with us.',
  'The hottest party in town. Don\'t miss out.',
  'An intimate gathering of music lovers and party people.',
  'Underground vibes, world-class sound system.',
  'The pulse of Vancouver\'s nightlife scene.',
  'A curated selection of the finest electronic music.',
  'Where the night comes alive.',
  'Experience the underground like never before.',
  'A celebration of sound, community, and good vibes.',
  'The best party you\'ll attend this month.',
  'Where legends are made and memories are created.',
  'An exclusive event for true music lovers.'
];

const CATEGORIES = [
  ['music', 'nightlife'],
  ['music', 'raves'],
  ['music', 'electronic'],
  ['music', 'techno'],
  ['music', 'house'],
  ['music', 'drum and bass'],
  ['nightlife', 'club'],
  ['nightlife', 'bar'],
  ['art', 'culture'],
  ['comedy'],
  ['food', 'drink'],
  ['workshop'],
  ['sports']
];

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
  'Sam', 'Jamie', 'Dakota', 'Skyler', 'Blake', 'Cameron', 'Drew', 'Emery',
  'Finley', 'Harper', 'Hayden', 'Kai', 'Logan', 'Parker', 'Reese', 'River',
  'Rowan', 'Sage', 'Sawyer', 'Sloane', 'Tatum', 'Tyler', 'Vancouver', 'Pacific',
  'Ocean', 'Mountain', 'Forest', 'River', 'Sky', 'Star', 'Moon', 'Sun',
  'Neon', 'Pulse', 'Beat', 'Sound', 'Wave', 'Rhythm', 'Bass', 'Treble',
  'Vinyl', 'Analog', 'Digital', 'Electric', 'Static', 'Signal', 'Frequency'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris',
  'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen',
  'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter',
  'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz'
];

const INTERESTS_POOL = [
  'Techno', 'House', 'Electronic', 'Drum & Bass', 'Hip Hop', 'Jazz', 'Rock',
  'Indie', 'Alternative', 'Punk', 'Metal', 'Pop', 'R&B', 'Reggae', 'Dubstep',
  'Trance', 'Progressive', 'Deep House', 'Tech House', 'Minimal', 'Hardcore',
  'Nightlife', 'Clubbing', 'Raving', 'Dancing', 'Music Production', 'DJing',
  'Vinyl', 'Record Collecting', 'Live Music', 'Concerts', 'Festivals',
  'Art', 'Photography', 'Design', 'Fashion', 'Street Art', 'Graffiti',
  'Food', 'Cooking', 'Craft Beer', 'Cocktails', 'Wine', 'Coffee',
  'Fitness', 'Yoga', 'Running', 'Cycling', 'Hiking', 'Outdoor Activities',
  'Travel', 'Adventure', 'Exploring', 'Urban Exploration', 'City Life'
];

// Generate random data helpers
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomDate(startDaysFromNow = 0, endDaysFromNow = 60) {
  const now = Date.now();
  const start = now + (startDaysFromNow * 24 * 60 * 60 * 1000);
  const end = now + (endDaysFromNow * 24 * 60 * 60 * 1000);
  return new Date(start + Math.random() * (end - start));
}

function randomVancouverCoords() {
  // Random coordinates within Vancouver area (±0.1 degrees)
  return {
    lat: VANCOUVER_COORDS.lat + (Math.random() - 0.5) * 0.2,
    lng: VANCOUVER_COORDS.lng + (Math.random() - 0.5) * 0.2
  };
}

async function ensureCityExists() {
  const { data: existing } = await supabase
    .from('cities')
    .select('id')
    .eq('id', 'vancouver')
    .single();

  if (!existing) {
    const { error } = await supabase
      .from('cities')
      .insert({
        id: 'vancouver',
        name: 'Vancouver',
        country: 'Canada',
        coordinates: VANCOUVER_COORDS,
      });

    if (error && !error.message.includes('duplicate')) {
      console.error('Error creating city:', error);
      throw error;
    }
  }
  console.log('✅ Vancouver city exists');
}

async function findOrCreateJoshua() {
  // Try to find existing Joshua_1 user
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('username', 'joshua_1')
    .limit(1);

  if (profiles && profiles.length > 0) {
    console.log(`✅ Found existing Joshua_1: ${profiles[0].id}`);
    return profiles[0].id;
  }

  // Create Joshua_1 if doesn't exist
  console.log('📝 Creating Joshua_1 user...');
  const email = `joshua_1_${Date.now()}@innercity.app`;
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: 'Joshua123!',
    email_confirm: true,
    user_metadata: {
      display_name: 'Joshua',
      username: 'joshua_1',
    },
  });

  if (authError) {
    console.error('Error creating Joshua:', authError);
    throw authError;
  }

  // Wait for trigger
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Update profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      username: 'joshua_1',
      display_name: 'Joshua',
      bio: 'Vancouver event organizer and music enthusiast.',
      interests: ['Music', 'Nightlife', 'Electronic', 'Techno'],
      home_city: 'vancouver',
    })
    .eq('id', authData.user.id);

  if (updateError) {
    console.error('Error updating Joshua profile:', updateError);
  }

  console.log(`✅ Created Joshua_1: ${authData.user.id}`);
  return authData.user.id;
}

async function createMockUsers(count = 100) {
  console.log(`\n📝 Creating ${count} mock users...`);
  const userIds = [];
  const batchSize = 10;

  for (let i = 0; i < count; i += batchSize) {
    const batch = [];
    for (let j = 0; j < batchSize && (i + j) < count; j++) {
      const firstName = randomElement(FIRST_NAMES);
      const lastName = randomElement(LAST_NAMES);
      const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${i + j}`;
      const email = `mock_${i + j}_${Date.now()}@innercity.app`;
      
      batch.push({
        email,
        password: 'Mock123!',
        email_confirm: true,
        user_metadata: {
          display_name: `${firstName} ${lastName}`,
          username: username,
        },
      });
    }

    // Create users in batch
    const results = await Promise.all(
      batch.map(userData => 
        supabase.auth.admin.createUser(userData).catch(err => {
          console.warn(`Warning creating user ${userData.email}:`, err.message);
          return null;
        })
      )
    );

    // Wait for triggers
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update profiles
    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      if (result && result.data && result.data.user) {
        const user = result.data.user;
        const firstName = batch[j].user_metadata.display_name.split(' ')[0];
        const lastName = batch[j].user_metadata.display_name.split(' ')[1] || '';
        const username = batch[j].user_metadata.username;
        
        const interests = randomElements(INTERESTS_POOL, Math.floor(Math.random() * 5) + 2);
        const bio = `${randomElement(['Music lover', 'Event organizer', 'Nightlife enthusiast', 'Party promoter', 'DJ', 'Music producer'])} based in Vancouver. ${randomElement(['Always looking for the next great event.', 'Passionate about underground music.', 'Love connecting with the community.', 'Bringing people together through music.'])}`;

        await supabase
          .from('profiles')
          .update({
            username: username,
            display_name: `${firstName} ${lastName}`,
            bio: bio,
            interests: interests,
            home_city: 'vancouver',
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
          })
          .eq('id', user.id);

        userIds.push(user.id);
      }
    }

    process.stdout.write(`\r✅ Created ${Math.min(i + batchSize, count)}/${count} users...`);
  }

  console.log(`\n✅ Created ${userIds.length} users`);
  return userIds;
}

async function createMockEvents(userIds, eventsPerUser = 1) {
  console.log(`\n📝 Creating events (${eventsPerUser} per user)...`);
  const eventIds = [];
  let eventCount = 0;

  for (const userId of userIds) {
    const numEvents = Math.floor(Math.random() * eventsPerUser) + 1;
    
    for (let i = 0; i < numEvents; i++) {
      const startDate = randomDate(0, 60);
      const endDate = new Date(startDate.getTime() + (Math.random() * 4 + 2) * 60 * 60 * 1000); // 2-6 hours
      const coords = randomVancouverCoords();
      const venue = randomElement(VANCOUVER_VENUES);
      const categories = randomElement(CATEGORIES);
      const title = randomElement(EVENT_TITLES);
      const shortDesc = randomElement(EVENT_DESCRIPTIONS);
      const longDesc = `${shortDesc} ${randomElement(EVENT_DESCRIPTIONS)} Join us at ${venue} for an unforgettable experience.`;

      const { data: event, error } = await supabase
        .from('events')
        .insert({
          source: 'user',
          city_id: 'vancouver',
          organizer_id: userId,
          tier: Math.random() > 0.7 ? 'underground' : 'community',
          title: title,
          short_desc: shortDesc,
          long_desc: longDesc,
          start_at: startDate.toISOString(),
          end_at: endDate.toISOString(),
          venue_name: venue,
          address: `${venue}, Vancouver, BC`,
          lat: coords.lat,
          lng: coords.lng,
          categories: categories,
          media_urls: [`https://picsum.photos/seed/${userId}_${eventCount}/800/600`],
          status: 'active',
        })
        .select('id')
        .single();

      if (error) {
        console.warn(`Warning creating event:`, error.message);
      } else if (event) {
        eventIds.push(event.id);
        eventCount++;
      }
    }
  }

  console.log(`✅ Created ${eventCount} events`);
  return eventIds;
}

async function createFollows(joshuaId, userIds, count = 83) {
  console.log(`\n📝 Creating ${count} followers for Joshua_1...`);
  
  const followers = userIds.slice(0, Math.min(count, userIds.length));
  const batchSize = 20;
  let followCount = 0;

  for (let i = 0; i < followers.length; i += batchSize) {
    const batch = followers.slice(i, i + batchSize);
    const follows = batch.map(followerId => ({
      follower_id: followerId,
      following_id: joshuaId,
    }));

    const { error } = await supabase
      .from('follows')
      .insert(follows);

    if (error && !error.message.includes('duplicate')) {
      console.warn(`Warning creating follows:`, error.message);
    } else {
      followCount += batch.length;
    }

    process.stdout.write(`\r✅ Created ${Math.min(i + batchSize, followers.length)}/${followers.length} follows...`);
  }

  console.log(`\n✅ Created ${followCount} followers for Joshua_1`);
}

async function main() {
  console.log('🚀 Creating Vancouver Mock Data\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Step 1: Ensure Vancouver city exists
    await ensureCityExists();

    // Step 2: Find or create Joshua_1
    const joshuaId = await findOrCreateJoshua();

    // Step 3: Create 100 mock users
    const userIds = await createMockUsers(100);

    // Step 4: Create events (1-3 per user)
    await createMockEvents(userIds, 2);

    // Step 5: Make 83 users follow Joshua_1
    await createFollows(joshuaId, userIds, 83);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Mock data creation complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   - 100 users created`);
    console.log(`   - ~200 events created`);
    console.log(`   - 83 users following Joshua_1`);
    console.log(`\n💡 Joshua_1 ID: ${joshuaId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Error creating mock data:', error);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

main();
