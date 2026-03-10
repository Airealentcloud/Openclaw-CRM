const https = require('https');
const fs = require('fs');
const path = require('path');

// WordPress API Configuration
const WP_URL = 'https://pathwaypis.com';
const WP_API = `${WP_URL}/wp-json/wp/v2`;
const USERNAME = 'dynamite';
const PASSWORD = 'tcSM kzGo 8TQP Dqm9 cKtQ kUOb';

const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: method,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Get all posts
async function getAllPosts() {
    console.log('Fetching all posts...');
    const posts = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore && page <= 5) {
        const response = await makeRequest(`${WP_API}/posts?per_page=100&page=${page}`);
        if (response.data && Array.isArray(response.data)) {
            posts.push(...response.data);
            hasMore = response.data.length === 100;
        } else {
            hasMore = false;
        }
        page++;
    }
    
    console.log(`✓ Found ${posts.length} posts\n`);
    return posts;
}

// Get or create categories
async function setupCategories() {
    console.log('Setting up categories...\n');
    
    const categoriesToCreate = [
        { name: 'Legal Guides', slug: 'legal-guides' },
        { name: 'PI Services', slug: 'pi-services' },
        { name: 'Investigation Types', slug: 'investigation-types' },
        { name: 'Cost Guides', slug: 'cost-guides' },
        { name: 'Hiring Guides', slug: 'hiring-guides' }
    ];
    
    const categoryMap = {};
    
    for (const cat of categoriesToCreate) {
        // Check if exists
        const existing = await makeRequest(`${WP_API}/categories?slug=${cat.slug}`);
        if (existing.data && existing.data.length > 0) {
            categoryMap[cat.slug] = existing.data[0].id;
            console.log(`✓ Category exists: ${cat.name} (ID: ${existing.data[0].id})`);
        } else {
            // Create new
            const created = await makeRequest(`${WP_API}/categories`, 'POST', cat);
            if (created.data && created.data.id) {
                categoryMap[cat.slug] = created.data.id;
                console.log(`✓ Category created: ${cat.name} (ID: ${created.data.id})`);
            }
        }
    }
    
    console.log('');
    return categoryMap;
}

// Assign categories to posts based on content analysis
async function assignCategories(posts, categories) {
    console.log('Assigning categories to posts...\n');
    
    const categoryAssignments = {
        'legal': ['legal-guides'],
        'cost': ['cost-guides'],
        'hire': ['hiring-guides'],
        'service': ['pi-services'],
        'investigation': ['investigation-types'],
        'cheating': ['investigation-types', 'pi-services'],
        'background': ['investigation-types', 'pi-services'],
        'surveillance': ['investigation-types'],
        'missing': ['investigation-types', 'pi-services'],
        'gps': ['legal-guides'],
        'phone': ['legal-guides'],
        'evidence': ['legal-guides'],
        'corporate': ['pi-services', 'investigation-types']
    };
    
    const results = [];
    
    for (const post of posts) {
        const title = (post.title?.rendered || '').toLowerCase();
        const content = (post.content?.rendered || '').toLowerCase();
        const combined = `${title} ${content}`;
        
        // Determine categories based on content
        const assignedCategoryIds = [];
        
        for (const [keyword, cats] of Object.entries(categoryAssignments)) {
            if (combined.includes(keyword)) {
                for (const cat of cats) {
                    if (categories[cat] && !assignedCategoryIds.includes(categories[cat])) {
                        assignedCategoryIds.push(categories[cat]);
                    }
                }
            }
        }
        
        // Default category if none matched
        if (assignedCategoryIds.length === 0) {
            assignedCategoryIds.push(categories['pi-services']);
        }
        
        // Skip if already has proper categories (not just Uncategorized)
        const currentCats = post.categories || [];
        const hasRealCategory = currentCats.length > 0 && !currentCats.includes(1); // 1 is usually Uncategorized
        
        if (hasRealCategory) {
            console.log(`⚠ Skipped: "${post.title.rendered.substring(0, 50)}..." (already has categories)`);
            results.push({ id: post.id, title: post.title.rendered, status: 'skipped', categories: currentCats });
            continue;
        }
        
        // Update post with categories
        try {
            const response = await makeRequest(`${WP_API}/posts/${post.id}`, 'POST', {
                categories: assignedCategoryIds
            });
            
            if (response.status === 200) {
                console.log(`✓ Updated: "${post.title.rendered.substring(0, 50)}..." - Categories: ${assignedCategoryIds.join(', ')}`);
                results.push({ id: post.id, title: post.title.rendered, status: 'updated', categories: assignedCategoryIds });
            } else {
                console.log(`✗ Failed: "${post.title.rendered.substring(0, 50)}..." (${response.status})`);
                results.push({ id: post.id, title: post.title.rendered, status: 'failed', error: response.status });
            }
        } catch (error) {
            console.error(`✗ Error: "${post.title.rendered.substring(0, 50)}..." - ${error.message}`);
            results.push({ id: post.id, title: post.title.rendered, status: 'error', error: error.message });
        }
    }
    
    return results;
}

// Check for SEO plugin (Yoast or RankMath)
async function checkSEOPlugin() {
    console.log('\nChecking for SEO plugin...');
    
    // Try Yoast
    try {
        const yoast = await makeRequest(`${WP_URL}/wp-json/yoast/v1/`);
        if (yoast.status !== 404) {
            console.log('✓ Yoast SEO detected');
            return 'yoast';
        }
    } catch (e) {}
    
    // Try RankMath
    try {
        const rankmath = await makeRequest(`${WP_URL}/wp-json/rankmath/v1/`);
        if (rankmath.status !== 404) {
            console.log('✓ RankMath SEO detected');
            return 'rankmath';
        }
    } catch (e) {}
    
    console.log('⚠ No SEO plugin API detected. Install Yoast SEO or RankMath for meta management.');
    return null;
}

// Main function
async function main() {
    console.log('=== PathwayPIS Article Update ===\n');
    
    // Get all posts
    const posts = await getAllPosts();
    
    // Setup categories
    const categories = await setupCategories();
    
    // Assign categories to posts
    const updateResults = await assignCategories(posts, categories);
    
    // Check for SEO plugin
    const seoPlugin = await checkSEOPlugin();
    
    // Summary
    const summary = {
        total: updateResults.length,
        updated: updateResults.filter(r => r.status === 'updated').length,
        skipped: updateResults.filter(r => r.status === 'skipped').length,
        failed: updateResults.filter(r => r.status === 'failed' || r.status === 'error').length
    };
    
    console.log('\n=== Summary ===');
    console.log(`Total posts: ${summary.total}`);
    console.log(`Updated: ${summary.updated}`);
    console.log(`Skipped (already categorized): ${summary.skipped}`);
    console.log(`Failed: ${summary.failed}`);
    
    if (!seoPlugin) {
        console.log('\n⚠ SEO Meta Titles/Descriptions:');
        console.log('To add SEO meta, install Yoast SEO or RankMath plugin:');
        console.log('1. WordPress Admin > Plugins > Add New');
        console.log('2. Search for "Yoast SEO" or "RankMath"');
        console.log('3. Install and Activate');
        console.log('4. Then run SEO optimization again');
    }
    
    // Save results
    const resultsPath = path.join(__dirname, '..', 'crm', 'article-update-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        summary,
        results: updateResults,
        categories,
        seoPlugin
    }, null, 2));
    console.log(`\n✓ Results saved to: ${resultsPath}`);
}

main().catch(console.error);
