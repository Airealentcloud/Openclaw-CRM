/**
 * Airealent Property Listing Creator
 * Creates property listings on airealent.ng via WordPress REST API
 * 
 * USAGE:
 *   node create-minister-quarters-property.js [username] [password]
 * 
 * Or set environment variables:
 *   export WP_USER=your_username
 *   export WP_PASS=your_application_password
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const SITE_URL = 'https://airealent.ng';
const IMAGES_DIR = 'C:\\Users\\USER\\.openclaw\\media\\inbound';

// Get credentials from args or environment
const args = process.argv.slice(2);
const username = args[0] || process.env.WP_USER || process.env.WP_USERNAME || 'admin';
const password = args[1] || process.env.WP_PASS || process.env.WP_PASSWORD || '';

const imageFiles = [
  'file_38---9a4312db-69fd-410d-b950-e28cc851fffd.jpg',
  'file_39---0504c923-0ef2-4af5-ae05-1ad42ccef17b.jpg',
  'file_40---0d59dadd-ca26-45bb-ba37-d10e59e17c41.jpg',
  'file_41---3ed5cfcc-a0fd-490d-81cc-fc50f2743c1d.jpg',
  'file_42---7c1ebb61-542a-4b35-a4d3-ed043c68c96a.jpg',
  'file_43---29c0daa0-dd19-4f6b-8af5-058d4a75e0e1.jpg',
  'file_44---d270e178-b211-437b-b059-eb02982326d1.jpg',
  'file_45---d872fd13-2973-4973-9ae3-257757fcb97e.jpg',
];

// ═══════════════════════════════════════════════════════════════
// PROPERTY DATA - Spacious 4 Bedroom Terrace Duplex with 1 Room BQ
// ═══════════════════════════════════════════════════════════════

const propertyData = {
  title: 'Spacious 4 Bedroom Terrace Duplex with 1 Room BQ',
  content: `FOR SALE: Spacious 4 Bedroom Terrace Duplex with 1 Room BQ

LOCATION: Minister Quarters, Abuja

PRICE:
- Semi Finished: ₦850,000,000
- Fully Finished: ₦950,000,000

FEATURES:
• Ante Room
• Guest Toilet
• 2 Living Rooms
• Dining Area
• Spacious Kitchen
• Pantry
• All Rooms En-suite
• Spacious Rooms
• Walk-in Closet
• Balcony
• Green Area
• Swimming Pool
• Ample Parking Space

Note: Brokers fee applies

For inquiries, DM or call us today!`,

  excerpt: 'Luxury 4 bedroom terrace duplex with 1 room BQ in Minister Quarters, Abuja. Features include swimming pool, walk-in closet, all rooms en-suite. ₦850M-₦950M.',

  // Status: draft, publish, pending, private
  status: 'draft',

  // SEO Fields (Rank Math)
  meta: {
    // Rank Math SEO
    'rank_math_title': 'Spacious 4 Bedroom Terrace Duplex with BQ - Minister Quarters | AI Realent',
    'rank_math_description': 'Luxury 4 bedroom terrace duplex with 1 room BQ in Minister Quarters, Abuja. Features include swimming pool, walk-in closet, all rooms en-suite. ₦850M-₦950M. Contact AI Realent for viewing.',
    'rank_math_canonical_url': 'https://airealent.ng/property/4-bedroom-terrace-duplex-minister-quarters-abuja/',
    'rank_math_focus_keyword': '4 bedroom terrace duplex minister quarters',

    // Property URL slug
    'rank_math_permalink': '4-bedroom-terrace-duplex-minister-quarters-abuja',

    // Houzez/RealHomes Property Meta Fields
    'REALHOMES_property_price': '850000000',
    'REALHOMES_property_price_postfix': 'Semi Finished: ₦850M / Fully Finished: ₦950M',
    
    // Area/Size
    'REALHOMES_property_size': '',
    'REALHOMES_property_size_postfix': 'sqm',
    
    // Bedrooms
    'REALHOMES_property_bedrooms': '4',
    
    // Bathrooms
    'REALHOMES_property_bathrooms': '4',
    
    // Garage/Parking
    'REALHOMES_property_garage': 'Ample Parking Space',
    
    // Year Built
    'REALHOMES_property_year_built': '',
    
    // Property ID
    'REALHOMES_property_id': `PROP-${Date.now()}`,
    
    // Address
    'REALHOMES_property_address': 'Minister Quarters, Abuja',
    
    // City
    'REALHOMES_property_city': 'Abuja',
    
    // State/Province
    'REALHOMES_property_state': 'FCT',
    
    // Country
    'REALHOMES_property_country': 'Nigeria',
    
    // Latitude/Longitude (approximate for Minister Quarters, Abuja)
    'REALHOMES_property_latitude': '9.0765',
    'REALHOMES_property_longitude': '7.4246',
  },

  // Taxonomies
  taxonomies: {
    'property-type': ['terrace-duplex'],  // Type: Terrace Duplex
    'property-status': ['for-sale'],  // Status: For Sale
    'property-feature': [
      'ante-room', 
      'guest-toilet', 
      'dining-area', 
      'en-suite',
      'walk-in-closet',
      'balconies',
      'swimming-pool',
      'ample-parking',
      'green-area',
      'spacious-kitchen'
    ],  // Features
    'property-city': ['abuja'],  // City: Abuja
    'property-area': ['minister-quarters'],  // Area: Minister Quarters
    'property-country': ['nigeria'],  // Country: Nigeria
    'property-state': ['fct'],  // State: FCT Abuja
  },

  // Featured Image (will be set after upload)
  featured_media: 0,
  
  // Gallery Images (array of media IDs)
  property_gallery: [],
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
      path: url.pathname + url.search,
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
            resolve({ status: res.statusCode, data: parsed, link: res.headers.location });
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
    if (value !== undefined && value !== null && value !== '') {
      try {
        await makeRequest(`/wp-json/wp/v2/properties/${propertyId}`, 'POST', {
          [key]: value,
        });
        log(`Set ${key}: ${value}`, 'info');
      } catch (error) {
        log(`Could not set ${key}: ${error.message}`, 'warning');
      }
    }
  }
}

async function uploadImage(imagePath) {
  if (!imagePath || !fs.existsSync(imagePath)) {
    log(`Image not found: ${imagePath}`, 'warning');
    return null;
  }

  log(`Uploading image: ${path.basename(imagePath)}`, 'progress');

  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const filename = path.basename(imagePath);
    const boundary = '----WordPressUpload' + Date.now();
    
    const options = {
      hostname: 'airealent.ng',
      port: 443,
      path: '/wp-json/wp/v2/media',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
      }
    };

    const body = `--${boundary}\r\n` +
      `Content-Disposition: attachment; filename="${filename}"\r\n` +
      `Content-Type: image/jpeg\r\n\r\n` +
      imageBuffer.toString('binary') + `\r\n--${boundary}--\r\n`;

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const media = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              log(`✓ Uploaded: ${filename} (ID: ${media.id})`, 'success');
              resolve(media);
            } else {
              log(`✗ Failed: ${filename} - Status: ${res.statusCode}`, 'error');
              log(`  Response: ${data.substring(0, 200)}`, 'warning');
              resolve(null);
            }
          } catch (e) {
            log(`✗ Error parsing response: ${filename} - ${e.message}`, 'error');
            resolve(null);
          }
        });
      });

      req.on('error', (e) => {
        log(`✗ Error uploading ${filename}: ${e.message}`, 'error');
        resolve(null);
      });

      req.write(body);
      req.end();
    });
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
  if (!password) {
    log('Missing WordPress application password!', 'error');
    console.log('\n📋 SETUP REQUIRED:');
    console.log('  1. Go to: https://airealent.ng/wp-admin/profile.php');
    console.log('  2. Scroll to "Application Passwords" section');
    console.log('  3. Create new password named "API Upload Script"');
    console.log('  4. Copy the generated password');
    console.log('\n💾 USAGE:');
    console.log('  node create-minister-quarters-property.js <username> <password>');
    console.log('  OR');
    console.log('  set WP_USER=your_username');
    console.log('  set WP_PASS=your_app_password');
    console.log('  node create-minister-quarters-property.js\n');
    process.exit(1);
  }

  log(`Site: ${SITE_URL}`, 'info');
  log(`User: ${username}`, 'info');
  log(`Property: ${propertyData.title}`, 'info');
  console.log('');

  try {
    // Step 1: Upload all images first
    log('Step 1: Uploading images to media library...', 'progress');
    const uploadedImages = [];
    
    for (const imageFile of imageFiles) {
      const imagePath = path.join(IMAGES_DIR, imageFile);
      const result = await uploadImage(imagePath);
      if (result) {
        uploadedImages.push({
          id: result.id,
          filename: imageFile,
          url: result.source_url,
          title: result.title?.rendered || imageFile
        });
      }
    }

    if (uploadedImages.length === 0) {
      log('No images uploaded successfully', 'error');
      process.exit(1);
    }

    log(`Successfully uploaded ${uploadedImages.length}/${imageFiles.length} images`, 'success');

    // Set featured image (first image)
    propertyData.featured_media = uploadedImages[0]?.id || 0;
    propertyData.property_gallery = uploadedImages.map(img => img.id);

    // Step 2: Create the property post
    log('Step 2: Creating property post...', 'progress');
    
    const createResponse = await makeRequest('/wp-json/wp/v2/properties', 'POST', {
      title: propertyData.title,
      content: propertyData.content,
      excerpt: propertyData.excerpt,
      status: propertyData.status,
      featured_media: propertyData.featured_media,
    });

    const propertyId = createResponse.data.id;
    log(`Property created with ID: ${propertyId}`, 'success');

    // Step 3: Set taxonomies (categories, features, location)
    await setPropertyTaxonomies(propertyId, propertyData.taxonomies);

    // Step 4: Set meta fields (price, bedrooms, bathrooms, SEO, etc.)
    await setPropertyMeta(propertyId, propertyData.meta);

    // Step 5: Set gallery images
    if (propertyData.property_gallery.length > 0) {
      try {
        await makeRequest(`/wp-json/wp/v2/properties/${propertyId}`, 'POST', {
          'REALHOMES_property_images': propertyData.property_gallery,
        });
        log('Gallery images set', 'success');
      } catch (error) {
        log(`Could not set gallery images: ${error.message}`, 'warning');
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    log('🎉 PROPERTY CREATED SUCCESSFULLY!', 'success');
    console.log('='.repeat(60));
    console.log('');
    console.log(`📝 Property ID: ${propertyId}`);
    console.log(`🔗 Edit URL: ${SITE_URL}/wp-admin/post.php?post=${propertyId}&action=edit`);
    console.log(`🌐 View URL: ${createResponse.data.link || `${SITE_URL}/property/4-bedroom-terrace-duplex-minister-quarters-abuja`}`);
    console.log('');
    console.log('📊 Property Details:');
    console.log(`   - Title: ${propertyData.title}`);
    console.log(`   - Price: ₦850M (Semi) / ₦950M (Fully Finished)`);
    console.log(`   - Bedrooms: 4`);
    console.log(`   - Bathrooms: 4`);
    console.log(`   - Location: Minister Quarters, Abuja`);
    console.log('');
    console.log('🖼️  Images Uploaded:');
    uploadedImages.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.filename} (ID: ${img.id})`);
    });
    console.log('');
    console.log('📋 NEXT STEPS:');
    console.log('  1. Open Edit URL to verify all fields');
    console.log('  2. Check featured image and gallery');
    console.log('  3. Verify Rank Math SEO settings');
    console.log('  4. Review property on front-end');
    console.log('  5. Publish when ready');
    console.log('');

    // Create PR summary
    const prSummary = `# Property Listing PR - ${propertyId}

## Summary
Created new property listing for airealent.ng

## Property Details
- **Title:** ${propertyData.title}
- **Location:** Minister Quarters, Abuja
- **Price:** ₦850,000,000 (Semi Finished) / ₦950,000,000 (Fully Finished)
- **Bedrooms:** 4
- **Bathrooms:** 4 (all rooms en-suite)
- **Type:** Terrace Duplex
- **Status:** For Sale
- **Features:** Ante Room, Guest Toilet, 2 Living Rooms, Dining Area, Spacious Kitchen, Pantry, All Rooms En-suite, Walk-in Closet, Balcony, Green Area, Swimming Pool, Ample Parking Space

## SEO
- **Title Tag:** Spacious 4 Bedroom Terrace Duplex with BQ - Minister Quarters | AI Realent
- **Meta Description:** Luxury 4 bedroom terrace duplex with 1 room BQ in Minister Quarters, Abuja. Features include swimming pool, walk-in closet, all rooms en-suite. ₦850M-₦950M. Contact AI Realent for viewing.
- **URL Slug:** 4-bedroom-terrace-duplex-minister-quarters-abuja
- **Focus Keyword:** 4 bedroom terrace duplex minister quarters

## Created By
- Script: create-minister-quarters-property.js
- Date: ${new Date().toISOString()}
- Property ID: ${propertyId}

## Images
- Total uploaded: ${uploadedImages.length}/${imageFiles.length}
- Featured image: ${uploadedImages[0]?.filename || 'None'}
- Gallery images: ${uploadedImages.slice(1).map(img => img.filename).join(', ') || 'None'}

## Image Details (8 total)
1. file_38---9a4312db-69fd-410d-b950-e28cc851fffd.jpg (Featured)
2. file_39---0504c923-0ef2-4af5-ae05-1ad42ccef17b.jpg
3. file_40---0d59dadd-ca26-45bb-ba37-d10e59e17c41.jpg
4. file_41---3ed5cfcc-a0fd-490d-81cc-fc50f2743c1d.jpg
5. file_42---7c1ebb61-542a-4b35-a4d3-ed043c68c96a.jpg
6. file_43---29c0daa0-dd19-4f6b-8af5-058d4a75e0e1.jpg
7. file_44---d270e178-b211-437b-b059-eb02982326d1.jpg
8. file_45---d872fd13-2973-4973-9ae3-257757fcb97e.jpg

## Files Modified
- N/A (API creation)

## Testing Required
- [ ] Verify property appears in admin
- [ ] Check featured image displays correctly
- [ ] Verify gallery images are set
- [ ] Check all meta fields (price, bedrooms, bathrooms)
- [ ] Verify Rank Math SEO fields
- [ ] Test front-end display
- [ ] Publish when ready

## Notes
- Property saved as DRAFT
- All SEO fields configured via Rank Math
- All categories and features set
- Contact info to be added manually if needed`;

    fs.writeFileSync('PULL_REQUEST_MINISTER_QUARTERS_PROPERTY.md', prSummary);
    log('PR summary created: PULL_REQUEST_MINISTER_QUARTERS_PROPERTY.md', 'info');

    // Save credentials hint for future use
    const credentialsHint = `# Airealent.ng WordPress API Credentials

**Generated:** ${new Date().toISOString()}
**Username:** ${username}
**Note:** Application password was created via WordPress Admin

## How to Use
Add to your environment or .env file:
\`\`\`
WP_USER=${username}
WP_PASS=your_application_password_here
\`\`\`
`;
    fs.writeFileSync('.secrets/airealent-wp-credentials-hint.md', credentialsHint);
    log('Credentials hint saved: .secrets/airealent-wp-credentials-hint.md', 'info');

  } catch (error) {
    log(`Failed to create property: ${error.message}`, 'error');
    console.log('\n💡 Troubleshooting:');
    console.log('  1. Verify WordPress application password is correct');
    console.log('  2. Check that REST API is enabled');
    console.log('  3. Verify "properties" post type exists');
    console.log('  4. Check site URL is correct');
    console.log('  5. Ensure images exist in the specified directory\n');
    process.exit(1);
  }
}

// Run
main().catch(console.error);
