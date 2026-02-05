const fs = require('fs');
const https = require('https');
const path = require('path');

// Files to upload
const files = [
  'file_23---724ddc54-37b2-4d25-9277-a1dc84a154af.jpg',
  'file_24---b9830517-d8ac-42aa-aa57-7614887552c7.jpg',
  'file_25---04cf3021-99d5-4034-85d8-9dcb9c3edf5c.jpg',
  'file_26---7e0c3556-3576-4202-8e68-3fc23cc3b2dd.jpg'
];

const baseDir = 'C:\\Users\\USER\\.openclaw\\media\\inbound\\';

// Get credentials from environment or prompt
const username = process.env.WP_USER || 'israelakhas1@gmail.com';
const appPassword = process.env.WP_APP || 'retq-wqqp-ijs-rwur'; // Gmail app password

const auth = Buffer.from(`${username}:${appPassword}`).toString('base64');

console.log('Uploading files to airealent.ng...\n');

files.forEach((file, idx) => {
  const filePath = path.join(baseDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`${idx + 1}. ✗ File not found: ${file}`);
    return;
  }
  
  const content = fs.readFileSync(filePath);
  
  const options = {
    hostname: 'airealent.ng',
    port: 443,
    path: '/wp-json/wp/v2/media',
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${file}"`,
      'Authorization': `Basic ${auth}`
    }
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`${idx + 1}. ✓ Uploaded: ${file}`);
          console.log(`   ID: ${result.id}`);
          console.log(`   URL: ${result.source_url}\n`);
        } else {
          console.log(`${idx + 1}. ✗ Failed (${res.statusCode}): ${file}`);
          console.log(`   ${data.substring(0, 200)}\n`);
        }
      } catch (e) {
        console.log(`${idx + 1}. ✗ Error: ${file} - ${e.message}\n`);
      }
    });
  });
  
  req.on('error', (e) => {
    console.log(`${idx + 1}. ✗ Network error: ${file} - ${e.message}\n`);
  });
  
  req.write(content);
  req.end();
});
