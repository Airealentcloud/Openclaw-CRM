const fs = require('fs');
const path = require('path');

// Article data for featured images
const articles = [
    { id: 1, title: "What Is a Private Investigator?", subtitle: "Complete Guide 2026", slug: "what-is-private-investigator", color: "blue" },
    { id: 2, title: "Private Investigator Cost Guide", subtitle: "2026 Pricing & Analysis", slug: "private-investigator-cost", color: "red" },
    { id: 3, title: "How to Hire a Private Investigator", subtitle: "12-Step Checklist", slug: "hire-private-investigator", color: "mixed" },
    { id: 4, title: "Missing Persons Investigation", subtitle: "How PIs Find People", slug: "missing-persons-investigation", color: "blue" },
    { id: 5, title: "Is It Legal to Hire a PI?", subtitle: "Complete Legal Guide", slug: "is-it-legal-hire-pi", color: "red" },
    { id: 6, title: "GPS Tracking Laws", subtitle: "State-by-State Guide 2026", slug: "gps-tracking-laws", color: "mixed" },
    { id: 7, title: "Phone Records Access", subtitle: "What's Legal & What's Not", slug: "phone-records-legal", color: "blue" },
    { id: 8, title: "Cheating Spouse Investigation", subtitle: "2026 Cost Guide", slug: "cheating-spouse-cost", color: "red" },
    { id: 9, title: "Finding Hidden Bank Accounts", subtitle: "Asset Search Guide", slug: "hidden-bank-accounts", color: "mixed" },
    { id: 10, title: "PI Evidence in Court", subtitle: "Admissibility Guide", slug: "pi-evidence-admissible", color: "blue" },
    { id: 11, title: "Background Check Cost", subtitle: "2026 Pricing Guide", slug: "background-check-cost", color: "red" },
    { id: 12, title: "Can a PI Follow You?", subtitle: "Surveillance Law Guide", slug: "pi-follow-legal", color: "mixed" },
    { id: 13, title: "Private Investigator Near Me", subtitle: "How to Find Local PIs", slug: "private-investigator-near-me", color: "blue" },
    { id: 14, title: "Corporate Investigation Services", subtitle: "Business Fraud & More", slug: "corporate-investigation", color: "red" },
    { id: 15, title: "What Can PIs Legally Do?", subtitle: "Complete Capability Guide", slug: "what-pis-can-do", color: "mixed" }
];

