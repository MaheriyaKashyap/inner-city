/**
 * Eventbrite Organization ID Finder
 * 
 * This script searches Eventbrite for events in a city and extracts organization IDs
 * from the search results. It can be run from the command line.
 * 
 * Usage:
 *   node scripts/find-eventbrite-organizations.mjs "Berlin" "techno"
 *   node scripts/find-eventbrite-organizations.mjs "London" "music"
 *   node scripts/find-eventbrite-organizations.mjs "New York" "nightlife" --update-file
 */

import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Eventbrite search URL (public search page)
const EVENTBRITE_SEARCH_BASE = 'https://www.eventbrite.com/d';

/**
 * Search Eventbrite for events and extract organization IDs
 */
async function findOrganizationIds(city, keyword = '') {
  console.log(`\n🔍 Searching Eventbrite for "${city}"${keyword ? ` (keyword: "${keyword}")` : ''}...\n`);

  const searchUrl = `${EVENTBRITE_SEARCH_BASE}/${city.toLowerCase().replace(/\s+/g, '-')}${keyword ? `--${keyword.toLowerCase().replace(/\s+/g, '-')}` : ''}/`;
  
  console.log(`Search URL: ${searchUrl}\n`);

  try {
    // Fetch the search page
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Extract organization IDs from the HTML using multiple patterns
    const orgIdPatterns = [
      /"organization_id":\s*"(\d+)"/g,
      /\/o\/[^\/]+\/(\d+)/g,
      /organizer_id["']:\s*["'](\d+)["']/g,
      /data-organizer-id=["'](\d+)["']/g,
      /href=["']\/o\/[^\/]+\/(\d+)/g,
      /organizerId["']:\s*["'](\d+)["']/g,
    ];

    const foundIds = new Set();

    for (const pattern of orgIdPatterns) {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const id = match[1];
        // Organization IDs are typically 10+ digits
        if (id && id.length >= 8) {
          foundIds.add(id);
        }
      }
    }

    // Also try to extract from JSON-LD structured data
    const jsonLdPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gs;
    let jsonMatch;
    while ((jsonMatch = jsonLdPattern.exec(html)) !== null) {
      try {
        const jsonData = JSON.parse(jsonMatch[1]);
        if (Array.isArray(jsonData)) {
          jsonData.forEach(item => {
            if (item.organizer && item.organizer.url) {
              const orgMatch = item.organizer.url.match(/\/(\d+)$/);
              if (orgMatch) foundIds.add(orgMatch[1]);
            }
          });
        } else if (jsonData.organizer && jsonData.organizer.url) {
          const orgMatch = jsonData.organizer.url.match(/\/(\d+)$/);
          if (orgMatch) foundIds.add(orgMatch[1]);
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }

    // Extract from inline JavaScript data
    const inlineDataPattern = /window\.__SERVER_DATA__\s*=\s*({.*?});/s;
    const inlineMatch = html.match(inlineDataPattern);
    if (inlineMatch) {
      try {
        const serverData = JSON.parse(inlineMatch[1]);
        // Recursively search for organization IDs in the data structure
        const searchInObject = (obj) => {
          if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
              if (key.includes('organizer') || key.includes('organization')) {
                if (typeof obj[key] === 'string' && /^\d{8,}$/.test(obj[key])) {
                  foundIds.add(obj[key]);
                } else if (typeof obj[key] === 'number') {
                  foundIds.add(String(obj[key]));
                }
              }
              if (typeof obj[key] === 'object') {
                searchInObject(obj[key]);
              }
            }
          }
        };
        searchInObject(serverData);
      } catch (e) {
        // Skip if parsing fails
      }
    }

    const orgIds = Array.from(foundIds).filter(id => id.length >= 8 && id.length <= 15);

    console.log(`✅ Found ${orgIds.length} organization IDs:\n`);
    orgIds.forEach((id, index) => {
      console.log(`  ${index + 1}. ${id}`);
    });

    return orgIds;
  } catch (error) {
    console.error(`❌ Error searching Eventbrite:`, error.message);
    return [];
  }
}

/**
 * Alternative: Use Eventbrite API to search (if we have a token)
 */
async function findOrganizationIdsViaAPI(city, keyword = '', apiToken) {
  if (!apiToken) {
    console.log('⚠️  No API token provided, using web scraping method instead...\n');
    return findOrganizationIds(city, keyword);
  }

  console.log(`\n🔍 Searching Eventbrite API for "${city}"${keyword ? ` (keyword: "${keyword}")` : ''}...\n`);

  try {
    // Try to get user's organizations first
    const userUrl = `https://www.eventbriteapi.com/v3/users/me/organizations/?token=${apiToken}`;
    const userResponse = await fetch(userUrl);
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      const orgIds = new Set();
      
      if (userData.organizations) {
        userData.organizations.forEach(org => {
          if (org.id) orgIds.add(org.id);
        });
      }

      const ids = Array.from(orgIds);
      if (ids.length > 0) {
        console.log(`✅ Found ${ids.length} organization IDs via API (your organizations):\n`);
        ids.forEach((id, index) => {
          console.log(`  ${index + 1}. ${id}`);
        });
        return ids;
      }
    }

    // Fallback to web scraping
    console.log('⚠️  API method limited, falling back to web scraping...\n');
    return findOrganizationIds(city, keyword);
  } catch (error) {
    console.log('⚠️  API method failed, falling back to web scraping...\n');
    return findOrganizationIds(city, keyword);
  }
}

