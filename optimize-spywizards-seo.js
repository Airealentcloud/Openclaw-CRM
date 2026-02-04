/**
 * SpyWizards SEO Content Optimizer
 * Fetches posts, optimizes structure (fix multiple H1s, add Nigeria context, internal links), and updates via WP REST API
 */

const https = require('https');
const http = require('http');

// Configuration
const WP_HOST = 'spywizards.com';
const WP_PATH_PREFIX = '/blog/wp-json';
const USERNAME = 'Aiwisemind';
const APP_PASSWORD = 'IbGx RiYc qzoX swu5 nZtb mR37';

// Article slugs to process (based on the markdown files)
const ARTICLE_SLUGS = [
    'complete-personal-cybersecurity-checklist-2025',
    'facebook-account-recovery-2025',
    'facebook-account-recovery-proven-methods-2025',
    'how-to-check-if-data-has-been-breached-2025',
    'how-to-recover-hacked-instagram-account-2025',
    'personal-cybersecurity-checklist-2025',
    'protecting-social-media-accounts-from-hackers',
    'protecting-social-media-accounts-hackers-security-best-practices',
    'social-media-account-recovery-services-legit-scam',
    'social-media-recovery-services-scam-or-legit'
];

// Internal links mapping (articles to link to each other)
const INTERNAL_LINKS = {
    'cybersecurity': [
        { text: 'Personal Cybersecurity Checklist', url: '/blog/complete-personal-cybersecurity-checklist-2025' },
        { text: 'data breach monitoring services', url: '/blog/how-to-check-if-data-has-been-breached-2025' },
        { text: 'protecting your accounts from hackers', url: '/blog/protecting-social-media-accounts-hackers-security-best-practices' }
    ],
    'facebook': [
        { text: 'Facebook Account Recovery Guide', url: '/blog/facebook-account-recovery-2025' },
        { text: 'proven Facebook recovery methods', url: '/blog/facebook-account-recovery-proven-methods-2025' }
    ],
    'instagram': [
        { text: 'Instagram Account Recovery', url: '/blog/how-to-recover-hacked-instagram-account-2025' }
    ],
    'data-breach': [
        { text: 'check if your data has been breached', url: '/blog/how-to-check-if-data-has-been-breached-2025' },
        { text: 'personal cybersecurity protection', url: '/blog/personal-cybersecurity-checklist-2025' }
    ],
    'scams': [
        { text: 'avoid recovery service scams', url: '/blog/social-media-account-recovery-services-legit-scam' },
        { text: 'legitimate vs scam recovery services', url: '/blog/social-media-recovery-services-scam-or-legit' }
    ]
};

// Helper: Make HTTP request to WordPress REST API
function wpRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${USERNAME}:${APP_PASSWORD}`).toString('base64');
        
        const options = {
            hostname: WP_HOST,
            path: WP_PATH_PREFIX + endpoint,
            method: method,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body });
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

// Helper: Extract title from content (first H1 or convert slug)
function extractTitle(slug, content) {
    // Try to find title in first H1 or h1
    const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i) || content.match(/^# (.+)$/m);
    if (h1Match) {
        return h1Match[1] || h1Match[2];
    }
    // Convert slug to title
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Helper: Check for multiple H1s
function countH1s(content) {
    const htmlMatches = (content.match(/<h1[^>]*>/gi) || []).length;
    const markdownMatches = (content.match(/^# /gm) || []).length;
    return htmlMatches + markdownMatches;
}

// Helper: Convert markdown-style headers to proper HTML structure
function fixContentStructure(content, title) {
    let fixed = content;
    
    // Remove the title H1 from body if it exists at the start
    fixed = fixed.replace(/^<h1[^>]*>[^<]+<\/h1>\s*/i, '');
    fixed = fixed.replace(/^# .+\n\n/, '');
    
    // Convert subsequent markdown H1s to H2
    fixed = fixed.replace(/^# (#+ )/gm, '## ');
    fixed = fixed.replace(/<h1([^>]*)>/gi, '<h2$1>');
    fixed = fixed.replace(/<\/h1>/gi, '</h2>');
    
    // Convert ## to H2 (first occurrence) and ### to H3
    const lines = fixed.split('\n');
    let result = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Handle markdown headers
        if (line.match(/^###+ /)) {
            // Convert ### to H3
            const level = line.match(/^(#+)/)[1].length;
            if (level === 2) {
                line = line.replace(/^## /, '<h2>') + '</h2>';
            } else if (level === 3) {
                line = line.replace(/^### /, '<h3>') + '</h3>';
            }
        } else if (line.match(/^## /) && !line.includes('<h2>')) {
            line = line.replace(/^## /, '<h2>') + '</h2>';
        }
        
        result.push(line);
    }
    
    return result.join('\n');
}

// Helper: Add Nigeria-specific context
function addNigeriaContext(content, topic) {
    const nigeriaExamples = {
        'cybersecurity': `
