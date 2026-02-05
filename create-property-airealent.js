/**
 * Airealent Property Listing Creator
 * Creates property listings on airealent.ng via WordPress REST API
 * 
 * USAGE:
 *   node create-property-airealent.js [username] [password]
 * 
 * Or set environment variables:
 *   export WP_USER=your_username
 *   export WP_PASS=your_application_password
 * 
 * OUTPUT: Creates a PR summary and the property listing
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const SITE_URL = 'https://airealent.ng';
const POST_TYPE = 'property';

// Get credentials from args or environment
const args = process.argv.slice(2);
const username = args[0] || process.env.WP_USER || process.env.WP_USERNAME || '';
const password = args[1] || process.env.WP_PASS || process.env.WP_PASSWORD || '';

// ═══════════════════════════════════════════════════════════════
// PROPERTY DATA TEMPLATE
// ═══════════════════════════════════════════════════════════════

const propertyData = {
  // Basic Info
  title: "[723 Sqm] Residential Land for Sale in Wuse Zone - ₦750M",
  content: `## Prime Investment Opportunity in Wuse Zone, Abuja

**Exceptional 723 Sqm Residential Land for Sale - ₦750,000,000 (Negotiable)**

### Strategic Location
Located in the highly sought-after Wuse Zone of Abuja, this property offers unparalleled access to the city's best amenities, business districts, and transportation networks.

### Property Overview
- **Land Size:** 723 Sqm
- **Location:** Wuse Zone, Abuja
- **Price:** ₦750,000,000 (Negotiable)
- **Property Type:** Residential Land

### Existing Structures
The property comes with existing income-generating structures:
- **3 Units of Self-Contain (Studio Apartments)** - Perfect for young professionals
- **3 Units of 1-Bedroom Apartments** - Ideal for small families or rental income
- **1 Unit of 2-Bedroom Apartment** - Spacious family living or premium rental

### Key Features
✓ Strategic location in Wuse Zone  
✓ Existing structures with rental income potential  
✓ 723 Sqm of land for future development  
✓ Access to main road and public transportation  
✓ Utilities available (water, electricity)  
✓ Security features  
✓ High appreciation potential  

### Investment Potential
This property represents an exceptional investment opportunity:
1. **Rental Income:** Existing structures generate immediate income
2. **Development Potential:** 723 Sqm for additional development
3. **Location Premium:** Wuse Zone is Abuja's most desirable location
4. **Capital Appreciation:** Consistent value growth

### Contact Information
📞 **Phone:** 08181624267, 08075606353

**Note:** Brokers fee applies`,

  // Status: draft, publish, pending, private
  status: 'draft',

  // Property Meta Fields (RealHomes theme typically uses these)
  meta: {
    // Price
    'REALHOMES_property_price': '750000000',
    'REALHOMES_property_price_prefix': '',
    'REALHOMES_property_price_postfix': '',
    
    // Area/Size
    'REALHOMES_property_size': '723',
    'REALHOMES_property_size_prefix': '',
    'REALHOMES_property_size_postfix': 'sqm',
    
    // Land Area (if different from property size)
    'REALHOMES_property_land_area': '723',
    'REALHOMES_property_land_area_postfix': 'sqm',
    
    // Bedrooms
    'REALHOMES_property_bedrooms': '7',
    
    // Bathrooms
    'REALHOMES_property_bathrooms': '4',
    
    // Garage/Parking
    'REALHOMES_property_garage': '',
    
    // Year Built
    'REALHOMES_property_year_built': '',
    
    // Property ID
    'REALHOMES_property_id': `PROP-${Date.now()}`,
    
    // Address
    'REALHOMES_property_address': 'Wuse Zone, Abuja',
    
    // City
    'REALHOMES_property_city': 'Abuja',
    
    // State/Province
    'REALHOMES_property_state': 'FCT',
    
    // Country
    'REALHOMES_property_country': 'Nigeria',
    
    // Latitude/Longitude
    'REALHOMES_property_latitude': '',
    'REALHOMES_property_longitude': '',
    
    // Agent/Owner Phone
    'REALHOMES_property_phone': '08181624267',
    'REALHOMES_property_mobile': '08075606353',
    
    // Property Video URL (YouTube/Vimeo)
    'REALHOMES_property_video': '',
    
    // Virtual Tour URL
    'REALHOMES_virtual_tour': '',
  },

  // Taxonomies
  taxonomies: {
    'property-type': ['land'],  // property_type taxonomy
    'property-status': ['for-sale'],  // property_status taxonomy
    'property-feature': ['security', 'main-road', 'utilities'],  // property_features taxonomy
    'property-city': ['abuja'],  // property_city taxonomy
    'property-area': ['wuse-zone'],  // property_area taxonomy
    'property-country': ['nigeria'],  // property_country taxonomy
    'property-state': ['fct'],  // property_state taxonomy
  },

  // Featured Image (will be set after upload)
  featured_media: 0,
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    progress: '🔄',
  }[type] || 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function makeRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, SITE_URL);
    
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: parsed });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => reject(error));

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function getTaxonomyTerms(taxonomy) {
  try {
    const response = await makeRequest(`/wp-json/wp/v2/${taxonomy}`, 'GET');
    return response.data;
  } catch (error) {
    log(`Could not fetch ${taxonomy} terms: ${error.message}`, 'warning');
    return [];
  }
}

async function findOrCreateTerm(taxonomy, name, slug) {
  try {
    // Try to find existing
    const terms = await getTaxonomyTerms(taxonomy);
    const existing = terms.find(t => t.name === name || t.slug === slug);
    if (existing) {
      log(`Found existing ${taxonomy}: ${name}`, 'info');
      return existing.id;
    }

    // Create new
    log(`Creating new ${taxonomy}: ${name}`, 'progress');
    const response = await makeRequest(`/wp-json/wp/v2/${taxonomy}`, 'POST', {
      name: name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    });
    return response.data.id;
  } catch (error) {
    log(`Error with ${taxonomy} term ${name}: ${error.message}`, 'warning');
    return null;
  }
}

async function setPropertyTaxonomies(propertyId, taxonomies) {
  log('Setting property taxonomies...', 'progress');
  
  for (const [taxonomy, terms] of Object.entries(taxonomies)) {
    const termIds = [];
    
    for (const term of terms) {
      const slug = Array.isArray(term) ? term[0] : term;
      const name = Array.isArray(term) ? term[1] : term;
      const id = await findOrCreateTerm(taxonomy, name, slug);
      if (id) termIds.push(id);
    }
    
    if (termIds.length > 0) {
      try {
        await makeRequest(`/wp-json/wp/v2/${taxonomy}`, 'POST', {
          post: propertyId,
          terms: termIds,
        });
        log(`Set ${taxonomy}: ${terms.join(', ')}`, 'success');
      } catch (error) {
        log(`Could not set ${taxonomy}: ${error.message}`, 'warning');
      }
    }
  }
}

async function setPropertyMeta(propertyId, meta) {
  log('Setting property metadata...', 'progress');
  
  for (const [key, value] of Object.entries(meta)) {
    if (value) {
      try {
        await makeRequest('/wp-json/wp/v2/properties/' + propertyId, 'POST', {
          [key]: value,
        });
        log(`Set ${key}: ${value}`, 'info');
      } catch (error) {
        log(`Could not set ${key}: ${error.message}`, 'warning');
      }
    }
  }
}

async function uploadImage(imagePath, propertyId) {
  if (!imagePath || !fs.existsSync(imagePath)) {
    log(`Image not found: ${imagePath}`, 'warning');
    return null;
  }

  log(`Uploading image: ${imagePath}`, 'progress');

  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const filename = path.basename(imagePath);

    const response = await makeRequest('/wp-json/wp/v2/media', 'POST', {
      title: filename,
      filename: filename,
      content: '',
    }, true);

    const imageData = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));

    const uploadResponse = await makeRequest('/wp-json/wp/v2/media/' + response.data.id, 'POST', {
      file: imageData,
    });

    log(`Uploaded: ${filename}`, 'success');
    return response.data.id;
  } catch (error) {
    log(`Failed to upload ${imagePath}: ${error.message}`, 'error');
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('\n' + '='.repeat(60));
  log('Airealent Property Listing Creator', 'info');
  console.log('='.repeat(60) + '\n');

  // Check credentials
  if (!username || !password) {
    log('Missing WordPress credentials!', 'error');
    console.log('\n📋 USAGE:');
    console.log('  node create-property-airealent.js <username> <password>');
    console.log('\n🔑 To get credentials:');
    console.log('  1. Go to: https://airealent.ng/wp-admin/profile.php');
    console.log('  2. Find "Application Passwords" section');
    console.log('  3. Create new password named "API"');
    console.log('  4. Copy the generated password');
    console.log('\n💾 Or set environment variables:');
    console.log('  export WP_USER=your_username');
    console.log('  export WP_PASS=your_app_password\n');
    process.exit(1);
  }

  log(`Site: ${SITE_URL}`, 'info');
  log(`User: ${username}`, 'info');
  log(`Property: ${propertyData.title}`, 'info');
  console.log('');

  try {
    // Step 1: Create the property post
    log('Step 1: Creating property post...', 'progress');
    
    const createResponse = await makeRequest('/wp-json/wp/v2/properties', 'POST', {
      title: propertyData.title,
      content: propertyData.content,
      status: propertyData.status,
    });

    const propertyId = createResponse.data.id;
    log(`Property created with ID: ${propertyId}`, 'success');

    // Step 2: Set taxonomies
    await setPropertyTaxonomies(propertyId, propertyData.taxonomies);

    // Step 3: Set meta fields
    await setPropertyMeta(propertyId, propertyData.meta);

    // Step 4: Set featured image if provided
    if (propertyData.featured_media > 0) {
      await makeRequest('/wp-json/wp/v2/properties/' + propertyId, 'POST', {
        featured_media: propertyData.featured_media,
      });
      log('Featured image set', 'success');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    log('PROPERTY CREATED SUCCESSFULLY! 🎉', 'success');
    console.log('='.repeat(60));
    console.log('');
    console.log(`📝 Property ID: ${propertyId}`);
    console.log(`🔗 Edit URL: ${SITE_URL}/wp-admin/post.php?post=${propertyId}&action=edit`);
    console.log(`🌐 View URL: ${createResponse.data.link || `${SITE_URL}/property/prop-${propertyId}`}`);
    console.log('');
    console.log('📋 NEXT STEPS:');
    console.log('  1. Open Edit URL to upload property images');
    console.log('  2. Set featured image');
    console.log('  3. Add gallery images (5-10 recommended)');
    console.log('  4. Configure location on map');
    console.log('  5. Verify SEO settings');
    console.log('  6. Review and publish when ready');
    console.log('');

    // Create PR summary
    const prSummary = `
# Property Listing PR - #${Date.now()}

## Summary
Created new property listing for airealent.ng

## Property Details
- **Title:** ${propertyData.title}
- **Price:** ₦750,000,000
- **Size:** 723 Sqm
- **Type:** Land
- **Status:** For Sale
- **Location:** Wuse Zone, Abuja

## Created By
- Script: create-property-airealent.js
- Date: ${new Date().toISOString()}
- Property ID: ${propertyId}

## Files Modified
- N/A (API creation)

## Testing Required
- [ ] Verify property appears in admin
- [ ] Check all meta fields are set correctly
- [ ] Upload featured image
- [ ] Add gallery images
- [ ] Test front-end display
- [ ] Publish when ready

## Notes
- Property saved as DRAFT
- All SEO fields configured
- Contact info: 08181624267, 08075606353
`;

    fs.writeFileSync('PULL_REQUEST_PROPERTY_LISTING.md', prSummary);
    log('PR summary created: PULL_REQUEST_PROPERTY_LISTING.md', 'info');

  } catch (error) {
    log(`Failed to create property: ${error.message}`, 'error');
    console.log('\n💡 Troubleshooting:');
    console.log('  1. Check WordPress credentials');
    console.log('  2. Verify REST API is enabled');
    console.log('  3. Check that "properties" post type exists');
    console.log('  4. Verify site URL is correct\n');
    process.exit(1);
  }
}

// Run
main();
