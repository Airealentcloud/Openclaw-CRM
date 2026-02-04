/**
 * SpyWizards Article SEO Fixer via WordPress REST API
 * Fixes H1 issues, adds internal links, CTAs, and improves formatting
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const SITE_URL = 'https://spywizards.com/blog/wp-json';
const USERNAME = 'Aiwisemind';
const PASSWORD = 'IbGx RiYc qzoX swu5 nZtb mR37';

// Published post URLs
const POSTS = [
    { slug: 'how-to-recover-hacked-instagram-account-2025', id: null },
    { slug: 'facebook-account-recovery-2025', id: null },
    { slug: 'facebook-account-recovery-proven-methods-2025', id: null },
    { slug: 'social-media-recovery-services-scam-or-legit', id: null },
    { slug: 'social-media-account-recovery-services-legit-scam', id: null },
    { slug: 'protecting-social-media-accounts-from-hackers', id: null },
    { slug: 'protecting-social-media-accounts-hackers-security-best-practices', id: null },
    { slug: 'complete-personal-cybersecurity-checklist-2025', id: null },
    { slug: 'personal-cybersecurity-checklist-2025', id: null },
    { slug: 'how-to-check-if-data-has-been-breached-2025', id: null },
    { slug: 'how-to-check-if-data-has-been-breached', id: null }
];

// Internal linking structure
const INTERNAL_LINKS = {
    'instagram': [
        'https://spywizards.com/blog/how-to-recover-hacked-instagram-account-2025/',
        'https://spywizards.com/blog/protecting-social-media-accounts-from-hackers/'
    ],
    'facebook': [
        'https://spywizards.com/blog/facebook-account-recovery-2025/',
        'https://spywizards.com/blog/facebook-account-recovery-proven-methods-2025/'
    ],
    'social media': [
        'https://spywizards.com/blog/social-media-recovery-services-scam-or-legit/',
        'https://spywizards.com/blog/protecting-social-media-accounts-from-hackers/'
    ],
    'account recovery': [
        'https://spywizards.com/blog/how-to-recover-hacked-instagram-account-2025/',
        'https://spywizards.com/blog/facebook-account-recovery-2025/'
    ],
    'hacked account': [
        'https://spywizards.com/blog/how-to-recover-hacked-instagram-account-2025/',
        'https://spywizards.com/blog/social-media-account-recovery-services-legit-scam/'
    ],
    '2fa': [
        'https://spywizards.com/blog/protecting-social-media-accounts-from-hackers/',
        'https://spywizards.com/blog/complete-personal-cybersecurity-checklist-2025/'
    ],
    'password security': [
        'https://spywizards.com/blog/complete-personal-cybersecurity-checklist-2025/',
        'https://spywizards.com/blog/protecting-social-media-accounts-from-hackers/'
    ],
    'data breach': [
        'https://spywizards.com/blog/how-to-check-if-data-has-been-breached-2025/',
        'https://spywizards.com/blog/complete-personal-cybersecurity-checklist-2025/'
    ],
    'cybersecurity': [
        'https://spywizards.com/blog/complete-personal-cybersecurity-checklist-2025/',
        'https://spywizards.com/blog/protecting-social-media-accounts-hackers-security-best-practices/'
    ],
    'scam': [
        'https://spywizards.com/blog/social-media-recovery-services-scam-or-legit/',
        'https://spywizards.com/blog/how-to-recover-hacked-instagram-account-2025/'
    ]
};

// CTA Template
const CTA_HTML = `
<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px; margin: 40px 0; text-align: center;">
    <h3 style="color: #ffffff; margin-bottom: 15px; font-size: 24px;">Need Professional Help Recovering Your Account?</h3>
    <p style="color: #a0a0a0; margin-bottom: 20px; font-size: 16px;">Our certified cybersecurity experts can help you regain access to your compromised accounts quickly and safely.</p>
    <a href="https://spywizards.com/contact/" style="background: #e94560; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Get Expert Help Now</a>
</div>
`;

// Footer
const FOOTER_HTML = `
<div style="border-top: 1px solid #333; margin-top: 40px; padding-top: 20px;">
    <p style="color: #666; font-size: 14px;">📱 <strong>Contact SpyWizards:</strong> Need immediate assistance? <a href="https://spywizards.com/contact/" style="color: #e94560;">Contact our team</a> for professional account recovery services.</p>
    <p style="color: #666; font-size: 14px;">🔒 <strong>Stay Secure:</strong> Follow us for more cybersecurity tips and updates.</p>
</div>
`;

// Auth header
const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');
const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
};

function httpRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: headers
        };
        
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        
        req.on('error', reject);
        req.setTimeout(30000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function getPostId(slug) {
    const result = await httpRequest(`${SITE_URL}/wp/v2/posts?slug=${slug}`);
    if (result.data && result.data.length > 0) {
        return result.data[0].id;
    }
    return null;
}

async function getPostContent(id) {
    const result = await httpRequest(`${SITE_URL}/wp/v2/posts/${id}`);
    if (result.data) {
        // Handle different content structures
        const content = result.data.content ? (result.data.content.raw || result.data.content.rendered || result.data.content) : '';
        const title = result.data.title ? (result.data.title.rendered || result.data.title) : '';
        return {
            content: content,
            title: title
        };
    }
    return null;
}

function fixContent(content) {
    // Fix multiple H1s - convert extra H1s to H2
    let fixed = content.replace(/^<h1>(?!.*?(?:Instagram|Facebook|Recovery|Cybersecurity|Data Breached|Social Media Recovery).*?)<\/h1>/gim, '<h2>$1</h2>');
    
    // Add internal links for key terms
    for (const [term, links] of Object.entries(INTERNAL_LINKS)) {
        const link1 = links[0];
        const link2 = links[1];
        const linkHTML = ` <a href="${link1}" style="color: #e94560;">Learn more about ${term}</a>`;
        const linkHTML2 = ` <a href="${link2}" style="color: #e94560;">${term} guide</a>`;
        
        // Add links naturally in text
        fixed = fixed.replace(new RegExp(`(${term}s?)`, 'gi'), `$1${linkHTML}`);
    }
    
    // Ensure single H1 at the start
    const h1Match = fixed.match(/<h1>.*?<\/h1>/);
    if (h1Match) {
        const mainH1 = h1Match[0];
        fixed = fixed.replace(/<h1>.*?<\/h1>/g, '');
        fixed = mainH1 + fixed;
    }
    
    // Add CTA before footer
    if (!fixed.includes('Need Professional Help Recovering Your Account')) {
        fixed = fixed + CTA_HTML + FOOTER_HTML;
    }
    
    return fixed;
}

async function updatePost(id, content, title) {
    const fixedContent = fixContent(content);
    
    const postData = {
        content: fixedContent
    };
    
    // Use embed endpoint to properly update Gutenberg content
    const result = await httpRequest(`${SITE_URL}/wp/v2/posts/${id}?context=edit`, 'PUT', postData);
    
    if (result.status === 200) {
        return true;
    }
    return false;
}

async function main() {
    console.log('🚀 Starting SpyWizards Article SEO Fixer');
    console.log('='.repeat(50));
    
    let successCount = 0;
    let failCount = 0;
    
    for (const post of POSTS) {
        console.log(`\n📝 Processing: ${post.slug}`);
        
        const id = await getPostId(post.slug);
        if (!id) {
            console.log(`❌ Could not find post ID for: ${post.slug}`);
            failCount++;
            continue;
        }
        
        post.id = id;
        console.log(`   Post ID: ${id}`);
        
        const postData = await getPostContent(id);
        if (!postData) {
            console.log(`❌ Could not fetch content for: ${post.slug}`);
            failCount++;
            continue;
        }
        
        console.log(`   Title: ${postData.title.substring(0, 50)}...`);
        
        const success = await updatePost(id, postData.content, postData.title);
        if (success) {
            console.log(`✅ Fixed: ${post.slug}`);
            successCount++;
        } else {
            console.log(`❌ Failed: ${post.slug}`);
            failCount++;
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📈 FIX SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📊 Total: ${POSTS.length}`);
    
    if (successCount > 0) {
        console.log('\n🔗 Internal links added for keywords:');
        for (const [term] of Object.entries(INTERNAL_LINKS)) {
            console.log(`   • ${term}`);
        }
    }
}

main().catch(console.error);
