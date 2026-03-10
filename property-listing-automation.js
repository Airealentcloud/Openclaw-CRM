/**
 * Property Listing Automation for airealent.ng
 * Creates property listings via WordPress REST API with Rank Math SEO
 * 
 * Usage: node property-listing-automation.js [--test] [--draft] [--file=property-data.json]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');

// Configuration - USER MUST UPDATE THESE
const SITE_URL = 'https://airealent.ng/wp-json';
const USERNAME = 'YOUR_WORDPRESS_USERNAME'; // TODO: Update with actual username
const PASSWORD = 'YOUR_APPLICATION_PASSWORD'; // TODO: Update with application password

// Property categories mapping (based on airealent.ng structure)
const PROPERTY_TYPES = {
  'apartment': 'Apartment',
  'terrace-duplex': 'Terrace Duplex',
  'semi-detached': 'Semi Detached Duplex',
  'detached': 'Detached Duplex',
  'land': 'Land',
  'commercial': 'Commercial Property',
  'penthouse': 'Penthouse',
  'block-of-flats': 'Block of Flats'
};

const PROPERTY_STATUS = {
  'for-sale': 'For Sale',
  'for-rent': 'For Rent',
  'sold': 'Sold',
  'rented': 'Rented'
};

// Abuja areas for location mapping
const ABUJA_AREAS = [
  'Maitama', 'Asokoro', 'Wuse', 'Garki', 'Jabi', 'Utako', 'Life Camp',
  'Gwarinpa', 'Karsana', 'Katampe', 'Katampe Extension', 'Jahi', 'Dawaki',
  'Lokogoma', 'Apo', 'Mabushi', 'Kado', 'Wuye', 'Gudu', 'Lugbe', 'Kubwa',
  'Galadimawa', 'River Park', 'Guzape'
];

// Common property features
const PROPERTY_FEATURES = [
  'Security', 'Main Road', 'Utilities', 'Guest Toilet', 'Dining Area',
  'Balconies', 'Fitted Kitchen', 'Store', 'En-suite', 'Wardrobe',
  'Ample Parking', 'Green Area', 'Swimming Pool', 'Gym', 'Generator',
  'Water Supply', '24/7 Power', 'CCTV', 'Gated Estate', 'Serviced'
];

// Auth header
let auth = '';
let headers = {};

function initializeAuth(username, password) {
    auth = Buffer.from(`${username}:${password}`).toString('base64');
    headers = {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
    };
}

function httpRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: headers
        };
        
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        
        req.on('error', reject);
        req.setTimeout(30000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function getCustomPostType() {
    // Try to discover the property post type
    try {
        const result = await httpRequest(`${SITE_URL}/wp/v2/types`);
        if (result.status === 200) {
            const types = result.data;
            // Look for property-related post types
            for (const [key, type] of Object.entries(types)) {
                if (key.includes('property') || key.includes('listing') || 
                    type.rest_base.includes('property') || type.rest_base.includes('listing')) {
                    return key;
                }
            }
        }
    } catch (error) {
        console.log('⚠️ Could not auto-detect property post type');
    }
    
    // Default to 'property' which is common for real estate themes
    return 'property';
}

async function getTaxonomyTerms(taxonomy) {
    try {
        const result = await httpRequest(`${SITE_URL}/wp/v2/${taxonomy}`);
        if (result.status === 200) {
            return result.data;
        }
    } catch (error) {
        console.log(`⚠️ Could not fetch ${taxonomy} terms`);
    }
    return [];
}

async function createTaxonomyTerm(taxonomy, name) {
    try {
        const result = await httpRequest(`${SITE_URL}/wp/v2/${taxonomy}`, 'POST', { name });
        if (result.status === 201) {
            return result.data.id;
        }
    } catch (error) {
        console.log(`⚠️ Could not create ${taxonomy} term: ${name}`);
    }
    return null;
}

async function getOrCreateTermId(taxonomy, termName) {
    const terms = await getTaxonomyTerms(taxonomy);
    const existing = terms.find(t => t.name.toLowerCase() === termName.toLowerCase());
    if (existing) return existing.id;
    
    return await createTaxonomyTerm(taxonomy, termName);
}

function generatePropertyDescription(property) {
    const { title, type, location, size, bedrooms, bathrooms, price, features = [] } = property;
    
    let description = `Discover this ${type} ${bedrooms ? bedrooms + '-bedroom' : ''} property located in ${location}, Abuja. `;
    
    if (size) {
        description += `The property sits on ${size} of prime land. `;
    }
    
    if (bedrooms && bathrooms) {
        description += `It features ${bedrooms} spacious bedrooms and ${bathrooms} modern bathrooms. `;
    }
    
    if (features.length > 0) {
        description += `Key amenities include ${features.slice(0, 3).join(', ')}`;
        if (features.length > 3) {
            description += `, and more`;
        }
        description += `. `;
    }
    
    description += `Priced at ₦${price.toLocaleString()}, this property offers excellent value in one of Abuja's most sought-after locations. `;
    description += `Contact A.I Realent Global Resources Ltd today to schedule a viewing or request more information.`;
    
    return description;
}

function generateSeoData(property) {
    const { title, type, location, price } = property;
    
    const seoTitle = `${title} - ${location}, Abuja | A.I Realent`;
    const seoDescription = `Find ${type} properties for sale in ${location}, Abuja. ${title} priced at ₦${price.toLocaleString()}. Verified listing with A.I Realent Global Resources Ltd.`;
    const focusKeyword = `${type} for sale in ${location} Abuja`;
    
    return {
        title: seoTitle,
        description: seoDescription,
        focusKeyword: focusKeyword
    };
}

function createPropertySlug(property) {
    const { title, location } = property;
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() + `-${location.toLowerCase().replace(/\s+/g, '-')}`;
}

async function createPropertyListing(propertyData, publish = false) {
    console.log(`\n🏠 Creating property listing: ${propertyData.title}`);
    
    // Generate content and SEO data
    const description = generatePropertyDescription(propertyData);
    const seo = generateSeoData(propertyData);
    const slug = createPropertySlug(propertyData);
    
    // Get or create property type term
    const typeId = await getOrCreateTermId('property-type', propertyData.type);
    
    // Get or create property status term
    const statusId = await getOrCreateTermId('property-status', propertyData.status || 'For Sale');
    
    // Get or create location term
    const locationId = await getOrCreateTermId('property-city', propertyData.location);
    
    // Get property post type
    const postType = await getCustomPostType();
    
    // Prepare post data
    const postData = {
        title: propertyData.title,
        content: description,
        excerpt: description.substring(0, 200) + '...',
        slug: slug,
        status: publish ? 'publish' : 'draft'
    };
    
    // Add taxonomy terms if available
    if (typeId) postData.property_type = [typeId];
    if (statusId) postData.property_status = [statusId];
    if (locationId) postData.property_city = [locationId];
    
    // Add custom fields (meta data)
    postData.meta = {
        // Price field (common in real estate themes)
        '_price': propertyData.price.toString(),
        '_price_formatted': `₦${propertyData.price.toLocaleString()}`,
        
        // Property details
        '_bedrooms': propertyData.bedrooms || 0,
        '_bathrooms': propertyData.bathrooms || 0,
        '_size': propertyData.size || '',
        '_size_unit': propertyData.sizeUnit || 'sqm',
        
        // Property ID
        '_property_id': propertyData.propertyId || `PROP-${Date.now()}`,
        
        // Features (as serialized array)
        '_property_features': JSON.stringify(propertyData.features || []),
        
        // Location details
        '_address': propertyData.address || `${propertyData.location}, Abuja, Nigeria`,
        '_location': propertyData.location,
        
        // Rank Math SEO
        'rank_math_title': seo.title,
        'rank_math_description': seo.description,
        'rank_math_focus_keyword': seo.focusKeyword
    };
    
    // Try to create the property listing
    try {
        const endpoint = postType === 'property' ? 'properties' : 'posts';
        const result = await httpRequest(`${SITE_URL}/wp/v2/${endpoint}`, 'POST', postData);
        
        if (result.status === 201) {
            console.log(`✅ Successfully created: ${result.data.link}`);
            console.log(`   Status: ${result.data.status}`);
            console.log(`   ID: ${result.data.id}`);
            
            // If we have features, try to add them as tags
            if (propertyData.features && propertyData.features.length > 0) {
                await addFeaturesAsTags(result.data.id, propertyData.features);
            }
            
            return {
                success: true,
                url: result.data.link,
                id: result.data.id,
                editUrl: `https://airealent.ng/wp-admin/post.php?post=${result.data.id}&action=edit`
            };
        } else {
            console.log(`❌ Failed to create property: ${result.status}`);
            console.log(`   Error: ${JSON.stringify(result.data)}`);
            return {
                success: false,
                error: result.data
            };
        }
    } catch (error) {
        console.log(`❌ Error creating property: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
}

async function addFeaturesAsTags(postId, features) {
    const tagIds = [];
    
    for (const feature of features) {
        const tagId = await getOrCreateTermId('post_tag', feature);
        if (tagId) tagIds.push(tagId);
    }
    
    if (tagIds.length > 0) {
        try {
            await httpRequest(`${SITE_URL}/wp/v2/posts/${postId}`, 'POST', {
                tags: tagIds
            });
            console.log(`   Added ${tagIds.length} feature tags`);
        } catch (error) {
            // Silently fail - tags are not critical
        }
    }
}

function createSamplePropertyData() {
    return {
        title: "4 Bedroom Terrace Duplex with BQ - Jahi, Abuja",
        type: "Terrace Duplex",
        location: "Jahi",
        price: 350000000,
        bedrooms: 4,
        bathrooms: 4,
        size: "500",
        sizeUnit: "sqm",
        status: "For Sale",
        propertyId: "PROP-JAHI-001",
        features: ["Guest Toilet", "Dining Area", "Balconies", "Fitted Kitchen", "Store", "En-suite", "Wardrobe", "Ample Parking", "Green Area"],
        address: "Jahi District, Abuja, Nigeria"
    };
}

function loadPropertyDataFromFile(filepath) {
    try {
        const data = fs.readFileSync(filepath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(`❌ Error loading property data from ${filepath}: ${error.message}`);
        return null;
    }
}

function createPropertyTemplate() {
    const template = {
        title: "Property Title Here",
        type: "Terrace Duplex", // Options: Terrace Duplex, Apartment, Land, etc.
        location: "Area Name", // e.g., Jahi, Maitama, Asokoro
        price: 0, // Price in Naira
        bedrooms: 0,
        bathrooms: 0,
        size: "", // e.g., "500"
        sizeUnit: "sqm", // Options: sqm, hectares, acres
        status: "For Sale", // Options: For Sale, For Rent, Sold, Rented
        propertyId: "PROP-XXX-001", // Unique property ID
        features: ["Feature 1", "Feature 2", "Feature 3"], // Array of features
        address: "Full address here",
        notes: "Additional notes"
    };
    
    return template;
}

async function interactivePropertyCreation() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    function question(query) {
        return new Promise(resolve => rl.question(query, resolve));
    }
    
    console.log('\n📝 Interactive Property Creation\n');
    
    const property = {};
    
    property.title = await question('Property Title: ');
    property.type = await question(`Property Type (${Object.values(PROPERTY_TYPES).join(', ')}): `);
    property.location = await question(`Location (${ABUJA_AREAS.slice(0, 5).join(', ')}...): `);
    property.price = parseInt(await question('Price (in Naira): ')) || 0;
    property.bedrooms = parseInt(await question('Number of Bedrooms: ')) || 0;
    property.bathrooms = parseInt(await question('Number of Bathrooms: ')) || 0;
    property.size = await question('Size (e.g., 500): ') || '';
    property.sizeUnit = await question('Size Unit (sqm/hectares/acres): ') || 'sqm';
    property.status = await question('Status (For Sale/For Rent/Sold/Rented): ') || 'For Sale';
    property.propertyId = await question('Property ID (e.g., PROP-JAHI-001): ') || `PROP-${Date.now()}`;
    property.address = await question('Full Address: ') || `${property.location}, Abuja, Nigeria`;
    
    console.log('\nAvailable Features:');
    PROPERTY_FEATURES.forEach((feature, index) => {
        console.log(`  ${index + 1}. ${feature}`);
    });
    
    const featuresInput = await question('Enter feature numbers (comma-separated, e.g., 1,3,5): ');
    property.features = featuresInput
        .split(',')
        .map(num => PROPERTY_FEATURES[parseInt(num.trim()) - 1])
        .filter(f => f);
    
    rl.close();
    return property;
}

async function main() {
    console.log('🏠 Property Listing Automation for airealent.ng');
    console.log('='.repeat(50));
    
    // Check for command line arguments
    const args = process.argv.slice(2);
    const testMode = args.includes('--test');
    const draftMode = args.includes('--draft');
    const fileArg = args.find(arg => arg.startsWith('--file='));
    const interactiveMode = args.includes('--interactive');
    const templateMode = args.includes('--template');
    
    // Initialize authentication
    if (USERNAME === 'YOUR_WORDPRESS_USERNAME' || PASSWORD === 'YOUR_APPLICATION_PASSWORD') {
        console.log('\n❌ ERROR: Please update the USERNAME and PASSWORD in the script.');
        console.log('   Get application password from WordPress:');
        console.log('   Users → Your Profile → Application Passwords');
        console.log('\n   Then update lines 14-15 in the script.');
        process.exit(1);
    }
    
    initializeAuth(USERNAME, PASSWORD);
    
    // Test connection
    console.log('🔗 Testing connection to WordPress REST API...');
    try {
        const testResult = await httpRequest(`${SITE_URL}/`);
        if (testResult.status === 200) {
            console.log('✅ Connected successfully to:', testResult.data.name);
        } else {
            console.log('❌ Connection failed:', testResult.status);
            process.exit(1);
        }
    } catch (error) {
        console.log('❌ Connection error:', error.message);
        process.exit(1);
    }
    
    let properties = [];
    
    // Handle different modes
    if (templateMode) {
        console.log('\n📄 Creating property template file...');
        const template = createPropertyTemplate();
        const templateFile = 'property-template.json';
        fs.writeFileSync(templateFile, JSON.stringify(template, null, 2));
        console.log(`✅ Template saved to: ${templateFile}`);
        console.log('\nEdit this file with your property details, then run:');
        console.log(`  node property-listing-automation.js --file=${templateFile}`);
        process.exit(0);
    }
    
    if (interactiveMode) {
        console.log('\n🎯 Interactive mode selected');
        const property = await interactivePropertyCreation();
        properties = [property];
    } else if (fileArg) {
        const filepath = fileArg.split('=')[1];
        console.log(`\n📁 Loading properties from: ${filepath}`);
        const data = loadPropertyDataFromFile(filepath);
        if (!data) process.exit(1);
        
        // Handle both single property and array of properties
        properties = Array.isArray(data) ? data : [data];
    } else if (testMode) {
        console.log('\n🧪 Test mode - creating sample property');
        properties = [createSamplePropertyData()];
    } else {
        console.log('\n❓ No mode specified. Available options:');
        console.log('  --test              Create a test property');
        console.log('  --interactive       Interactive property creation');
        console.log('  --file=filename.json Load properties from JSON file');
        console.log('  --template          Create a property template file');
        console.log('  --draft             Save as draft (default: publish)');
        console.log('\nExample:');
        console.log('  node property-listing-automation.js --test --draft');
        process.exit(0);
    }
    
    console.log(`\n📊 Processing ${properties.length} property listing(s)`);
    
    const results = [];
    for (const property of properties) {
        const result = await createPropertyListing(property, !draftMode);
        results.push(result);
        
        // Small delay between creations to avoid rate limiting
        if (properties.length > 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 PROPERTY LISTING SUMMARY');
    console.log('='.repeat(50));
    
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (successful > 0) {
        console.log('\n🔗 Created Listings:');
        for (const r of results) {
            if (r.success) {
                console.log(`  - ${r.url}`);
                if (r.editUrl) console.log(`    Edit: ${r.editUrl}`);
            }
        }
    }
    
    // Save log
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFile = `property-listings-log-${timestamp}.md`;
    let logContent = '# Property Listings Log\n\n';
    logContent += `**Date:** ${new Date().toLocaleString()}\n`;
    logContent += `**Successful:** ${successful}\n`;
    logContent += `**Failed:** ${failed}\n`;
    logContent += `**Mode:** ${draftMode ? 'Draft' : 'Published'}\n\n`;
    
    if (successful > 0) {
        logContent += '## Successful Listings\n\n';
        for (const r of results) {
            if (r.success) {
                logContent += `### ${r.url}\n`;
                logContent += `- **ID:** ${r.id}\n`;
                logContent += `- **Edit URL:** ${r.editUrl}\n\n`;
            }
        }
    }
    
    if (failed > 0) {
        logContent += '## Failed Listings\n\n';
        for (const r of results) {
            if (!r.success) {
                logContent += `- **Error:** ${JSON.stringify(r.error)}\n`;
            }
        }
    }
    
    fs.writeFileSync(logFile, logContent);
    console.log(`\n📝 Log saved to: ${logFile}`);
    
    // Create a batch file for easy future use
    if (successful > 0 && fileArg) {
        const batchFile = 'create-property-listings.bat';
        const batchContent = `@echo off
echo Creating property listings...
node "property-listing-automation.js" --file="${fileArg.split('=')[1]}" --draft
pause`;
        fs.writeFileSync(batchFile, batchContent);
        console.log(`\n🔄 Batch file created: ${batchFile}`);
        console.log('   Run this to create listings from the same file');
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
    process.exit(1);
});

// Run main function
if (require.main === module) {
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = {
    createPropertyListing,
    generatePropertyDescription,
    generateSeoData
};