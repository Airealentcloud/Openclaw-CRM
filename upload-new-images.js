const fs = require('fs');
const https = require('https');

const files = [
  'file_23---724ddc54-37b2-4d25-9277-a1dc84a154af.jpg',
  'file_24---b9830517-d8ac-42aa-aa57-7614887552c7.jpg',
  'file_25---04cf3021-99d5-4034-85d8-9dcb9c3edf5c.jpg',
  'file_26---7e0c3556-3576-4202-8e68-3fc23cc3b2dd.jpg'
];

const basePath = 'C:\\Users\\USER\\.openclaw\\media\\inbound\\';

async function uploadFile(filename) {
  return new Promise((resolve, reject) => {
    const content = fs.readFileSync(basePath + filename);
    
    const options = {
      hostname: 'airealent.ng',
      port: 443,
      path: '/wp-json/wp/v2/media',
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'attachment; filename="' + filename + '"'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const r = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✓ ID ${r.id}: ${filename}`);
            console.log(`  URL: ${r.source_url}`);
            resolve(r);
          } else {
            console.log(`✗ FAIL ${res.statusCode}: ${filename}`);
            resolve(null);
          }
        } catch (e) {
          console.log(`✗ ERROR: ${filename} - ${res.statusCode}`);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`✗ ERROR: ${filename} - ${e.message}`);
      resolve(null);
    });

    req.write(content);
    req.end();
  });
}

async function main() {
  console.log('Uploading images to airealent.ng...\n');
  
  for (const f of files) {
    await uploadFile(f);
  }
  
  console.log('\nDone!');
}

main();
