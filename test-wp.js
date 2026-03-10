const https = require('https');

const auth = Buffer.from('dynamite:tcSM kzGo 8TQP Dqm9 cKtQ kUOb').toString('base64');

const options = {
    hostname: 'pathwaypis.com',
    path: '/wp-json/',
    headers: {
        'Authorization': `Basic ${auth}`
    }
};

https.get(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            const parsed = JSON.parse(data);
            console.log('WP API OK:', parsed.namespaces ? 'Yes' : 'No');
            console.log('Name:', parsed.name);
        } catch (e) {
            console.log('Response:', data.substring(0, 200));
        }
    });
}).on('error', e => console.error('Error:', e.message));
