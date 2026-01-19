/**
 * Validate Eventbrite Organization IDs
 * 
 * This script tests each organization ID in CITY_ORGANIZATIONS to see if it's valid
 * (returns events, not 404). It then updates the file with only valid IDs.
 * 
 * Usage:
 *   node scripts/validate-eventbrite-organizations.mjs
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
const EVENTBRITE_BASE_URL = 'https://www.eventbriteapi.com/v3';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Delay between API calls to avoid rate limits
const DELAY_MS = 1500; // 1.5 seconds (faster for validation)

/**
 * Test if an organization ID is valid by checking if it returns events
 */
async function validateOrganizationId(orgId, useEdgeFunction = true) {
  try {
    let response;
    
    if (useEdgeFunction && SUPABASE_URL && SUPABASE_ANON_KEY) {
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
    } else {
      // Use direct API
      if (!EVENTBRITE_API_TOKEN) {
        throw new Error('No API token available');
      }
      const url = `${EVENTBRITE_BASE_URL}/organizations/${orgId}/events/?token=${EVENTBRITE_API_TOKEN}&page_size=1&page=1&status=live&order_by=start_asc`;
      response = await fetch(url);
    }
    
    if (!response.ok) {
      if (response.status === 404) {
        return { valid: false, reason: '404 - Organization not found' };
      }
      if (response.status === 401 || response.status === 403) {
        return { valid: false, reason: `${response.status} - Unauthorized` };
      }
      if (response.status === 429) {
        return { valid: false, reason: '429 - Rate limited', retry: true };
      }
      return { valid: false, reason: `HTTP ${response.status}` };
    }
    
    const data = await response.json();
    
    // Check if we got events or at least a valid response structure
    if (data.events && Array.isArray(data.events)) {
      return { 
        valid: true, 
        eventCount: data.events.length,
        totalCount: data.pagination?.object_count || 0
      };
    }
    
    return { valid: false, reason: 'Invalid response structure' };
  } catch (error) {
    return { valid: false, reason: error.message };
  }
}

/**
 * Validate all organization IDs for a city
 */
