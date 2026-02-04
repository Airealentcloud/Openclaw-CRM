const https = require('https');

const SITE = 'https://spywizards.com/blog/wp-json/wp/v2/posts';
const AUTH = 'Basic ' + Buffer.from('Aiwisemind:IbGx RiYc qzoX swu5 nZtb mR37').toString('base64');

https.get(`${SITE}?slug=how-to-recover-hacked-instagram-account-2025`, {
    headers: { 'Authorization': AUTH }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const posts = JSON.parse(data);
        if (posts[0]) {
            const content = posts[0].content?.rendered || '';
            console.log('=== CONTENT ===');
            console.log(content);
            console.log('\n=== H1 COUNT ===');
            const h1Matches = content.match(/<h1/g) || [];
            console.log('H1 tags found:', h1Matches.length);
        }
    });
}).on('error', console.error);
