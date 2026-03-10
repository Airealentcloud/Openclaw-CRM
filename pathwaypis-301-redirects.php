<?php
/**
 * PathwayPIS 301 Redirects
 * Fix duplicate content issues
 * 
 * Add this code to your theme's functions.php or as a must-use plugin
 */

function pathwaypis_301_redirects() {
    // Get current URL path
    $current_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $current_path = trim($current_path, '/');
    
    // Define redirects: old_slug => new_url
    $redirects = array(
        // Redirect 1: Old How to Hire Checklist -> New comprehensive version
        'how-to-hire-a-private-investigator-12-step-checklist-2026' => 'https://pathwaypis.com/how-to-hire-a-private-investigator-12-step-checklist-for-2026/',
        
        // Redirect 2: Old Cost Guide -> New comprehensive version  
        'private-investigator-cost-guide-what-drives-price-in-2026' => 'https://pathwaypis.com/private-investigator-cost-2026-complete-pricing-guide-what-drives-price/',
        
        // Redirect 3: Old Legal Guide -> New comprehensive version
        'is-it-legal-to-hire-a-private-investigator-complete-2026-guide' => 'https://pathwaypis.com/private-investigator-legal-complete-2026-guide-to-laws-licensing-legal-boundaries/',
    );
    
    // Check if current path matches any redirect
    if (isset($redirects[$current_path])) {
        wp_redirect($redirects[$current_path], 301);
        exit();
    }
    
    // Also check with trailing slashes and variations
    $alt_path = rtrim($current_path, '/');
    if (isset($redirects[$alt_path])) {
        wp_redirect($redirects[$alt_path], 301);
        exit();
    }
}

// Run on template redirect hook
add_action('template_redirect', 'pathwaypis_301_redirects', 1);

/**
 * Alternative: Using WordPress rewrite rules
 * Add to .htaccess or use this PHP-based approach above
 */

// If you prefer .htaccess method, use these rules:
/*
# PathwayPIS 301 Redirects - Duplicate Content Fix
Redirect 301 /how-to-hire-a-private-investigator-12-step-checklist-2026/ https://pathwaypis.com/how-to-hire-a-private-investigator-12-step-checklist-for-2026/
Redirect 301 /private-investigator-cost-guide-what-drives-price-in-2026/ https://pathwaypis.com/private-investigator-cost-2026-complete-pricing-guide-what-drives-price/
Redirect 301 /is-it-legal-to-hire-a-private-investigator-complete-2026-guide/ https://pathwaypis.com/private-investigator-legal-complete-2026-guide-to-laws-licensing-legal-boundaries/
*/
