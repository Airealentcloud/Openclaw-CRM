/**
 * SpyWizards SEO Audit & Meta Data Fixer
 */

const https = require('https');

const SITE = 'https://spywizards.com/blog/wp-json/wp/v2';
const AUTH = 'Basic ' + Buffer.from('Aiwisemind:IbGx RiYc qzoX swu5 nZtb mR37').toString('base64');

async function httpRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method, headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
            timeout: 20000
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
                catch { resolve({ status: res.statusCode, data: body }); }
            });
        });
        req.on('error', reject);
        req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout')); });
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function getAllPosts() {
    let page = 1;
    let allPosts = [];
    let hasMore = true;
    
    while (hasMore) {
        console.log(`Fetching page ${page}...`);
        const result = await httpRequest(`${SITE}/posts?per_page=100&page=${page}`);
        if (result.data && Array.isArray(result.data) && result.data.length > 0) {
            allPosts = allPosts.concat(result.data);
            page++;
        } else {
            hasMore = false;
        }
    }
    return allPosts;
}

function generateMetaDescription(excerpt, title) {
    // Strip HTML and create clean meta description
    const clean = excerpt.replace(/<[^>]*>/g, '').trim();
    const desc = clean.substring(0, 155);
    return desc + (clean.length > 155 ? '...' : '');
}

function generateSeoTitle(title) {
    // Clean title and add site name
    const clean = title.replace(/<[^>]*>/g, '').trim();
    return `${clean} | SpyWizards`;
}

async function auditAndFix() {
    console.log('🔍 Starting SpyWizards SEO Audit\n');
    console.log('='.repeat(50));
    
    const posts = await getAllPosts();
    console.log(`\n📊 Found ${posts.length} posts to audit\n`);
    
    let fixed = 0;
    let alreadyGood = 0;
    let errors = 0;
    
    for (const post of posts) {
        const title = post.title?.rendered || '';
        const currentMeta = post.meta || {};
        
        // Check if meta needs fixing
        const needsMetaFix = !currentMeta.rank_math_title || !currentMeta.rank_math_description;
        const titleEmpty = !title || title.length < 5;
        
        if (needsMetaFix && !titleEmpty) {
            console.log(`📝 Fixing: ${title.substring(0, 50)}...`);
            
            const excerpt = post.excerpt?.rendered || post.content?.rendered || '';
            const metaDesc = generateMetaDescription(excerpt, title);
            const seoTitle = generateSeoTitle(title);
            
            const result = await httpRequest(`${SITE}/posts/${post.id}?context=edit`, 'PUT', {
                meta: {
                    rank_math_title: seoTitle,
                    rank_math_description: metaDesc,
                    rank_math_focus_keyword: 'cybersecurity'
                }
            });
            
            if (result.status === 200) {
                console.log(`   ✅ Fixed: ${seoTitle.substring(0, 40)}...`);
                fixed++;
            } else {
                console.log(`   ❌ Error: ${result.status}`);
                errors++;
            }
        } else if (!titleEmpty) {
            console.log(`✅ Good: ${title.substring(0, 50)}...`);
            alreadyGood++;
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📈 AUDIT SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Fixed: ${fixed}`);
    console.log(`✅ Already good: ${alreadyGood}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total: ${posts.length}`);
    
    // Generate sitemap report
    console.log('\n📑 SITEMAP INFO:');
    console.log('   WordPress generates sitemap at:');
    console.log('   https://spywizards.com/blog/wp-sitemap.xml');
    console.log('   https://spywizards.com/blog/sitemap_index.xml');
}

auditAndFix().catch(console.error);
