/**
 * Upload property images to WordPress Media Library
 * Then attach them to the property post
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Property images to upload
const imageFiles = [
  'C:\\Users\\USER\\.openclaw\\media\\inbound\\file_10---99dfec50-5728-4273-ab7e-43e884d2570c.jpg',
  'C:\\Users\\USER\\.openclaw\\media\\inbound\\file_11---96dd1145-2548-4a76-bc2e-fdfbc4ad670c.jpg',
  'C:\\Users\\USER\\.openclaw\\media\\inbound\\file_12---1ce1af4e-253d-4e10-b720-1f902ef285f1.jpg',
  'C:\\Users\\USER\\.openclaw\\media\\inbound\\file_13---98ef0be2-9bc2-473f-9a8d-c31bb65b2e83.jpg',
  'C:\\Users\\USER\\.openclaw\\media\\inbound\\file_14---49daf79e-fcd1-4535-bfcf-69dd4677649e.jpg',
  'C:\\Users\\USER\\.openclaw\\media\\inbound\\file_15---4e4551b5-7ce4-4624-8cb9-09af8a6d6b57.jpg',
  'C:\\Users\\USER\\.openclaw\\media\\inbound\\file_16---df727929-1313-4c7b-9306-093d2aec624d.jpg',
  'C:\\Users\\USER\\.openclaw\\media\\inbound\\file_17---8eb4567a-b40a-45af-ad9c-ea268f37ca62.jpg',
  'C:\\Users\\USER\\.openclaw\\media\\inbound\\file_18---efaaa479-e8c7-4263-98ed-9f5e365b20a0.jpg',
  'C:\\Users\\USER\\.openclaw\\media\\inbound\\file_19---ae6ca763-005e-4c4c-b6c2-30fba4407ede.jpg',
];

const PROPERTY_ID = 18851;
const SITE_URL = 'https://airealent.ng';

// WordPress nonces can be found in the page source or admin-ajax.php
// For REST API with cookies, we need to use the WordPress session

async function uploadImage(filePath, cookieHeader) {
  const filename = path.basename(filePath);
  const fileContent = fs.readFileSync(filePath);
  
  // Upload to WordPress Media Library via REST API
  const formData = new FormData();
  const blob = new Blob([fileContent], { type: 'image/jpeg' });
  formData.append('file', blob, filename);
  
  // We need to get a nonce first by visiting the admin page
  // For now, let's try using application password authentication
  // If that doesn't work, we'll use cookie-based auth
  
  console.log(`Uploading: ${filename}`);
  
  try {
    // Try with application password (admin user)
    // This would need to be set up in WordPress user profile
    const response = await fetch(`${SITE_URL}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      body: formContent
    });
    
    if (response.ok) {
      const media = await response.json();
      console.log(`✓ Uploaded: ${filename} (ID: ${media.id})`);
      return media.id;
    } else {
      console.log(`✗ Failed: ${filename} - ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.log(`✗ Error: ${filename} - ${error.message}`);
    return null;
  }
}

// Alternative: Create a simpler curl-based script
console.log('Property Image Upload Script');
console.log('===========================');
console.log(`Property ID: ${PROPERTY_ID}`);
console.log(`Images to upload: ${imageFiles.length}`);
console.log('');
console.log('To upload images, run these commands in terminal:');
console.log('');

for (const file of imageFiles) {
  const filename = path.basename(file);
  console.log(`curl -X POST "${SITE_URL}/wp-json/wp/v2/media" \\`);
  console.log(`  -H "Content-Disposition: attachment; filename=\\"${filename}\\"" \\`);
  console.log(`  -H "Content-Type: image/jpeg" \\`);
  console.log(`  --data-binary @\\"${file}\\" \\`);
  console.log(`  -u "username:application-password"`);
  console.log('');
}