async function validateCityOrganizations(city, orgIds) {
  console.log(`\n🔍 Validating ${orgIds.length} organizations for ${city}...\n`);
  
  const validIds = [];
  const invalidIds = [];
  
  for (let i = 0; i < orgIds.length; i++) {
    const orgId = orgIds[i];
    process.stdout.write(`  [${i + 1}/${orgIds.length}] Testing ${orgId}... `);
    
    const result = await validateOrganizationId(orgId);
    
    if (result.valid) {
      validIds.push({
        id: orgId,
        eventCount: result.eventCount,
        totalCount: result.totalCount
      });
      console.log(`✅ Valid (${result.totalCount} events)`);
    } else {
      invalidIds.push({ id: orgId, reason: result.reason });
      console.log(`❌ Invalid (${result.reason})`);
    }
    
    // Delay between requests (except for last one)
    if (i < orgIds.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }
  
  console.log(`\n📊 Results for ${city}:`);
  console.log(`   ✅ Valid: ${validIds.length}`);
  console.log(`   ❌ Invalid: ${invalidIds.length}`);
  
  if (validIds.length > 0) {
    console.log(`\n   Valid organization IDs:`);
    validIds.forEach(({ id, totalCount }) => {
      console.log(`     - ${id} (${totalCount} events)`);
    });
  }
  
  return {
    city,
    validIds: validIds.map(v => v.id),
    invalidIds: invalidIds.map(v => v.id),
    stats: {
      valid: validIds.length,
      invalid: invalidIds.length,
      total: orgIds.length
    }
  };
}

/**
 * Update the eventbrite.ts file with validated organization IDs
 */
function updateEventbriteFile(validatedCities) {
  const filePath = join(__dirname, '..', 'services', 'eventbrite.ts');
  
  try {
    let content = readFileSync(filePath, 'utf-8');
    
    // Find and replace each city's organization list
    for (const { city, validIds } of validatedCities) {
      const cityPattern = new RegExp(`(['"])${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1:\\s*\\[[^\\]]*\\]`, 'g');
      
      if (cityPattern.test(content)) {
        const orgIdsStr = validIds.length > 0 
          ? validIds.map(id => `    '${id}'`).join(',\n')
          : '    // No valid organizations found';
        
        content = content.replace(
          cityPattern,
          `'${city}': [\n${orgIdsStr}\n  ]`
        );
      }
    }
    
    writeFileSync(filePath, content, 'utf-8');
    console.log(`\n✅ Updated services/eventbrite.ts with validated organization IDs\n`);
  } catch (error) {
    console.error(`\n❌ Error updating file:`, error.message);
    console.log(`\n📋 Validated organization IDs (add manually):\n`);
    validatedCities.forEach(({ city, validIds }) => {
      console.log(`'${city}': [\n${validIds.map(id => `  '${id}'`).join(',\n')}\n],\n`);
    });
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Eventbrite Organization ID Validator\n');
  console.log('This script will test each organization ID to see if it\'s valid...\n');
  
  if (!EVENTBRITE_API_TOKEN && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
    console.error('❌ Error: Need either EVENTBRITE_API_TOKEN or SUPABASE_URL + SUPABASE_ANON_KEY');
    console.log('\nSet environment variables:');
    console.log('  export VITE_EVENTBRITE_API_TOKEN=your_token');
    console.log('  OR');
    console.log('  export VITE_SUPABASE_URL=your_url');
    console.log('  export VITE_SUPABASE_ANON_KEY=your_key');
    process.exit(1);
  }
  
  // Read the current CITY_ORGANIZATIONS from the file
  const filePath = join(__dirname, '..', 'services', 'eventbrite.ts');
  const content = readFileSync(filePath, 'utf-8');
  
  // Extract CITY_ORGANIZATIONS object using regex
  const cityOrgPattern = /export const CITY_ORGANIZATIONS: Record<string, string\[\]> = \{([^}]+)\};/s;
  const match = content.match(cityOrgPattern);
  
  if (!match) {
    console.error('❌ Could not find CITY_ORGANIZATIONS in eventbrite.ts');
    process.exit(1);
  }
  
  // Parse cities and their organization IDs
  const cities = {
    'Berlin': [],
    'London': [],
    'New York': [],
    'Los Angeles': [],
    'Vancouver': [],
    'Calgary': [],
    'Tokyo': []
  };
  
  // Extract each city's organizations
  for (const city of Object.keys(cities)) {
    // Match the city entry, handling multiline arrays
    const cityPattern = new RegExp(`['"]${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]:\\s*\\[([^\\]]*(?:\\[[^\\]]*\\][^\\]]*)*)\\]`, 's');
    const cityMatch = content.match(cityPattern);
    if (cityMatch && cityMatch[1]) {
      const orgIdsStr = cityMatch[1];
      // Extract organization IDs (they're quoted strings)
      const orgIdPattern = /['"](\d+)['"]/g;
      const orgIds = [];
      let match;
      while ((match = orgIdPattern.exec(orgIdsStr)) !== null) {
        orgIds.push(match[1]);
      }
      cities[city] = orgIds;
    }
  }
  
  console.log(`Found cities: ${Object.keys(cities).join(', ')}\n`);
  
  const totalOrgs = Object.values(cities).flat().length;
  console.log(`Total organizations to validate: ${totalOrgs}\n`);
  console.log(`Estimated time: ${Math.ceil(totalOrgs * DELAY_MS / 1000 / 60)} minutes\n`);
  
  // Allow limiting to specific cities or number of orgs per city
  const scriptArgs = process.argv.slice(2);
  const limitPerCity = scriptArgs.includes('--limit') 
    ? parseInt(scriptArgs[scriptArgs.indexOf('--limit') + 1]) || 10
    : null;
  const cityFilter = scriptArgs.find(arg => arg.startsWith('--city='))?.split('=')[1];
  
  if (limitPerCity) {
    console.log(`⚠️  Limiting to ${limitPerCity} organizations per city for faster validation\n`);
    for (const city of Object.keys(cities)) {
      if (cities[city].length > limitPerCity) {
        cities[city] = cities[city].slice(0, limitPerCity);
      }
    }
  }
  
  if (cityFilter) {
    console.log(`⚠️  Filtering to city: ${cityFilter}\n`);
    const filteredCities = {};
    if (cities[cityFilter]) {
      filteredCities[cityFilter] = cities[cityFilter];
    }
    Object.assign(cities, filteredCities);
  }
  
  // Validate each city
  const validatedCities = [];
  for (const [city, orgIds] of Object.entries(cities)) {
    if (orgIds.length === 0) {
      console.log(`\n⏭️  Skipping ${city} (no organizations configured)`);
      continue;
    }
    
    const result = await validateCityOrganizations(city, orgIds);
    validatedCities.push(result);
    
    // Delay between cities
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }
  
  // Summary
  console.log('\n\n📊 SUMMARY\n');
  console.log('═'.repeat(50));
  validatedCities.forEach(({ city, stats }) => {
    console.log(`${city}:`);
    console.log(`  Valid: ${stats.valid}/${stats.total} (${Math.round(stats.valid / stats.total * 100)}%)`);
  });
  console.log('═'.repeat(50));
  
  const totalValid = validatedCities.reduce((sum, { stats }) => sum + stats.valid, 0);
  const totalInvalid = validatedCities.reduce((sum, { stats }) => sum + stats.invalid, 0);
  const total = totalValid + totalInvalid;
  
  console.log(`\nTotal: ${totalValid} valid, ${totalInvalid} invalid (${Math.round(totalValid / total * 100)}% valid)\n`);
  
  // Ask if user wants to update the file
  console.log('💾 Update services/eventbrite.ts with validated IDs? (y/n)');
  
  // For automated runs, use --update flag
  const args = process.argv.slice(2);
  const shouldUpdate = args.includes('--update') || args.includes('-y');
  
  if (shouldUpdate) {
    updateEventbriteFile(validatedCities);
  } else {
    console.log('\n💡 Run with --update flag to automatically update the file');
    console.log('   Example: node scripts/validate-eventbrite-organizations.mjs --update\n');
  }
}

main().catch(console.error);
