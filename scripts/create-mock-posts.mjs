/**
 * Create mock posts, plans, and spots for Vancouver mock users
 * This script creates various types of Pulse content to populate the feed
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

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

// Sample content for different post types
const POST_CONTENT = [
  "Just discovered this amazing underground spot! The vibes are immaculate 🔥",
  "Who's going to the warehouse party tonight? Let's link up!",
  "Found the best techno night in the city. You have to check it out.",
  "Looking for people to go to this event with. Hit me up if you're interested!",
  "This venue is insane. The sound system is next level.",
  "Anyone else obsessed with the underground scene here?",
  "Just moved to Vancouver and looking to meet people who love electronic music!",
  "The energy at last night's event was unreal. Can't wait for the next one.",
  "Shoutout to all the amazing DJs keeping the scene alive!",
  "Found my new favorite spot. The crowd here is so welcoming.",
];

const PLAN_CONTENT = [
  "Planning to hit up the warehouse district this weekend. Who's in?",
  "Thinking about organizing a rooftop gathering next Friday. DM if interested!",
  "Want to explore the underground scene together? Let's make a plan!",
  "Planning a group outing to check out some new spots. Join us!",
  "Looking to form a crew for the upcoming festival. Let's connect!",
  "Planning a chill hangout at my favorite spot. Come through!",
  "Want to discover new music together? Let's plan a night out!",
  "Planning to check out multiple venues this weekend. Join the adventure!",
];

const SPOT_NAMES = [
  "The Underground Club",
  "Warehouse 404",
  "Neon Nights",
  "The Basement",
  "Electric Avenue",
  "The Vault",
  "Midnight Sessions",
  "The Loft",
  "Dark Room",
  "The Crypt",
  "Sound System",
  "The Den",
  "Underground Vibes",
  "The Cellar",
  "After Hours",
];

const SPOT_CONTENT = [
  "This place has the best sound system in the city. Highly recommend!",
  "Amazing vibes and great crowd. The DJs here are incredible.",
  "Found this hidden gem. The atmosphere is unmatched.",
  "Perfect spot for techno lovers. The energy here is electric.",
  "This venue is a must-visit. The underground scene is thriving here.",
  "Best kept secret in Vancouver. Check it out if you get the chance!",
  "The sound quality here is insane. You have to experience it.",
  "Love the intimate setting. Great for connecting with the community.",
];

const SPOT_ADDRESSES = [
  "123 Main St, Vancouver, BC",
  "456 Granville St, Vancouver, BC",
  "789 Hastings St, Vancouver, BC",
  "321 Commercial Dr, Vancouver, BC",
  "654 Davie St, Vancouver, BC",
  "987 Robson St, Vancouver, BC",
  "147 Pender St, Vancouver, BC",
  "258 Georgia St, Vancouver, BC",
];

// Vancouver coordinates (approximate)
const VANCOUVER_LAT = 49.2827;
const VANCOUVER_LNG = -123.1207;

// Add some randomness to coordinates (within ~5km radius)
function getRandomCoordinates(baseLat, baseLng) {
  // ~0.05 degrees ≈ 5km
  const latOffset = (Math.random() - 0.5) * 0.1;
  const lngOffset = (Math.random() - 0.5) * 0.1;
  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset,
  };
}

async function createMockPosts() {
  console.log('🚀 Creating mock posts, plans, and spots...\n');

  // Get Vancouver city ID
  const { data: vancouverCity, error: cityError } = await supabase
    .from('cities')
    .select('id')
    .eq('name', 'Vancouver')
    .single();

  if (cityError || !vancouverCity) {
    console.error('Error finding Vancouver city:', cityError);
    console.log('Creating Vancouver city...');
    const { data: newCity, error: createError } = await supabase
      .from('cities')
      .insert({
        id: 'vancouver',
        name: 'Vancouver',
        country: 'Canada',
        coordinates: { lat: VANCOUVER_LAT, lng: VANCOUVER_LNG },
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating Vancouver city:', createError);
      return;
    }
    console.log('✅ Created Vancouver city');
  }

  const cityId = vancouverCity?.id || 'vancouver';

  // Get all mock users (users with home_city = 'vancouver' or username pattern)
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, username')
    .or('home_city.eq.vancouver,username.ilike.mock%')
    .limit(100);

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return;
  }

  if (!users || users.length === 0) {
    console.log('⚠️  No mock users found. Please run create-vancouver-mock-data.mjs first.');
    return;
  }

  console.log(`Found ${users.length} users. Creating posts...\n`);

  const postsToCreate = [];
  const now = new Date();

  // Create posts for each user
  users.forEach((user, index) => {
    // Each user creates 2-4 posts
    const postCount = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < postCount; i++) {
      const postType = Math.random();
      let type, content, placeName, address, expiresAt, lat, lng;

      if (postType < 0.4) {
        // 40% regular posts
        type = 'post';
        content = POST_CONTENT[Math.floor(Math.random() * POST_CONTENT.length)];
      } else if (postType < 0.7) {
        // 30% plans
        type = 'plan';
        content = PLAN_CONTENT[Math.floor(Math.random() * PLAN_CONTENT.length)];
        // Plans expire in 1-7 days
        const expiresInHours = Math.floor(Math.random() * 168) + 24; // 24-192 hours
        expiresAt = new Date(now.getTime() + expiresInHours * 60 * 60 * 1000).toISOString();
        // 50% chance of having location
        if (Math.random() > 0.5) {
          const coords = getRandomCoordinates(VANCOUVER_LAT, VANCOUVER_LNG);
          lat = coords.lat;
          lng = coords.lng;
          address = SPOT_ADDRESSES[Math.floor(Math.random() * SPOT_ADDRESSES.length)];
        }
      } else {
        // 30% spots
        type = 'spot';
        placeName = SPOT_NAMES[Math.floor(Math.random() * SPOT_NAMES.length)];
        content = SPOT_CONTENT[Math.floor(Math.random() * SPOT_CONTENT.length)];
        address = SPOT_ADDRESSES[Math.floor(Math.random() * SPOT_ADDRESSES.length)];
        const coords = getRandomCoordinates(VANCOUVER_LAT, VANCOUVER_LNG);
        lat = coords.lat;
        lng = coords.lng;
      }

      // Randomize creation time (within last 7 days)
      const daysAgo = Math.random() * 7;
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

      postsToCreate.push({
        user_id: user.id,
        type,
        content,
        city_id: cityId,
        place_name: placeName || null,
        address: address || null,
        lat: lat || null,
        lng: lng || null,
        expires_at: expiresAt || null,
        media_urls: [],
        likes_count: Math.floor(Math.random() * 20),
        comments_count: Math.floor(Math.random() * 5),
        created_at: createdAt,
        updated_at: createdAt,
      });
    }
  });

  console.log(`Creating ${postsToCreate.length} posts...`);

  // Insert in batches of 50
  const BATCH_SIZE = 50;
  let created = 0;

  for (let i = 0; i < postsToCreate.length; i += BATCH_SIZE) {
    const batch = postsToCreate.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from('user_posts')
      .insert(batch);

    if (error) {
      console.error(`Error creating batch ${i / BATCH_SIZE + 1}:`, error);
    } else {
      created += batch.length;
      console.log(`✅ Created ${created}/${postsToCreate.length} posts...`);
    }
  }

  console.log(`\n🎉 Successfully created ${created} posts, plans, and spots!`);
  console.log(`\nBreakdown:`);
  const typeCounts = postsToCreate.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}`);
  });
}

// Run the script
createMockPosts().catch(console.error);
