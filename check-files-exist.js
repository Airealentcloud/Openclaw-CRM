const https = require('https');

const newFiles = [
  'file_23---724ddc54-37b2-4d25-9277-a1dc84a154af.jpg',
  'file_24---b9830517-d8ac-42aa-aa57-7614887552c7.jpg',
  'file_25---04cf3021-99d5-4034-85d8-9dcb9c3edf5c.jpg',
  'file_26---7e0c3556-3576-4202-8e68-3fc23cc3b2dd.jpg'
];

const baseUrl = 'https://airealent.ng/wp-content/uploads/2026/02/';

console.log('Checking if uploaded files exist on server:\n');

newFiles.forEach((file, idx) => {
  const url = baseUrl + file;
  https.get(url, (res) => {
    const status = res.statusCode;
    const exists = status === 200 ? '✓ EXISTS' : '✗ NOT FOUND';
    console.log(`${idx + 1}. ${file}`);
    console.log(`   Status: ${status} - ${exists}`);
    console.log(`   URL: ${url}\n`);
  }).on('error', (e) => {
    console.log(`${idx + 1}. ${file} - Error: ${e.message}\n`);
  });
});
