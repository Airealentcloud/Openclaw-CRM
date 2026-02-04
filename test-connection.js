const https = require('https');

https.get('https://spywizards.com/blog/wp-json/wp/v2/posts?per_page=1', (res) => {
    console.log('Status:', res.statusCode);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Data length:', data.length);
        console.log('First 200 chars:', data.substring(0, 200));
    });
}).on('error', (e) => {
    console.log('Error:', e.message);
}).setTimeout(5000, () => {
    console.log('Timeout');
    process.exit(1);
});