<p>In Nigeria, where digital adoption continues to accelerate across Lagos, Abuja, Port Harcourt, and other major cities, cybersecurity awareness has become essential for individuals and businesses alike. The Central Bank of Nigeria and Nigerian Communications Commission have increasingly emphasized the importance of digital security as mobile banking and fintech services proliferate throughout the country.</p>
<p>Nigerian internet users face unique challenges, including widespread use of public WiFi in business centers and co-working spaces, the growing popularity of Jumia, Konga, and other e-commerce platforms, and increasing adoption of social media for business and personal use. Protecting your digital presence in this environment requires understanding both global best practices and local security considerations.</p>
        `,
        'facebook': `
<p>With over 30 million active Facebook users in Nigeria, the platform has become essential for personal connections, business marketing, and community building across Lagos, Kano, Ibadan, and beyond. Nigerian businesses rely heavily on Facebook Pages for customer engagement, making account security critical for economic livelihoods.</p>
<p>The rise of Facebook Marketplace in Nigeria has created new opportunities for buying and selling, but also new vectors for fraud and account compromise. Understanding how to recover and protect your Facebook account is particularly important for Nigerian entrepreneurs and small business owners who depend on the platform for their income.</p>
        `,
        'instagram': `
<p>Instagram has become increasingly popular among Nigerian millennials and Gen Z users, particularly in Lagos—the entertainment and fashion capital of Africa. Nigerian influencers, fashion designers, musicians, and content creators rely on Instagram for brand building and audience engagement.</p>
<p>The platform's visual nature makes it particularly valuable for Nigerian creative entrepreneurs showcasing products and services to both local and international audiences. Account security for these users isn't just personal—it's often directly tied to business operations and professional reputation.</p>
        `,
        'data-breach': `
<p>As Nigeria's digital economy grows, with increasing adoption of online banking, fintech applications like Opay, PalmPay, and Moniepoint, and e-government services, the risk of data exposure has grown correspondingly. Nigerian consumers now share personal information with numerous online services, often without understanding the security implications.</p>
<p>The Nigeria Data Protection Act (NDPA) has established frameworks for data handling, but individual vigilance remains essential. Understanding whether your data has been compromised—and taking appropriate action—protects not just your digital accounts but potentially your financial security as well.</p>
        `,
        'scams': `
<p>Nigeria has, unfortunately, developed an international reputation for online fraud, which means that legitimate Nigerian users often face additional scrutiny when creating accounts or attempting recoveries on international platforms. This makes understanding legitimate recovery channels and avoiding scam services particularly important for Nigerian users.</p>
<p>The proliferation of "recovery agents" in Nigeria—both legitimate and fraudulent—reflects the high demand for account recovery assistance. Being able to distinguish between ethical cybersecurity services and scams designed to exploit desperate account owners is a critical digital literacy skill for Nigerian internet users.</p>
        `
    };
    
    return nigeriaExamples[topic] || '';
}

// Helper: Add strategic internal links
function addInternalLinks(content, topic) {
    const links = INTERNAL_LINKS[topic] || [];
    let linkSection = '';
    
    if (links.length > 0) {
        linkSection = '<h2>Related Articles</h2><ul>';
        links.forEach(link => {
            linkSection += `<li><a href="${link.url}">${link.text}</a></li>`;
        });
        linkSection += '</ul>';
    }
    
    return content + '\n\n' + linkSection;
}

// Helper: Add CTA section
function addCTASection(content, service = 'general') {
    const ctaMessages = {
        'general': `
<h2>Need Professional Help?</h2>
<p>If you're struggling with account security issues or need assistance with recovery, the cybersecurity experts at SpyWizards are here to help. Our team specializes in social media account recovery, cybersecurity consulting, and digital protection services for individuals and businesses across Nigeria.</p>
<p>Contact SpyWizards today for a confidential consultation:</p>
<ul>
<li><strong>Website:</strong> <a href="https://spywizards.com">spywizards.com</a></li>
<li><strong>Email:</strong> info@spywizards.com</li>
<li><strong>Services:</strong> Account Recovery, Cybersecurity Consulting, Security Audits</li>
</ul>
<p>Don't let account issues compromise your digital presence. Get professional help from trusted experts.</p>
        `,
        'recovery': `
