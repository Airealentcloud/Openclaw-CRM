/**
 * SpyWizards Article Publisher via WordPress REST API
 * Publishes articles from markdown files to WordPress with Rank Math SEO metadata
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const SITE_URL = 'https://spywizards.com/blog/wp-json';
const USERNAME = 'Aiwisemind';
const PASSWORD = 'IbGx RiYc qzoX swu5 nZtb mR37';
const CONTENT_FOLDER = path.join(__dirname, 'spywizards-content');

// Auth header
const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');
const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
};

function extractSeoFrontmatter(content) {
    const seo = {
        title: '',
        description: '',
        focusKeyword: '',
        categories: ['Cybersecurity', 'Social Media Security'],
        tags: []
    };
    
    // Title
    const titleMatch = content.match(/^# (.+)$/m);
    if (titleMatch) seo.title = titleMatch[1].trim();
    
    // Focus keyword
    const keywordMatch = content.match(/\*\*Focus Keyword[:\-]\*\*\s*(.+)/i);
    if (keywordMatch) seo.focusKeyword = keywordMatch[1].trim();
    
    // Meta description
    const descMatch = content.match(/\*\*Meta Description[:\-]\*\*\s*(.+)/i);
    if (descMatch) seo.description = descMatch[1].trim();
    
    // Tags
    const tagsMatch = content.match(/Tags[:\-]\s*(.+)/i);
    if (tagsMatch) {
        seo.tags = tagsMatch[1].split(',').map(t => t.trim());
    }
    
    // Categories
    const catMatch = content.match(/Categories[:\-]\s*(.+)/i);
    if (catMatch) {
        seo.categories = catMatch[1].split(',').map(c => c.trim());
    }
    
    return seo;
}

function convertMarkdownToHtml(content) {
    let html = content;
    
    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Paragraphs
    const paragraphs = html.split(/\n\n+/);
    const htmlParagraphs = paragraphs.map(p => {
        p = p.trim();
        if (p && !p.startsWith('<')) {
            return `<p>${p}</p>`;
        }
        return p;
    });
    
    return htmlParagraphs.join('\n');
}

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

async function getCategoryId(categoryName) {
    const result = await httpRequest(`${SITE_URL}/wp/v2/categories?search=${encodeURIComponent(categoryName)}`);
    if (result.data && result.data.length > 0) {
        const cat = result.data.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
        if (cat) return cat.id;
    }
    return null;
}

async function createCategory(categoryName) {
    const result = await httpRequest(`${SITE_URL}/wp/v2/categories`, 'POST', { name: categoryName });
    if (result.status === 201) return result.data.id;
    return null;
}

async function getTagId(tagName) {
    const result = await httpRequest(`${SITE_URL}/wp/v2/tags?search=${encodeURIComponent(tagName)}`);
    if (result.data && result.data.length > 0) {
        const tag = result.data.find(t => t.name.toLowerCase() === tagName.toLowerCase());
        if (tag) return tag.id;
    }
    return null;
}

async function createTag(tagName) {
    const result = await httpRequest(`${SITE_URL}/wp/v2/tags`, 'POST', { name: tagName });
    if (result.status === 201) return result.data.id;
    return null;
}

async function publishArticle(filepath) {
    console.log(`\n📄 Publishing: ${path.basename(filepath)}`);
    
    const content = fs.readFileSync(filepath, 'utf8');
    const seo = extractSeoFrontmatter(content);
    const htmlContent = convertMarkdownToHtml(content);
    
    const slug = path.basename(filepath, '.md').toLowerCase().replace(/_/g, '-');
    
    // Get category IDs
    const categoryIds = [];
    for (const catName of seo.categories) {
        let catId = await getCategoryId(catName);
        if (!catId) catId = await createCategory(catName);
        if (catId) categoryIds.push(catId);
    }
    
    // Get tag IDs
    const tagIds = [];
    for (const tagName of seo.tags) {
        let tagId = await getTagId(tagName);
        if (!tagId) tagId = await createTag(tagName);
        if (tagId) tagIds.push(tagId);
    }
    
    const postData = {
        title: seo.title || path.basename(filepath, '.md').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        content: htmlContent,
        slug: slug,
        status: 'publish'
    };
    
    if (categoryIds.length > 0) postData.categories = categoryIds;
    if (tagIds.length > 0) postData.tags = tagIds;
    
    // Rank Math SEO meta
    postData.meta = {
        rank_math_title: seo.title,
        rank_math_description: seo.description,
        rank_math_focus_keyword: seo.focusKeyword
    };
    
    const result = await httpRequest(`${SITE_URL}/wp/v2/posts`, 'POST', postData);
    
    if (result.status === 201) {
        console.log(`✅ Published: ${result.data.link}`);
        return { success: true, url: result.data.link, id: result.data.id };
    } else {
        console.log(`❌ Failed: ${result.status}`);
        return { success: false, error: result.data };
    }
}

async function main() {
    console.log('🚀 Starting SpyWizards Article Publisher');
    console.log(`📁 Content folder: ${CONTENT_FOLDER}`);
    console.log(`🌐 Site: ${SITE_URL}`);
    
    // Find all markdown files
    const files = fs.readdirSync(CONTENT_FOLDER).filter(f => f.endsWith('.md')).sort();
    
    console.log(`\n📊 Found ${files.length} articles to publish\n`);
    
    const results = [];
    for (const file of files) {
        const result = await publishArticle(path.join(CONTENT_FOLDER, file));
        results.push(result);
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 PUBLICATION SUMMARY');
    console.log('='.repeat(50));
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (successful > 0) {
        console.log('\n🔗 Published URLs:');
        for (const r of results) {
            if (r.success) console.log(`  - ${r.url}`);
        }
    }
    
    // Save log
    const logFile = path.join(CONTENT_FOLDER, '..', 'spywizards-posts-log.md');
    let logContent = '# SpyWizards.com Posts Log\n\n';
    logContent += `**Published:** ${successful}\n`;
    logContent += `**Failed:** ${failed}\n\n`;
    logContent += '## Published Posts\n\n';
    for (const r of results) {
        if (r.success) {
            logContent += `- [${r.url}](${r.url}) - ID: ${r.id}\n`;
        }
    }
    fs.writeFileSync(logFile, logContent);
    console.log(`\n📝 Log saved to: ${logFile}`);
}

main().catch(console.error);