/**
 * Update the eventbrite.ts file with found organization IDs
 */
function updateEventbriteFile(city, orgIds) {
  const filePath = join(__dirname, '..', 'services', 'eventbrite.ts');
  
  try {
    let content = readFileSync(filePath, 'utf-8');
    
    // Find the CITY_ORGANIZATIONS object and update it
    const cityPattern = new RegExp(`(['"])${city}\\1:\\s*\\[[^\\]]*\\]`, 'g');
    
    if (cityPattern.test(content)) {
      // Replace existing city entry
      const orgIdsStr = orgIds.map(id => `    '${id}'`).join(',\n');
      content = content.replace(
        cityPattern,
        `'${city}': [\n${orgIdsStr}\n  ]`
      );
    } else {
      // Add new city entry before the closing brace
      const orgIdsStr = orgIds.map(id => `    '${id}'`).join(',\n');
      const insertPoint = content.lastIndexOf('};');
      
      if (insertPoint !== -1) {
        const before = content.substring(0, insertPoint);
        const after = content.substring(insertPoint);
        content = before + `  '${city}': [\n${orgIdsStr}\n  ],\n` + after;
      }
    }
    
    writeFileSync(filePath, content, 'utf-8');
    console.log(`\n✅ Updated services/eventbrite.ts with ${orgIds.length} organization IDs for ${city}\n`);
  } catch (error) {
    console.error(`❌ Error updating file:`, error.message);
    console.log(`\n📋 Here are the organization IDs to add manually:\n`);
    console.log(`'${city}': [\n${orgIds.map(id => `  '${id}'`).join(',\n')}\n],\n`);
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔍 Eventbrite Organization ID Finder

Usage:
  node scripts/find-eventbrite-organizations.mjs <city> [keyword] [options]

Examples:
  node scripts/find-eventbrite-organizations.mjs "Berlin" "techno"
  node scripts/find-eventbrite-organizations.mjs "London" "music" --update-file
  node scripts/find-eventbrite-organizations.mjs "New York" --api-token YOUR_TOKEN --update-file

Options:
  --update-file          Automatically update services/eventbrite.ts with found IDs
  --api-token <token>    Use Eventbrite API token (optional, falls back to web scraping)

Tips:
  - Try different keywords: "techno", "nightlife", "music", "rave", "underground"
  - Use --update-file to automatically add IDs to your code
  - The script searches Eventbrite's public search pages
    `);
    process.exit(1);
  }

  const city = args[0];
  const keyword = args[1] && !args[1].startsWith('--') ? args[1] : '';
  const updateFile = args.includes('--update-file');
  const apiTokenIndex = args.indexOf('--api-token');
  const apiToken = apiTokenIndex !== -1 && args[apiTokenIndex + 1] ? args[apiTokenIndex + 1] : 
                   process.env.VITE_EVENTBRITE_API_TOKEN || null;

  let orgIds;

  if (apiToken) {
    orgIds = await findOrganizationIdsViaAPI(city, keyword, apiToken);
  } else {
    orgIds = await findOrganizationIds(city, keyword);
  }

  if (orgIds.length === 0) {
    console.log('\n⚠️  No organization IDs found. Try:');
    console.log('   - Different keywords (e.g., "techno", "nightlife", "music", "rave")');
    console.log('   - Checking the Eventbrite website manually');
    console.log('   - Using --api-token option if you have one');
    console.log('   - The city name might need to be formatted differently\n');
    process.exit(1);
  }

  if (updateFile) {
    updateEventbriteFile(city, orgIds);
  } else {
    console.log(`\n📋 To add these to your code, update services/eventbrite.ts:\n`);
    console.log(`'${city}': [\n${orgIds.map(id => `  '${id}'`).join(',\n')}\n],\n`);
    console.log(`\n💡 Tip: Run with --update-file to automatically update the file\n`);
  }
}

main().catch(console.error);
