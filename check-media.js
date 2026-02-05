/**
 * Check WordPress Media Library
 */

const https = require('https');

const options = {
  hostname: 'airealent.ng',
  port: 443,
  path: '/wp-json/wp/v2/media?per_page=10',
  method: 'GET'
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${data.substring(0, 1000)}`);
  });
});

req.on('error', (e) => {
  console.log(`Error: ${e.message}`);
});

req.end();
