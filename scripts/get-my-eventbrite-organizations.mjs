/**
 * Get Eventbrite Organizations Accessible to Your API Token
 * 
 * This script uses the Eventbrite API to get organizations that your token has access to.
 * These are the organizations you can actually query for events.
 * 
 * Usage:
 *   node scripts/get-my-eventbrite-organizations.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local if it exists
try {
  const envPath = join(__dirname, '..', '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (e) {
  // .env.local doesn't exist, that's okay
}

const EVENTBRITE_API_TOKEN = process.env.VITE_EVENTBRITE_API_TOKEN || process.env.EVENTBRITE_API_TOKEN;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function getMyOrganizations() {
  console.log('\n🔍 Fetching organizations accessible to your Eventbrite API token...\n');
  
  if (!EVENTBRITE_API_TOKEN && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
    console.error('❌ Error: Need either EVENTBRITE_API_TOKEN or SUPABASE_URL + SUPABASE_ANON_KEY');
    console.log('\nSet environment variables:');
    console.log('  export VITE_EVENTBRITE_API_TOKEN=your_token');
    console.log('  OR');
    console.log('  export VITE_SUPABASE_URL=your_url');
    console.log('  export VITE_SUPABASE_ANON_KEY=your_key');
    process.exit(1);
  }
  
  try {
    let response;
    let data;
    
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      // Use Edge Function
      console.log('Using Supabase Edge Function...\n');
      const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/eventbrite-proxy`;
      response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          action: 'getMyOrganizations',
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Edge Function error: ${response.status} - ${errorText}`);
      }
      
      data = await response.json();
    } else {
      // Use direct API
      console.log('Using direct Eventbrite API...\n');
      const url = `https://www.eventbriteapi.com/v3/users/me/organizations/?token=${EVENTBRITE_API_TOKEN}`;
      response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Eventbrite API error: ${response.status} - ${errorText}`);
      }
      
      data = await response.json();
    }
    
    if (!data.organizations || data.organizations.length === 0) {
      console.log('⚠️  No organizations found. This means:');
      console.log('   1. Your API token might not have access to any organizations');
      console.log('   2. You might need to create an organization on Eventbrite first');
      console.log('   3. The token might be invalid\n');
      process.exit(1);
    }
    
    console.log(`✅ Found ${data.organizations.length} organization(s) accessible to your token:\n`);
    
    const orgs = data.organizations.map(org => ({
      id: org.id,
      name: org.name,
      url: org.url,
    }));
    
    orgs.forEach((org, index) => {
      console.log(`${index + 1}. ${org.name}`);
      console.log(`   ID: ${org.id}`);
      console.log(`   URL: ${org.url}\n`);
    });
    
    console.log('\n📋 Organization IDs to use in your code:\n');
    console.log(orgs.map(org => `'${org.id}'`).join(',\n'));
    console.log('\n');
    
    // Test each organization to see if it has events
    console.log('🔍 Testing which organizations have events...\n');
    
    for (const org of orgs) {
      process.stdout.write(`  Testing ${org.name} (${org.id})... `);
      
      try {
        let testResponse;
        if (SUPABASE_URL && SUPABASE_ANON_KEY) {
          const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/eventbrite-proxy`;
          testResponse = await fetch(edgeFunctionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
              organizationId: org.id,
              pageSize: 1,
              status: 'live',
            }),
          });
        } else {
          const testUrl = `https://www.eventbriteapi.com/v3/organizations/${org.id}/events/?token=${EVENTBRITE_API_TOKEN}&page_size=1&status=live`;
          testResponse = await fetch(testUrl);
        }
        
        if (testResponse.ok) {
          const testData = await testResponse.json();
          const eventCount = testData.pagination?.object_count || 0;
          console.log(`✅ ${eventCount} live events`);
        } else {
          console.log(`❌ HTTP ${testResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n💡 Note: Eventbrite API tokens can only access organizations owned by the token holder.');
    console.log('   To get events from other organizations, you would need their permission or use a different approach.\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Verify your EVENTBRITE_API_TOKEN is correct');
    console.log('   2. Check if the token has the right permissions');
    console.log('   3. Make sure you have at least one organization on Eventbrite');
    console.log('   4. Try accessing https://www.eventbrite.com/account-settings/apps to verify your token\n');
    process.exit(1);
  }
}

getMyOrganizations().catch(console.error);
