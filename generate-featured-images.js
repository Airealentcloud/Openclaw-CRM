const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Article list with titles for featured images
const articles = [
    { id: 1, title: "What Is a Private Investigator?", file: "article-1-ahrefs-researched.html", slug: "what-is-private-investigator" },
    { id: 2, title: "Private Investigator Cost Guide 2026", file: "article-2-private-investigator-cost.html", slug: "private-investigator-cost" },
    { id: 3, title: "How to Hire a Private Investigator", file: "article-3-how-to-hire-checklist.html", slug: "hire-private-investigator" },
    { id: 4, title: "Missing Persons Investigation", file: "article-4-clean.html", slug: "missing-persons-investigation" },
    { id: 5, title: "Is It Legal to Hire a PI?", file: "article-5-is-it-legal-to-hire-a-pi.html", slug: "is-it-legal-hire-pi" },
    { id: 6, title: "GPS Tracking Laws", file: "article-6-gps-tracking-laws.html", slug: "gps-tracking-laws", newUrl: "https://pathwaypis.com/gps-tracking-laws-private-investigator/" },
    { id: 7, title: "Phone Records Legal Guide", file: "article-7-phone-records.html", slug: "phone-records-legal", newUrl: "https://pathwaypis.com/private-investigator-phone-records-legal/" },
    { id: 8, title: "Cheating Spouse Investigation Cost", file: "article-8-cheating-spouse-cost.html", slug: "cheating-spouse-cost" },
    { id: 9, title: "Finding Hidden Bank Accounts", file: "article-9-hidden-bank-accounts.html", slug: "hidden-bank-accounts" },
    { id: 10, title: "Is Private Investigator Evidence Admissible?", file: "article-10-evidence-admissible.html", slug: "pi-evidence-admissible" },
    { id: 11, title: "Background Check Cost", file: "article-11-background-check-cost.html", slug: "background-check-cost" },
    { id: 12, title: "Is It Legal for a PI to Follow You?", file: "article-12-following-laws.html", slug: "pi-follow-legal" },
    { id: 13, title: "Private Investigator Near Me", file: "article-13-pi-near-me.html", slug: "private-investigator-near-me" },
    { id: 14, title: "Corporate Investigation Services", file: "article-14-corporate-services.html", slug: "corporate-investigation" },
    { id: 15, title: "What Can Private Investigators Do?", file: "article-15-what-pis-can-do.html", slug: "what-pis-can-do" }
];

// Base prompt template for professional legal/investigation themed images
function generatePrompt(article) {
    const baseStyle = `Professional legal investigation themed image for a private investigator services website. 
Style: Cinematic, dramatic lighting, dark blue (#1a365d) and red (#dc2626) color scheme as accent colors.
Composition: Clean, modern, professional with subtle investigative elements (magnifying glass, documents, cityscape silhouette, or abstract legal symbols).
Mood: Trustworthy, professional, authoritative.
Text overlay area: Leave clean space at top or center for text overlay.
No text in image: The image should have no words, just visual elements.`;

    const specificThemes = {
        1: "Detective silhouette, magnifying glass over documents, professional office setting",
        2: "Calculator with documents, money symbols, professional cost analysis theme",
        3: "Checklist clipboard, professional hiring interview setting, verification documents",
        4: "Missing person poster, searchlight, city map with pins, hopeful but serious tone",
        5: "Scales of justice, law books, gavel, legal documents, compliance theme",
        6: "GPS satellite, car silhouette, digital map interface, location tracking visualization",
        7: "Phone with legal documents, wiretap symbols crossed out, privacy protection theme",
        8: "Couple silhouette with question mark, heart symbol with investigation overlay",
        9: "Bank building, hidden vault, financial documents, asset discovery theme",
        10: "Courtroom, judge's gavel, evidence bag, admissible stamp, legal validation",
        11: "Background check form, fingerprint, ID verification, screening documents",
        12: "Surveillance camera, following footsteps, privacy boundaries visualization",
        13: "Map pin locations, local cityscape, neighborhood search, proximity markers",
        14: "Corporate building, business documents, executive boardroom, fraud investigation",
        15: "Private investigator toolkit, surveillance equipment, diverse case files collage"
    };

    return `${specificThemes[article.id]}. ${baseStyle}`;
}

