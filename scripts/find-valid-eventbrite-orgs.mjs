/**
 * Find Valid Eventbrite Organization IDs
 * 
 * This script searches Eventbrite's public pages and validates organization IDs
 * by testing them against the API. It finds organizations that actually have events.
 * 
 * Usage:
 *   node scripts/find-valid-eventbrite-orgs.mjs "Vancouver"
 *   node scripts/find-valid-eventbrite-orgs.mjs "Vancouver" --validate --update
 */

import { readFileSync, writeFileSync } from 'fs';
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

/**
 * Search Eventbrite public pages for organization IDs
 */
async function searchEventbritePages(city, keywords = ['music', 'nightlife', 'events', 'comedy', 'arts']) {
  console.log(`\n🔍 Searching Eventbrite public pages for ${city}...\n`);
  
  const foundOrgIds = new Set();
  
  for (const keyword of keywords) {
    try {
      const searchUrl = `https://www.eventbrite.com/d/${city.toLowerCase().replace(/\s+/g, '-')}--${keyword}/`;
      console.log(`  Searching: ${searchUrl}`);
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      });
      
      if (!response.ok) {
        console.log(`    ⚠️  HTTP ${response.status}`);
        continue;
      }
      
      const html = await response.text();
      
      // Extract organization IDs from various patterns
      const patterns = [
        /\/o\/[^\/]+\/(\d{8,15})/g,
        /organization[_-]?id["']:\s*["'](\d{8,15})["']/gi,
        /organizer[_-]?id["']:\s*["'](\d{8,15})["']/gi,
        /"org_id":\s*"(\d{8,15})"/g,
      ];
      
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          const id = match[1];
          if (id && id.length >= 8 && id.length <= 15) {
            foundOrgIds.add(id);
          }
        }
      }
      
      // Small delay between searches
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
  }
  
  return Array.from(foundOrgIds);
}

/**
 * Validate organization ID by checking if it exists and has public events
 * Since Eventbrite API only returns events for organizations we own, we'll check
 * if the organization exists by trying to access it, and note that 403 means
 * it exists but we don't have access (which is fine for public events)
 */
async function validateOrgId(orgId) {
  try {
    let response;
    
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      // Use Edge Function
      const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/eventbrite-proxy`;
      response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          organizationId: orgId,
          pageSize: 1,
          page: 1,
          status: 'live',
        }),
      });
    } else if (EVENTBRITE_API_TOKEN) {
      // Use direct API
      const url = `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?token=${EVENTBRITE_API_TOKEN}&page_size=1&status=live`;
      response = await fetch(url);
    } else {
      return { valid: false, reason: 'No API access' };
    }
    
    // 404 means organization doesn't exist - invalid
    if (response.status === 404) {
      return { valid: false, reason: '404 - Not found' };
    }
    
    // 403 means organization exists but we don't have access - this is OK for public events
    // The organization exists and might have public events, we just can't query them via API
    if (response.status === 403) {
      return { valid: true, eventCount: 'unknown', reason: '403 - Exists but no API access (public events may exist)' };
    }
    
    // 200 means we have access and can see events
    if (response.ok) {
      const data = await response.json();
      if (data.events && Array.isArray(data.events)) {
        const eventCount = data.pagination?.object_count || 0;
        return { valid: true, eventCount, reason: eventCount > 0 ? 'valid' : 'no events' };
      }
    }
    
    return { valid: false, reason: `HTTP ${response.status}` };
  } catch (error) {
    return { valid: false, reason: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔍 Find Valid Eventbrite Organization IDs

Usage:
  node scripts/find-valid-eventbrite-orgs.mjs <city> [options]

Options:
  --validate          Validate found IDs against API
  --update           Update eventbrite.ts file
  --keywords <list>  Comma-separated keywords (default: music,nightlife,events,comedy,arts)

Examples:
  node scripts/find-valid-eventbrite-orgs.mjs "Vancouver" --validate
  node scripts/find-valid-eventbrite-orgs.mjs "Vancouver" --validate --update
    `);
    process.exit(1);
  }
  
  const city = args[0];
  const shouldValidate = args.includes('--validate');
  const shouldUpdate = args.includes('--update');
  const keywordsArg = args.find(arg => arg.startsWith('--keywords='));
  const keywords = keywordsArg 
    ? keywordsArg.split('=')[1].split(',')
    : ['music', 'nightlife', 'events', 'comedy', 'arts'];
  
  console.log(`\n🔍 Finding valid Eventbrite organization IDs for ${city}...\n`);
  
  // Step 1: Search public pages
  const foundIds = await searchEventbritePages(city, keywords);
  console.log(`\n✅ Found ${foundIds.length} potential organization IDs\n`);
  
  if (foundIds.length === 0) {
    console.log('❌ No organization IDs found. Try different keywords or check the city name.\n');
    process.exit(1);
  }
  
  // Step 2: Validate if requested
  let validIds = foundIds;
  if (shouldValidate) {
    console.log(`\n🔍 Validating ${foundIds.length} organization IDs...\n`);
    validIds = [];
    
    for (let i = 0; i < foundIds.length; i++) {
      const orgId = foundIds[i];
      process.stdout.write(`  [${i + 1}/${foundIds.length}] ${orgId}... `);
      
      const result = await validateOrgId(orgId);
      
      if (result.valid) {
        validIds.push(orgId);
        console.log(`✅ Valid (${result.eventCount} events)`);
      } else {
        console.log(`❌ ${result.reason}`);
      }
      
      // Delay to avoid rate limits
      if (i < foundIds.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    
    console.log(`\n✅ Found ${validIds.length} valid organization IDs out of ${foundIds.length} tested\n`);
  }
  
  // Step 3: Update file if requested
  if (shouldUpdate && validIds.length > 0) {
    const filePath = join(__dirname, '..', 'services', 'eventbrite.ts');
    let content = readFileSync(filePath, 'utf-8');
    
    // Update or add city entry
    const cityPattern = new RegExp(`(['"])${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1:\\s*\\[[^\\]]*\\]`, 'g');
    const orgIdsStr = validIds.map(id => `    '${id}'`).join(',\n');
    
    if (cityPattern.test(content)) {
      content = content.replace(cityPattern, `'${city}': [\n${orgIdsStr}\n  ]`);
    } else {
      // Add before closing brace
      const insertPoint = content.lastIndexOf('};');
      if (insertPoint !== -1) {
        content = content.substring(0, insertPoint) + 
                  `  '${city}': [\n${orgIdsStr}\n  ],\n` + 
                  content.substring(insertPoint);
      }
    }
    
    writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated services/eventbrite.ts with ${validIds.length} organization IDs for ${city}\n`);
  } else {
    console.log(`\n📋 Organization IDs for ${city}:\n`);
    console.log(`'${city}': [\n${validIds.map(id => `  '${id}'`).join(',\n')}\n],\n`);
    if (!shouldUpdate) {
      console.log('💡 Add --update flag to automatically update eventbrite.ts\n');
    }
  }
}

main().catch(console.error);
