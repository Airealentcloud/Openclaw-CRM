/**
 * SpyWizards SEO Audit & Fix - Robust Version
 */

const https = require('https');

function httpRequest(url, method = 'GET', data = null, retries = 2) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method, 
            headers: { 
                'Authorization': 'Basic ' + Buffer.from('Aiwisemind:IbGx RiYc qzoX swu5 nZtb mR37').toString('base64'), 
                'Content-Type': 'application/json' 
            },
            timeout: 15000
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
                catch { resolve({ status: res.statusCode, data: body }); }
            });
        });
        
        req.on('error', (e) => {
            if (retries > 0) {
                setTimeout(() => httpRequest(url, method, data, retries - 1).then(resolve).catch(reject), 1000);
            } else {
                reject(e);
            }
        });
        
        req.setTimeout(15000, () => {
            if (retries > 0) {
                setTimeout(() => httpRequest(url, method, data, retries - 1).then(resolve).catch(reject), 1000);
            } else {
                req.destroy();
                reject(new Error('timeout'));
            }
        });
        
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
    
    const result = await httpRequest(
        `https://spywizards.com/blog/wp-json/wp/v2/posts/${post.id}?context=edit`, 
        'PUT', 
        {
            meta: {
                rank_math_title: seoTitle,
                rank_math_description: excerpt,
                rank_math_focus_keyword: 'cybersecurity'
            }
        }
    );
    
    return { success: result.status === 200, title };
}

(async () => {
    console.log('🔍 SpyWizards SEO Audit & Meta Fix\n');
    console.log('='.repeat(50));
    
    // Fetch posts
    console.log('\n📥 Fetching posts...');
    const result = await httpRequest('https://spywizards.com/blog/wp-json/wp/v2/posts?per_page=100');
    const posts = result.data || [];
    console.log(`📊 Found ${posts.length} posts\n`);
    
    console.log('='.repeat(50));
    console.log('📝 Fixing Meta Data...\n');
    
    let fixed = 0;
    let errors = 0;
    
    for (const post of posts) {
        try {
            const title = cleanHtml(post.title?.rendered || '').substring(0, 50);
            const res = await fixPost(post);
            if (res.success) {
                console.log(`✅ ${title}...`);
                fixed++;
            } else {
                console.log(`❌ ${title}... (${res.status})`);
                errors++;
            }
        } catch (e) {
            console.log(`❌ Error: ${e.message}`);
            errors++;
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📈 AUDIT SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Fixed: ${fixed}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total: ${posts.length}`);
    console.log('\n📑 Sitemaps:');
    console.log('   https://spywizards.com/blog/wp-sitemap.xml');
    console.log('   https://spywizards.com/blog/sitemap_index.xml');
})();