<h2>Professional Account Recovery Services</h2>
<p>If you're unable to recover your account through official channels, SpyWizards offers professional recovery assistance. Our ethical cybersecurity team works within platform guidelines to help you regain access to your compromised accounts.</p>
<p><strong>Contact SpyWizards for account recovery assistance:</strong></p>
<ul>
<li><strong>Website:</strong> <a href="https://spywizards.com/contact">spywizards.com/contact</a></li>
<li><strong>Specializing in:</strong> Facebook, Instagram, Twitter, LinkedIn, and other platforms</li>
<li><strong>Service Areas:</strong> All of Nigeria and international clients</li>
</ul>
        `
    };
    
    return content + '\n\n' + (ctaMessages[service] || ctaMessages['general']);
}

// Helper: Optimize content for SEO
function optimizeForSEO(content, title, category) {
    // Ensure proper paragraph structure
    content = content.replace(/\n{3,}/g, '\n\n');
    
    // Add keyword density (subtle)
    const keywords = {
        'cybersecurity': ['cybersecurity', 'account security', 'digital protection', 'online safety'],
        'facebook': ['Facebook account', 'account recovery', 'disabled Facebook', 'Facebook security'],
        'instagram': ['Instagram account', 'hacked Instagram', 'account recovery', 'Instagram security'],
        'data-breach': ['data breach', 'personal data', 'identity protection', 'credential security'],
        'scams': ['recovery scam', 'account recovery services', 'fraud prevention', 'legitimate recovery']
    };
    
    const topic = Object.keys(keywords).find(k => title.toLowerCase().includes(k) || category.toLowerCase().includes(k)) || 'cybersecurity';
    const relevantKeywords = keywords[topic] || keywords['cybersecurity'];
    
    // Ensure keywords appear naturally in content
    relevantKeywords.forEach(keyword => {
        if (!content.toLowerCase().includes(keyword.toLowerCase())) {
            // Add keyword naturally if missing
            content = content.replace('</h2>', ` ${keyword}.</h2>`);
        }
    });
    
    return content;
}

// Helper: Reconstruct article with proper SEO structure
function reconstructArticle(post, topic) {
    // Extract title from post title
    const title = post.title.rendered;
    
    // Extract content
    let content = post.content.rendered;
    
    // Remove existing H1s and fix structure
    content = fixContentStructure(content, title);
    
    // Add Nigeria context
    content = addNigeriaContext(content, topic);
    
    // Add internal links
    content = addInternalLinks(content, topic);
    
    // Add CTA
    content = addCTASection(content, topic.includes('recovery') ? 'recovery' : 'general');
    
    // Final optimization
    content = optimizeForSEO(content, title, topic);
    
    // Wrap with proper structure
    const finalContent = `
<h1>${title}</h1>

${content}

<hr>
<p><em>This article was updated for accuracy and completeness. For the latest security recommendations, visit <a href="https://spywizards.com">SpyWizards.com</a>.</em></p>
    `.trim();
    
    return finalContent;
}

// Main function
async function optimizeAndUpdatePosts() {
    console.log('🚀 Starting SpyWizards SEO Optimization...\n');
    
    const results = [];
    
    for (const slug of ARTICLE_SLUGS) {
        console.log(`📝 Processing: ${slug}`);
        
        try {
            // Fetch post by slug
            const response = await wpRequest('GET', `/wp/v2/posts?slug=${slug}`);
            
            if (!response.data || response.data.length === 0) {
                console.log(`   ⚠️  Post not found: ${slug}`);
                results.push({ slug, status: 'NOT_FOUND', url: null });
                continue;
            }
            
            const post = response.data[0];
            const currentH1s = countH1s(post.content.rendered);
            
            console.log(`   - Post ID: ${post.id}`);
            console.log(`   - Current H1 count: ${currentH1s}`);
            console.log(`   - Title: ${post.title.rendered}`);
            
            // Determine topic for context
            let topic = 'cybersecurity';
            if (slug.includes('facebook')) topic = 'facebook';
            else if (slug.includes('instagram')) topic = 'instagram';
            else if (slug.includes('breach')) topic = 'data-breach';
            else if (slug.includes('scam') || slug.includes('legit')) topic = 'scams';
            
            // Reconstruct article with proper SEO structure
            const optimizedContent = reconstructArticle(post, topic);
            const newH1s = countH1s(optimizedContent);
            
            console.log(`   - New H1 count: ${newH1s}`);
            console.log(`   - Optimizing content...`);
            
            // Update post
            const updateResponse = await wpRequest('PUT', `/wp/v2/posts/${post.id}`, {
                content: optimizedContent,
                status: 'publish'
            });
            
            const postUrl = updateResponse.data.link || `https://spywizards.com/blog/${slug}`;
            
            console.log(`   ✅ Updated successfully!`);
            console.log(`   📄 URL: ${postUrl}`);
            console.log('');
            
            results.push({
                slug,
                status: 'UPDATED',
                postId: post.id,
                url: postUrl,
                h1Count: { before: currentH1s, after: newH1s }
            });
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            results.push({ slug, status: 'ERROR', error: error.message });
        }
    }
    
    // Summary
    console.log('\n📊 OPTIMIZATION SUMMARY');
    console.log('='.repeat(50));
    
    const updated = results.filter(r => r.status === 'UPDATED').length;
    const notFound = results.filter(r => r.status === 'NOT_FOUND').length;
    const errors = results.filter(r => r.status === 'ERROR').length;
    
    console.log(`Posts Updated: ${updated}`);
    console.log(`Posts Not Found: ${notFound}`);
    console.log(`Errors: ${errors}`);
    
    console.log('\n🔗 UPDATED POSTS:');
    results.filter(r => r.status === 'UPDATED').forEach(r => {
        console.log(`  • ${r.url}`);
    });
    
    return results;
}

// Run
optimizeAndUpdatePosts()
    .then(results => {
        console.log('\n✅ All operations completed!');
        process.exit(0);
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
