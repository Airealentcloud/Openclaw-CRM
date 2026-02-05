const https = require('https');

const req = https.get('https://airealent.ng/wp-json/wp/v2/media?per_page=30', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const media = JSON.parse(data);
      const today = media.filter(i => i.date.startsWith('2026-02-04'));
      
      console.log('Recent uploads (2026-02-04):');
      console.log('============================\n');
      
      today.forEach((i, idx) => {
        console.log(`${idx + 1}. ID: ${i.id}`);
        console.log(`   File: ${i.slug}`);
        console.log(`   URL: ${i.source_url}\n`);
      });
      
      if (today.length === 0) {
        console.log('No uploads found for today yet.\n');
      }
    } catch (e) {
      console.log('Parse error:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.log('Error:', e.message);
});
