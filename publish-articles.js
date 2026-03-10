const https = require('https');
const fs = require('fs');
const path = require('path');

// WordPress API Configuration
const WP_URL = 'https://pathwaypis.com';
const WP_API = `${WP_URL}/wp-json/wp/v2`;
const USERNAME = 'dynamite';
const PASSWORD = 'tcSM kzGo 8TQP Dqm9 cKtQ kUOb';

// Encode credentials for Basic Auth
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

// Extract content from HTML file
function extractArticleData(htmlContent) {
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
    const descMatch = htmlContent.match(/<meta name="description" content="(.*?)"/);
    const h1Match = htmlContent.match(/<h1>(.*?)<\/h1>/);
    
    // Extract body content (article tag content)
    const bodyMatch = htmlContent.match(/<article[^>]*>([\s\S]*?)<\/article>/);
    
    return {
        title: h1Match ? h1Match[1] : (titleMatch ? titleMatch[1] : 'Untitled'),
        metaDescription: descMatch ? descMatch[1] : '',
        content: bodyMatch ? bodyMatch[1] : htmlContent
    };
}

// Create a post
async function createPost(postData) {
    console.log(`Creating post: ${postData.title.substring(0, 60)}...`);
    try {
        const response = await makeRequest(`${WP_API}/posts`, 'POST', postData);
        if (response.status === 201 || response.status === 200) {
            console.log(`✓ Created: ${response.data?.link}`);
            return response.data;
        } else {
            console.error(`✗ Failed: ${response.status}`, response.data);
            return null;
        }
    } catch (error) {
        console.error(`Error creating post:`, error.message);
        return null;
    }
}

// Get existing posts
async function getPosts() {
    try {
        const response = await makeRequest(`${WP_API}/posts?per_page=100`);
        return response.data || [];
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        return [];
    }
}

// Get or create category
async function getOrCreateCategory(name, slug) {
    try {
        // First try to find existing
        const response = await makeRequest(`${WP_API}/categories?slug=${slug}`);
        if (response.data && response.data.length > 0) {
            return response.data[0].id;
        }
        
        // Create new category
        const createResponse = await makeRequest(`${WP_API}/categories`, 'POST', {
            name: name,
            slug: slug
        });
        return createResponse.data?.id;
    } catch (error) {
        console.error(`Category error for ${name}:`, error.message);
        return null;
    }
}

// Main function
async function main() {
    console.log('=== PathwayPIS Article Publisher ===\n');
    
    // Get existing posts
    const existingPosts = await getPosts();
    console.log(`Found ${existingPosts.length} existing posts\n`);

    // Get or create categories
    const legalCategory = await getOrCreateCategory('Legal Guides', 'legal-guides');
    const servicesCategory = await getOrCreateCategory('PI Services', 'pi-services');
    console.log(`Categories: Legal=${legalCategory}, Services=${servicesCategory}\n`);

    // Articles to publish
    const articlesToPublish = [
        { 
            file: 'pathway-seo-data/article-6-gps-tracking-laws.html', 
            slug: 'gps-tracking-laws-private-investigator',
            category: legalCategory
        },
        { 
            file: 'pathway-seo-data/article-7-phone-records.html', 
            slug: 'private-investigator-phone-records-legal',
            category: legalCategory
        }
    ];

    const publishedUrls = [];

    for (const article of articlesToPublish) {
        const filePath = path.join(__dirname, '..', article.file);
        if (!fs.existsSync(filePath)) {
            console.log(`✗ File not found: ${filePath}`);
            continue;
        }

        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        const articleData = extractArticleData(htmlContent);

        // Check if post already exists by slug
        const existingPost = existingPosts.find(p => p.slug === article.slug);
        if (existingPost) {
            console.log(`⚠ Post already exists: ${article.slug}`);
            publishedUrls.push({ 
                title: articleData.title, 
                url: existingPost.link, 
                slug: article.slug,
                status: 'existing',
                id: existingPost.id
            });
            continue;
        }

        // Create the post
        const post = await createPost({
            title: articleData.title,
            content: articleData.content,
            status: 'publish',
            slug: article.slug,
            excerpt: articleData.metaDescription,
            categories: article.category ? [article.category] : []
        });

        if (post) {
            publishedUrls.push({ 
                title: articleData.title, 
                url: post.link, 
                slug: article.slug,
                status: 'published',
                id: post.id
            });
        }
    }

    // Save published URLs
    const urlsFile = path.join(__dirname, '..', 'crm', 'published-urls.txt');
    const timestamp = new Date().toISOString();
    const urlsContent = `
=== PUBLISHED URLs - ${timestamp} ===
${publishedUrls.map(u => `
[${u.status.toUpperCase()}] ${u.title}
Slug: ${u.slug}
URL: ${u.url}
ID: ${u.id || 'N/A'}
`).join('\n')}
`;
    fs.appendFileSync(urlsFile, urlsContent);
    console.log(`\n✓ URLs saved to ${urlsFile}`);

    console.log('\n=== Publishing Summary ===');
    publishedUrls.forEach(u => console.log(`${u.status.toUpperCase()}: ${u.url}`));
    
    return publishedUrls;
}

main().then(urls => {
    console.log('\nDone!');
    process.exit(0);
}).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
