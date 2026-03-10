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
        const options = {
            hostname: new URL(url).hostname,
            path: new URL(url).pathname + new URL(url).search,
            method: method,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (data) {
            const postData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }

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

// Check if WordPress API is accessible
async function checkConnection() {
    console.log('Checking WordPress API connection...');
    try {
        const response = await makeRequest(`${WP_URL}/wp-json/`);
        console.log('WordPress API Status:', response.status);
        console.log('WordPress Version:', response.data?.namespaces ? 'Accessible' : 'Check failed');
        return response.status === 200;
    } catch (error) {
        console.error('Connection error:', error.message);
        return false;
    }
}

// Get existing posts
async function getPosts() {
    console.log('Fetching existing posts...');
    try {
        const response = await makeRequest(`${WP_API}/posts?per_page=100`);
        return response.data || [];
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        return [];
    }
}

// Get categories
async function getCategories() {
    console.log('Fetching categories...');
    try {
        const response = await makeRequest(`${WP_API}/categories?per_page=100`);
        return response.data || [];
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        return [];
    }
}

// Create a category if it doesn't exist
async function createCategory(name, slug) {
    console.log(`Creating category: ${name}`);
    try {
        const response = await makeRequest(`${WP_API}/categories`, 'POST', {
            name: name,
            slug: slug
        });
        return response.data;
    } catch (error) {
        console.error(`Error creating category ${name}:`, error.message);
        return null;
    }
}

// Extract content from HTML file
function extractArticleData(htmlContent, filename) {
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
    console.log(`Creating post: ${postData.title}`);
    try {
        const response = await makeRequest(`${WP_API}/posts`, 'POST', postData);
        console.log(`Post created with ID: ${response.data?.id}, Status: ${response.status}`);
        return response.data;
    } catch (error) {
        console.error(`Error creating post:`, error.message);
        return null;
    }
}

// Main function
async function main() {
    const connectionOk = await checkConnection();
    if (!connectionOk) {
        console.error('Cannot connect to WordPress API. Check credentials and URL.');
        process.exit(1);
    }

    // Get existing posts
    const existingPosts = await getPosts();
    console.log(`Found ${existingPosts.length} existing posts`);

    // Get categories
    const categories = await getCategories();
    console.log(`Found ${categories.length} categories`);

    // Check for the articles to publish
    const articlesToPublish = [
        { file: 'pathway-seo-data/article-7-phone-records.html', slug: 'private-investigator-phone-records-legal' },
    ];

    const publishedUrls = [];

    for (const article of articlesToPublish) {
        const filePath = path.join(__dirname, '..', article.file);
        if (!fs.existsSync(filePath)) {
            console.log(`File not found: ${filePath}`);
            continue;
        }

        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        const articleData = extractArticleData(htmlContent, article.file);

        // Check if post already exists by slug
        const existingPost = existingPosts.find(p => p.slug === article.slug);
        if (existingPost) {
            console.log(`Post already exists: ${article.slug}`);
            publishedUrls.push({ title: articleData.title, url: existingPost.link, status: 'existing' });
            continue;
        }

        // Create the post
        const post = await createPost({
            title: articleData.title,
            content: articleData.content,
            status: 'publish',
            slug: article.slug,
            excerpt: articleData.metaDescription,
            categories: [] // Will add categories after creation
        });

        if (post) {
            publishedUrls.push({ title: articleData.title, url: post.link, status: 'published' });
        }
    }

    // Save published URLs
    const urlsFile = path.join(__dirname, '..', 'crm', 'published-urls.txt');
    const urlsContent = publishedUrls.map(u => `${u.status.toUpperCase()}: ${u.title}\nURL: ${u.url}\n`).join('\n');
    fs.appendFileSync(urlsFile, urlsContent + '\n---\n');
    console.log(`Published URLs saved to ${urlsFile}`);

    console.log('\n=== Publishing Summary ===');
    publishedUrls.forEach(u => console.log(`${u.status}: ${u.title} - ${u.url}`));
}

main().catch(console.error);