// Generate images using Nano Banana Pro
async function generateFeaturedImages() {
    const outputDir = path.join(__dirname, '..', 'pathway-seo-data', 'featured-images');
    
    console.log('=== Generating Featured Images for PathwayPIS Articles ===\n');
    console.log(`Output directory: ${outputDir}\n`);

    const results = [];
    
    for (const article of articles) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `${timestamp}-article-${article.id}-${article.slug}.png`;
        const outputPath = path.join(outputDir, filename);
        
        const prompt = generatePrompt(article);
        
        console.log(`\n[${article.id}/15] Generating: ${article.title}`);
        console.log(`Prompt: ${prompt.substring(0, 100)}...`);
        
        try {
            const skillPath = path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'skills', 'nano-banana-pro', 'scripts', 'generate_image.py');
            const cmd = `uv run "${skillPath}" --prompt "${prompt}" --filename "${outputPath}" --resolution 2K`;
            
            console.log(`Running: ${cmd.substring(0, 100)}...`);
            // Note: This would actually run the command in production
            // execSync(cmd, { stdio: 'inherit', timeout: 120000 });
            
            results.push({
                article: article.id,
                title: article.title,
                filename: filename,
                status: 'queued',
                prompt: prompt
            });
            
        } catch (error) {
            console.error(`Error generating image for article ${article.id}:`, error.message);
            results.push({
                article: article.id,
                title: article.title,
                status: 'error',
                error: error.message
            });
        }
    }

    // Save generation log
    const logPath = path.join(outputDir, 'generation-log.json');
    fs.writeFileSync(logPath, JSON.stringify(results, null, 2));
    console.log(`\n✓ Generation log saved to ${logPath}`);
    
    return results;
}

// Generate HTML image templates for manual creation
function generateImageTemplates() {
    const outputDir = path.join(__dirname, '..', 'pathway-seo-data', 'featured-images');
    
    let html = `<!DOCTYPE html>
<html>
<head>
    <title>PathwayPIS Featured Images - 1200x630</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f0f0f0; padding: 20px; }
        .image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
        .image-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .image-container { width: 100%; aspect-ratio: 1200/630; background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); position: relative; display: flex; align-items: center; justify-content: center; }
        .image-container.red { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); }
        .image-container.mixed { background: linear-gradient(135deg, #1a365d 0%, #dc2626 100%); }
        .overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); }
        .content { position: relative; z-index: 1; text-align: center; color: white; padding: 20px; }
        .content h2 { font-size: 18px; margin: 0 0 10px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
        .content .id { font-size: 48px; font-weight: bold; opacity: 0.3; position: absolute; top: 10px; left: 20px; }
        .info { padding: 15px; }
        .info h3 { margin: 0 0 5px 0; font-size: 14px; color: #1a365d; }
        .info p { margin: 0; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <h1>PathwayPIS Featured Images (1200x630px)</h1>
    <div class="image-grid">
`;

    const bgClasses = ['', 'red', 'mixed'];
    
    articles.forEach((article, idx) => {
        const bgClass = bgClasses[idx % 3];
        html += `
        <div class="image-card">
            <div class="image-container ${bgClass}">
                <div class="overlay"></div>
                <div class="content">
                    <span class="id">${String(article.id).padStart(2, '0')}</span>
                    <h2>${article.title}</h2>
                </div>
            </div>
            <div class="info">
                <h3>Article ${article.id}: ${article.title}</h3>
                <p>Slug: ${article.slug}</p>
            </div>
        </div>`;
    });

    html += `
    </div>
</body>
</html>`;

    const htmlPath = path.join(outputDir, 'featured-image-templates.html');
    fs.writeFileSync(htmlPath, html);
    console.log(`✓ HTML templates saved to ${htmlPath}`);
}

// Main
console.log('PathwayPIS Featured Image Generator\n');
generateImageTemplates();
console.log('\nTo generate actual images, you would run:');
articles.forEach(article => {
    console.log(`Article ${article.id}: ${article.title}`);
});
