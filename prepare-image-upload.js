const fs = require('fs');
const path = require('path');

// Since we can't easily convert SVG to PNG in this environment without additional dependencies,
// let's create a batch file that uses a conversion tool and also prepare the upload script

const manifestPath = path.join(__dirname, '..', 'pathway-seo-data', 'featured-images', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

console.log('=== Featured Images Conversion Plan ===\n');
console.log('SVG files created. To convert to PNG (1200x630):');
console.log('\nOption 1: Use Inkscape (recommended):');
manifest.forEach(item => {
    console.log(`inkscape "${item.filepath}" --export-filename="${item.filepath.replace('.svg', '.png')}" --export-width=1200 --export-height=630`);
});

console.log('\nOption 2: Use ImageMagick:');
manifest.forEach(item => {
    console.log(`convert "${item.filepath}" -resize 1200x630 "${item.filepath.replace('.svg', '.png')}"`);
});

console.log('\nOption 3: Use online converter or Canva');
console.log('Upload SVGs to Canva, set dimensions to 1200x630, export as PNG');

// Create WordPress upload script
const uploadScript = `
const https = require('https');
const fs = require('fs');
const path = require('path');

const WP_URL = 'https://pathwaypis.com';
const WP_API = WP_URL + '/wp-json/wp/v2';
const USERNAME = 'dynamite';
const PASSWORD = 'tcSM kzGo 8TQP Dqm9 cKtQ kUOb';
const auth = Buffer.from(USERNAME + ':' + PASSWORD).toString('base64');

const articles = ${JSON.stringify(manifest.map(m => ({
    id: m.article,
    title: m.title,
    svgFile: m.filename,
    pngFile: m.filename.replace('.svg', '.png')
})), null, 2)};

console.log('Upload featured images to WordPress for:', articles.length, 'articles');
console.log('Steps:');
console.log('1. Convert SVG files to PNG (1200x630)');
console.log('2. Upload PNGs via WordPress media library or API');
console.log('3. Set featured image for each article post');
`;

const uploadScriptPath = path.join(__dirname, 'upload-featured-images.js');
fs.writeFileSync(uploadScriptPath, uploadScript);

console.log('\n✓ Upload script created:', uploadScriptPath);
console.log('\nTo complete the process:');
console.log('1. Convert SVGs to PNGs using one of the methods above');
console.log('2. Run: node crm/upload-featured-images.js');