// PathwayPIS brand colors
const colors = {
    blue: { primary: '#1a365d', secondary: '#2c5282', accent: '#3182ce' },
    red: { primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444' },
    mixed: { primary: '#1a365d', secondary: '#dc2626', accent: '#4a5568' }
};

// Generate SVG for each featured image
function generateSVG(article) {
    const colorScheme = colors[article.color];
    const gradientId = `grad-${article.id}`;
    
    // Background pattern for visual interest
    const pattern = article.id % 3 === 0 ? `
        <pattern id="pattern-${article.id}" patternUnits="userSpaceOnUse" width="100" height="100">
            <circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/>
        </pattern>` : 
        article.id % 3 === 1 ? `
        <pattern id="pattern-${article.id}" patternUnits="userSpaceOnUse" width="60" height="60">
            <rect width="60" height="60" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        </pattern>` : `
        <pattern id="pattern-${article.id}" patternUnits="userSpaceOnUse" width="40" height="40">
            <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        </pattern>`;

    // Icon based on article theme
    const getIcon = () => {
        const icons = {
            1: `<circle cx="180" cy="315" r="60" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <line x1="220" y1="355" x2="280" y2="415" stroke="rgba(255,255,255,0.2)" stroke-width="4" stroke-linecap="round"/>`,
            2: `<rect x="140" y="275" width="80" height="80" rx="10" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <text x="180" y="325" font-size="40" fill="rgba(255,255,255,0.2)" text-anchor="middle" font-family="Arial"$
                </text>`,
            3: `<rect x="140" y="270" width="80" height="100" rx="5" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <line x1="155" y1="295" x2="205" y2="295" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <line x1="155" y1="315" x2="205" y2="315" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <line x1="155" y1="335" x2="185" y2="335" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>`,
            4: `<circle cx="180" cy="315" r="50" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <text x="180" y="330" font-size="30" fill="rgba(255,255,255,0.2)" text-anchor="middle">?</text>`,
            5: `<rect x="140" y="285" width="80" height="60" rx="5" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <rect x="150" y="300" width="60" height="30" fill="rgba(255,255,255,0.1)"/>`,
            6: `<circle cx="180" cy="290" r="25" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <path d="M180 315 L180 360 M160 340 L200 340" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>`,
            7: `<rect x="155" y="275" width="50" height="80" rx="8" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <circle cx="180" cy="355" r="5" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>`,
            8: `<circle cx="165" cy="315" r="20" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <circle cx="195" cy="315" r="20" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>`,
            9: `<rect x="140" y="275" width="80" height="80" rx="5" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <path d="M155 335 L175 310 L190 325 L205 305" stroke="rgba(255,255,255,0.2)" stroke-width="2" fill="none"/>`,
            10: `<rect x="140" y="275" width="80" height="80" rx="5" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <path d="M155 345 L165 330 L180 340 L195 315 L205 325" stroke="rgba(255,255,255,0.2)" stroke-width="2" fill="none"/>`,
            11: `<rect x="140" y="275" width="80" height="80" rx="5" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <circle cx="180" cy="305" r="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <path d="M165 345 Q180 320 195 345" stroke="rgba(255,255,255,0.2)" stroke-width="2" fill="none"/>`,
            12: `<circle cx="150" cy="340" r="8" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <circle cx="170" cy="320" r="8" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <circle cx="190" cy="300" r="8" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <circle cx="210" cy="280" r="8" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>`,
            13: `<pin cx="180" cy="315" r="40" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <circle cx="180" cy="295" r="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <path d="M180 310 L180 355" stroke="rgba(255,255,255,0.2)" stroke-width="3"/>`,
            14: `<rect x="140" y="285" width="30" height="60" rx="3" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <rect x="175" y="270" width="30" height="90" rx="3" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <rect x="210" y="295" width="30" height="50" rx="3" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>`,
            15: `<rect x="140" y="275" width="80" height="80" rx="5" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <circle cx="160" cy="295" r="8" fill="rgba(255,255,255,0.1)"/>
                <rect x="175" y="285" width="35" height="20" fill="rgba(255,255,255,0.1)"/>
                <rect x="155" y="315" width="50" height="30" fill="rgba(255,255,255,0.1)"/>`
        };
        return icons[article.id] || icons[1];
    };

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colorScheme.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colorScheme.secondary};stop-opacity:1" />
        </linearGradient>
        ${pattern}
    </defs>
    
    <!-- Background -->
    <rect width="1200" height="630" fill="url(#${gradientId})" />
    <rect width="1200" height="630" fill="url(#pattern-${article.id})" />
    
    <!-- Left side decorative element -->
    <rect x="0" y="0" width="360" height="630" fill="rgba(0,0,0,0.2)" />
    ${getIcon()}
    
    <!-- Article number -->
    <text x="60" y="550" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="rgba(255,255,255,0.15)">${String(article.id).padStart(2, '0')}</text>
    
    <!-- Main content area -->
    <g transform="translate(400, 180)">
        <!-- Brand logo placeholder -->
        <rect x="0" y="-60" width="60" height="8" fill="#dc2626" />
        <text x="70" y="-52" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="rgba(255,255,255,0.8)">PATHWAYPIS</text>
        
        <!-- Title -->
        <text x="0" y="50" font-family="Georgia, serif" font-size="52" font-weight="bold" fill="white">${wrapText(article.title, 25)}</text>
        
        <!-- Subtitle -->
        <text x="0" y="130" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.85)">${article.subtitle}</text>
        
        <!-- Decorative line -->
        <rect x="0" y="170" width="100" height="4" fill="#dc2626" />
    </g>
    
    <!-- Bottom accent bar -->
    <rect x="0" y="610" width="1200" height="20" fill="rgba(0,0,0,0.3)" />
</svg>`;
}

// Simple text wrapping for SVG
function wrapText(text, maxLength) {
    if (text.length <= maxLength) return text;
    // For simplicity, return as-is - in production would split into tspan elements
    return text;
}

// Generate all featured images
function generateAllImages() {
    const outputDir = path.join(__dirname, '..', 'pathway-seo-data', 'featured-images');
    
    console.log('=== Generating Featured Images for PathwayPIS ===\n');
    
    const results = [];
    
    articles.forEach(article => {
        const svg = generateSVG(article);
        const filename = `article-${String(article.id).padStart(2, '0')}-${article.slug}.svg`;
        const filepath = path.join(outputDir, filename);
        
        fs.writeFileSync(filepath, svg);
        console.log(`✓ Generated: ${filename}`);
        
        results.push({
            article: article.id,
            title: article.title,
            filename: filename,
            filepath: filepath
        });
    });
    
    // Save manifest
    const manifestPath = path.join(outputDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));
    
    console.log(`\n✓ All ${results.length} featured images generated`);
    console.log(`✓ Manifest saved to ${manifestPath}`);
    
    return results;
}

generateAllImages();
