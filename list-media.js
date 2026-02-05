/**
 * Get all recently uploaded media
 */

const https = require('https');

const options = {
  hostname: 'airealent.ng',
  port: 443,
  path: '/wp-json/wp/v2/media?per_page=20',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const media = JSON.parse(data);
      
      if (Array.isArray(media)) {
        console.log('Recently Uploaded Images:');
        console.log('========================');
        console.log(`Total: ${media.length} images\n`);
        
        media.forEach((item, index) => {
          console.log(`${index + 1}. ID: ${item.id}`);
          console.log(`   Filename: ${item.slug}`);
          console.log(`   URL: ${item.source_url}`);
          console.log(`   Date: ${item.date}`);
          console.log('');
        });
      } else {
        console.log('Response:', data.substring(0, 500));
      }
    } catch (e) {
      console.log('Parse error:', e.message);
      console.log('Raw data:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.log(`Error: ${e.message}`);
});

req.end();
