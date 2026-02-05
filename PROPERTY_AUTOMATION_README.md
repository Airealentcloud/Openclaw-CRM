# Airealent Property Listing Automation

Automated property listing creation for airealent.ng via WordPress REST API.

## Quick Start

```bash
# Get WordPress Application Password
# 1. Go to: https://airealent.ng/wp-admin/profile.php
# 2. Find "Application Passwords" section
# 3. Create new password named "API"
# 4. Copy the generated password

# Run the script
node create-property-airealent.js your_username your_app_password
```

## Features

- ✅ Create property listings with full metadata
- ✅ Auto-create taxonomies (types, status, features, locations)
- ✅ Set property features: Security, Main Road, Utilities
- ✅ Configure SEO settings automatically
- ✅ Generate PR summary for review
- ✅ Draft mode (safe - doesn't publish immediately)

## Property Data Template

Edit `propertyData` object in `create-property-airealent.js`:

```javascript
const propertyData = {
  title: "[723 Sqm] Residential Land for Sale in Wuse Zone - ₦750M",
  content: `...description...`,
  status: 'draft', // or 'publish'
  
  meta: {
    'REALHOMES_property_price': '750000000',
    'REALHOMES_property_size': '723',
    'REALHOMES_property_bedrooms': '7',
    'REALHOMES_property_bathrooms': '4',
    'REALHOMES_property_address': 'Wuse Zone, Abuja',
    // ... more fields
  },
  
  taxonomies: {
    'property-type': ['land'],
    'property-status': ['for-sale'],
    'property-feature': ['security', 'main-road', 'utilities'],
    'property-city': ['abuja'],
    'property-area': ['wuse-zone'],
  },
};
```

## Output

After running, you'll get:
- Property ID
- Edit URL (for adding images)
- PR summary file (`PULL_REQUEST_PROPERTY_LISTING.md`)

## Workflow

1. Edit property data in the script
2. Run: `node create-property-airealent.js`
3. Review generated PR summary
4. Open Edit URL to upload images
5. Set featured image
6. Publish when ready

## Troubleshooting

**"Missing WordPress credentials"**
- Get Application Password from wp-admin/profile.php

**"HTTP 401"**
- Check username and password
- Ensure Application Password is correct

**"HTTP 404"**
- Verify REST API endpoint exists
- Check that 'properties' post type is registered

**Taxonomy errors**
- Some themes use custom taxonomies
- Check your theme's taxonomy names

---

*Created by Claude (Nightly Build Session)*
