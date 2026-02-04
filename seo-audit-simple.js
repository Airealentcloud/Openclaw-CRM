/**
 * SpyWizards SEO Audit - Simple version
 */

const https = require('https');

const SITE = 'https://spywizards.com/blog/wp-json/wp/v2/posts';
const AUTH = 'Basic ' + Buffer.from('Aiwisemind:IbGx RiYc qzoX swu5 nZtb mR37').toString('base64');

async function httpRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method, headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
            timeout: 10000
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
                catch { resolve({ status: res.statusCode, data: body }); }
            });
        });
        req.on('error', reject);
        req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); });
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

function cleanHtml(html) {
    return (html || '').replace(/<[^>]*>/g, '').trim();
}

function truncate(str, len = 155) {
    const clean = cleanHtml(str);
    return clean.substring(0, len) + (clean.length > len ? '...' : '');
}

async function fixPost(post) {
    const title = cleanHtml(post.title?.rendered || '');
    const excerpt = truncate(post.excerpt?.rendered || post.content?.rendered || '', 155);
    const seoTitle = `${title} | SpyWizards`;
    
    console.log(`📝 ${title.substring(0, 50)}...`);
    
    const result = await httpRequest(`${SITE}/${post.id}?context=edit`, 'PUT', {
        title: title,
        meta: {
            rank_math_title: seoTitle,
            rank_math_description: excerpt,
            rank_math_focus_keyword: 'cybersecurity'
        }
    });
    
    return { success: result.status === 200, title };
}

async function main() {
    console.log('🔍 SpyWizards SEO Audit & Fix\n');
    
    // Fetch first 50 posts
    console.log('📥 Fetching posts...');
    const result = await httpRequest(`${SITE}?per_page=50`);
    const posts = result.data || [];
    console.log(`📊 Found ${posts.length} posts\n`);
    
    let fixed = 0;
    let errors = 0;
    
    for (const post of posts) {
        try {
            await fixPost(post);
            fixed++;
        } catch (e) {
            console.log(`   ❌ Error: ${e.message}`);
            errors++;
        }
    }
    
    console.log(`\n📈 SUMMARY`);
    console.log(`✅ Fixed: ${fixed}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`\n📑 Sitemaps:`);
    console.log(`   https://spywizards.com/blog/wp-sitemap.xml`);
    console.log(`   https://spywizards.com/blog/sitemap_index.xml`);
}

main().catch(console.error);
