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

// Check if Redirection plugin is installed and active
async function checkRedirectionPlugin() {
    console.log('Checking Redirection plugin...\n');
    
    // Try to access Redirection API
    try {
        const response = await makeRequest(`${WP_URL}/wp-json/redirection/v1/redirect`);
        if (response.status === 200) {
            console.log('✓ Redirection plugin is installed and active');
            return true;
        } else if (response.status === 404) {
            console.log('✗ Redirection plugin is not installed or not active');
            return false;
        } else {
            console.log('? Unknown status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error checking Redirection plugin:', error.message);
        return false;
    }
}

// Install/Activate Redirection plugin (requires admin or plugin installation capability)
async function installRedirectionPlugin() {
    console.log('\nAttempting to install Redirection plugin...');
    
    // Note: WordPress REST API doesn't have a built-in endpoint for plugin installation
    // This would typically require WP-CLI access or a custom endpoint
    console.log('Plugin installation requires WP-CLI or manual installation via WordPress admin.');
    console.log('Please install the Redirection plugin manually from:');
    console.log('WordPress Admin > Plugins > Add New > Search "Redirection" > Install > Activate');
    
    return false;
}

// Create redirect rules using WordPress .htaccess or custom method
async function createRedirects() {
    console.log('\n=== Creating Redirect Rules ===\n');
    
    // Read the redirects from the htaccess rules file
    const htaccessPath = path.join(__dirname, '..', 'crm', 'redirects-htaccess-rules.txt');
    
    if (!fs.existsSync(htaccessPath)) {
        console.log('✗ redirects-htaccess-rules.txt not found');
        return [];
    }
    
    const htaccessContent = fs.readFileSync(htaccessPath, 'utf-8');
    
    // Parse the redirect rules
    const redirects = [];
    const redirectRegex = /Redirect 301\s+(\S+)\s+(\S+)/g;
    let match;
    
    while ((match = redirectRegex.exec(htaccessContent)) !== null) {
        redirects.push({
            from: match[1],
            to: match[2],
            type: 301
        });
    }
    
    console.log(`Found ${redirects.length} redirect rules:\n`);
    redirects.forEach((r, i) => {
        console.log(`${i + 1}. ${r.from}`);
        console.log(`   → ${r.to}\n`);
    });
    
    // Check if Redirection plugin API is available
    const hasRedirection = await checkRedirectionPlugin();
    
    if (hasRedirection) {
        console.log('\nAdding redirects via Redirection API...');
        for (const redirect of redirects) {
            try {
                const response = await makeRequest(`${WP_URL}/wp-json/redirection/v1/redirect`, 'POST', {
                    url: redirect.from,
                    action_data: { url: redirect.to },
                    regex: false,
                    match_type: 'url',
                    action_type: 'url',
                    group_id: 1, // Default group
                    status: 'enabled'
                });
                
                if (response.status === 200 || response.status === 201) {
                    console.log(`✓ Created redirect: ${redirect.from}`);
                } else {
                    console.log(`✗ Failed to create redirect (${response.status}): ${redirect.from}`);
                }
            } catch (error) {
                console.error(`Error creating redirect: ${error.message}`);
            }
        }
    } else {
        console.log('\n⚠ Redirection plugin not available.');
        console.log('Redirects must be configured manually via:');
        console.log('1. WordPress Admin > Tools > Redirection (if plugin installed)');
        console.log('2. Or by adding rules to .htaccess file');
    }
    
    return redirects;
}

// Export redirect configuration for manual installation
function exportRedirectConfig(redirects) {
    const configPath = path.join(__dirname, '..', 'crm', 'redirects-config.txt');
    
    let content = `# PathwayPIS Redirect Configuration
# Generated: ${new Date().toISOString()}
# Total Redirects: ${redirects.length}

`;
    
    // Add .htaccess format
    content += `## .htaccess Format ##
<IfModule mod_rewrite.c>
RewriteEngine On

`;
    redirects.forEach(r => {
        content += `RewriteRule ^${r.from.replace(/^\//, '').replace(/\/$/, '')}/?$ ${r.to} [L,R=301]\n`;
    });
    
    content += `
</IfModule>

`;
    
    // Add Redirection plugin JSON format
    content += `## Redirection Plugin JSON ##
${JSON.stringify(redirects.map(r => ({
    url: r.from,
    action_data: { url: r.to },
    regex: false,
    match_type: 'url',
    action_type: 'url',
    status: 'enabled'
})), null, 2)}

`;
    
    // Add CSV format for bulk import
    content += `## CSV Format (for bulk import) ##
Source URL,Target URL,Regex,Type
`;
    redirects.forEach(r => {
        content += `${r.from},${r.to},false,301\n`;
    });
    
    fs.writeFileSync(configPath, content);
    console.log(`✓ Redirect configuration exported to: ${configPath}`);
}

// Main function
async function main() {
    console.log('=== PathwayPIS Redirection Setup ===\n');
    
    const redirects = await createRedirects();
    
    if (redirects.length > 0) {
        exportRedirectConfig(redirects);
    }
    
    console.log('\n=== Summary ===');
    console.log(`Total redirects to configure: ${redirects.length}`);
    console.log('\nNext steps:');
    console.log('1. Install Redirection plugin (if not already installed)');
    console.log('2. Import redirects from crm/redirects-config.txt');
    console.log('3. Test each redirect is working correctly');
}

main().catch(console.error);
