/**
 * Upload images to airealent.ng WordPress Media Library
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SITE_URL = 'https://airealent.ng';
const IMAGES_DIR = 'C:\\Users\\USER\\.openclaw\\media\\inbound';

// Images to upload for the Wuse Zone property
const imageFiles = [
  'file_0---0fe798c7-3059-4a75-a3b8-089b58314303.jpg',
  'file_1---d50f2296-d9e6-470b-9534-7c7945edd422.jpg',
  'file_2---026567ee-f329-4103-a784-15161e1be961.jpg',
  'file_3---6344667c-11c2-4dec-be87-e3b8dccf9b7b.jpg',
  'file_4---dd03ecb3-f3c9-4bf4-a37d-dc0359648e0f.jpg',
  'file_5---7ebd781d-fc97-4231-bcfa-21ceb6c10529.jpg',
];

// You need to provide WordPress credentials
// Create an Application Password in WordPress: Users → Profile → Application Passwords
const WP_USER = process.env.WP_USER || 'YOUR_USERNAME';
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || 'YOUR_APP_PASSWORD';

function uploadImage(filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(IMAGES_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠ File not found: ${filename}`);
      resolve(null);
      return;
    }
    
    const fileContent = fs.readFileSync(filePath);
    const boundary = '----WordPressUpload' + Date.now();
    
    const options = {
      hostname: 'airealent.ng',
      port: 443,
      path: '/wp-json/wp/v2/media',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Authorization': 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64')
      }
    };
    
    const body = `--${boundary}\r\n` +
      `Content-Disposition: attachment; filename="${filename}"\r\n` +
      `Content-Type: image/jpeg\r\n\r\n` +
      fileContent.toString('binary') + `\r\n--${boundary}--\r\n`;
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const media = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✓ Uploaded: ${filename} (ID: ${media.id})`);
            resolve(media);
          } else {
            console.log(`✗ Failed: ${filename} - Status: ${res.statusCode}`);
            console.log(`  Response: ${data.substring(0, 200)}`);
            resolve(null);
          }
        } catch (e) {
          console.log(`✗ Error parsing response: ${filename} - ${e.message}`);
          resolve(null);
        }
      });
    });
    
    req.on('error', (e) => {
      console.log(`✗ Error: ${filename} - ${e.message}`);
      resolve(null);
    });
    
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('Airealent.ng WordPress Media Upload');
  console.log('===================================');
  console.log(`Site: ${SITE_URL}`);
  console.log(`Images to upload: ${imageFiles.length}`);
  console.log('');
  
  const uploadedImages = [];
  
  for (const filename of imageFiles) {
    const result = await uploadImage(filename);
    if (result) {
      uploadedImages.push({
        id: result.id,
        filename: filename,
        url: result.source_url,
        title: result.title?.rendered || filename
      });
    }
  }
  
  console.log('');
  console.log('Upload Summary:');
  console.log(`==============`);
  console.log(`Total uploaded: ${uploadedImages.length}/${imageFiles.length}`);
  console.log('');
  
  if (uploadedImages.length > 0) {
    console.log('Uploaded Images:');
    console.log('---------------');
    uploadedImages.forEach((img, i) => {
      console.log(`${i + 1}. ID: ${img.id}`);
      console.log(`   URL: ${img.url}`);
      console.log('');
    });
    
    // Save results to file
    fs.writeFileSync(
      'uploaded-images-report.json',
      JSON.stringify({
        property: 'Wuse Zone Residential Land',
        date: new Date().toISOString(),
        images: uploadedImages
      }, null, 2)
    );
    console.log('Results saved to: uploaded-images-report.json');
  }
}

main().catch(console.error);
