/**
 * SpyWizards Article SEO Fixer - Properly fixes H1 issues
 */

const https = require('https');

// Configuration
const SITE_URL = 'https://spywizards.com/blog/wp-json';
const USERNAME = 'Aiwisemind';
const PASSWORD = 'IbGx RiYc qzoX swu5 nZtb mR37';

// Posts to fix
const POSTS = [
    'how-to-recover-hacked-instagram-account-2025',
    'facebook-account-recovery-2025',
    'facebook-account-recovery-proven-methods-2025',
    'social-media-recovery-services-scam-or-legit',
    'social-media-account-recovery-services-legit-scam',
    'protecting-social-media-accounts-from-hackers',
    'protecting-social-media-accounts-hackers-security-best-practices',
    'complete-personal-cybersecurity-checklist-2025',
    'personal-cybersecurity-checklist-2025',
    'how-to-check-if-data-has-been-breached-2025',
    'how-to-check-if-data-has-been-breached'
];

// Auth
const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');
const headers = { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' };

function httpRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method, headers,
            timeout: 15000
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
                catch { resolve({ status: res.statusCode, data: body }); }
            });
        });
        req.on('error', reject);
        req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

function fixHtmlContent(html) {
    // Find ALL H1 tags
    const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi) || [];
    console.log(`   Found ${h1Matches.length} H1 tags`);
    
    if (h1Matches.length <= 1) {
        console.log('   ✅ Only one H1 - no fix needed');
        return html;
    }
    
    // Keep only the FIRST H1, convert others to H2
    let fixed = html;
    let h1Count = 0;
    
    // Replace from second H1 onward
    fixed = fixed.replace(/(<h1[^>]*>.*?<\/h1>)/gi, (match) => {
        h1Count++;
        if (h1Count === 1) {
            return match; // Keep first H1
        } else {
            return match.replace(/<h1/i, '<h2').replace(/<\/h1>/i, '</h2>'); // Convert to H2
        }
    });
    
    console.log(`   ✅ Fixed: converted extra H1s to H2`);
    return fixed;
}

async function getPost(slug) {
    const result = await httpRequest(`${SITE_URL}/wp/v2/posts?slug=${slug}`);
    if (result.data && result.data.length > 0) return result.data[0];
    return null;
}

async function updatePost(id, content) {
    const fixed = fixHtmlContent(content);
    return await httpRequest(`${SITE_URL}/wp/v2/posts/${id}?context=edit`, 'PUT', { content: fixed });
}

async function main() {
    console.log('🚀 Fixing H1 Issues in SpyWizards Articles\n');
    
    let fixed = 0;
    let errors = 0;
    
    for (const slug of POSTS) {
        console.log(`\n📝 ${slug}`);
        const post = await getPost(slug);
        if (!post) {
            console.log('   ❌ Post not found');
            errors++;
            continue;
        }
        
        const content = post.content?.rendered || post.content || '';
        const originalContent = content;
        const fixedContent = fixHtmlContent(content);
        
        if (originalContent !== fixedContent) {
            const result = await updatePost(post.id, fixedContent);
            if (result.status === 200) {
                console.log('   ✅ H1 fixed');
                fixed++;
            } else {
                console.log('   ❌ Update failed');
                errors++;
            }
        } else {
            console.log('   ✅ No changes needed');
        }
    }
    
    console.log(`\n📊 Summary: ${fixed} fixed, ${errors} errors`);
}

main().catch(e => console.error('Error:', e.message));
