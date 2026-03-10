const https = require('https');
const fs = require('fs');
const path = require('path');

// URLs to submit to Google Search Console
const urlsToSubmit = [
    'https://pathwaypis.com/gps-tracking-laws-private-investigator/',
    'https://pathwaypis.com/private-investigator-phone-records-legal/',
    // Add other article URLs here
];

// Alternative: Use IndexNow API (supported by Bing, Yandex, others)
async function submitViaIndexNow(urls) {
    console.log('Submitting URLs via IndexNow API...\n');
    
    // IndexNow requires a key file hosted on the domain
    const indexNowKey = 'pathwaypis-indexnow-key.txt';
    const indexNowKeyContent = '3a8f9e2d4b7c1e5f8a0d6b4c9e3f7a2b'; // Generate a unique key
    
    console.log('IndexNow Setup Required:');
    console.log('1. Create file at: https://pathwaypis.com/' + indexNowKey);
    console.log('2. Content: ' + indexNowKeyContent);
    console.log('3. Submit URLs to: https://api.indexnow.org/IndexNow');
    
    const submissionData = {
        host: 'pathwaypis.com',
        key: indexNowKeyContent,
        keyLocation: `https://pathwaypis.com/${indexNowKey}`,
        urlList: urls
    };
    
    console.log('\nSubmission payload:');
    console.log(JSON.stringify(submissionData, null, 2));
    
    return submissionData;
}

// Create Google Search Console submission instructions
function createGSCInstructions() {
    const instructions = `
# Google Search Console URL Submission

## New URLs to Submit for Indexing

${urlsToSubmit.map(url => `- ${url}`).join('\n')}

## Method 1: Manual Submission (Recommended)

1. Go to: https://search.google.com/search-console
2. Select property: pathwaypis.com
3. Go to "URL Inspection" tool
4. Enter each URL and click "Request Indexing"

## Method 2: Sitemap Update

1. Go to: https://search.google.com/search-console
2. Select property: pathwaypis.com
3. Go to "Sitemaps"
4. Resubmit your sitemap URL (e.g., https://pathwaypis.com/sitemap.xml)

## Method 3: Google Indexing API (Requires setup)

For high-priority content, use the Google Indexing API:
https://developers.google.com/search/apis/indexing-api/v3/quickstart

## URLs Needing Indexing

The following new articles need to be indexed:
- Article 6: GPS Tracking Laws ($4.50 CPC)
- Article 7: Phone Records Access ($3.80 CPC)

## Additional SEO Actions

1. Ensure all articles have proper meta titles/descriptions (via RankMath)
2. Submit sitemap to Bing Webmaster Tools as well
3. Monitor indexing status in GSC "Coverage" report
4. Check for any crawl errors

## Expected Timeline

- Google may index within 24-72 hours
- High-quality content with good internal linking indexes faster
- Monitor GSC for indexing status
`;

    const instructionsPath = path.join(__dirname, '..', 'crm', 'google-search-console-instructions.txt');
    fs.writeFileSync(instructionsPath, instructions);
    console.log(`✓ GSC instructions saved to: ${instructionsPath}`);
}

// Create sitemap update script
function createSitemapUpdateScript() {
    const script = `<?php
// WordPress sitemap is automatically generated
// To update, simply visit:
// https://pathwaypis.com/wp-sitemap.xml

// Or flush rewrite rules by visiting:
// WordPress Admin > Settings > Permalinks > Save Changes

// For custom sitemap, use RankMath or Yoast SEO plugin
`;

    const scriptPath = path.join(__dirname, '..', 'crm', 'sitemap-update.php');
    fs.writeFileSync(scriptPath, script);
    console.log(`✓ Sitemap update script saved to: ${scriptPath}`);
}

// Main function
async function main() {
    console.log('=== Google Search Console URL Submission ===\n');
    
    console.log('URLs to submit:');
    urlsToSubmit.forEach(url => console.log(`  - ${url}`));
    
    console.log('\n---\n');
    
    // Create IndexNow submission data
    await submitViaIndexNow(urlsToSubmit);
    
    console.log('\n---\n');
    
    // Create GSC instructions
    createGSCInstructions();
    
    // Create sitemap update script
    createSitemapUpdateScript();
    
    console.log('\n=== Summary ===');
    console.log('Google Search Console submission requires manual action:');
    console.log('1. Visit https://search.google.com/search-console');
    console.log('2. Use URL Inspection tool for each new URL');
    console.log('3. Click "Request Indexing" for each URL');
    console.log('');
    console.log('Alternatively, update and resubmit your sitemap.');
    console.log('');
    console.log('Files created:');
    console.log('- crm/google-search-console-instructions.txt');
    console.log('- crm/sitemap-update.php');
}

main().catch(console.error);
