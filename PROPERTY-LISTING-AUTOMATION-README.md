# Property Listing Automation for airealent.ng

## Overview
This script automates property listing creation for airealent.ng via WordPress REST API. It creates property listings with SEO metadata, custom fields, and taxonomy terms in seconds instead of manual browser automation.

## Features
- ✅ Create property listings via WordPress REST API
- ✅ Automatic SEO optimization with Rank Math
- ✅ Support for property types, status, locations, and features
- ✅ Generate professional property descriptions
- ✅ Batch processing from JSON files
- ✅ Interactive mode for single listings
- ✅ Draft mode for review before publishing
- ✅ Logging and error reporting

## Prerequisites
1. WordPress Application Password for airealent.ng
2. Node.js installed on your system

## Setup Instructions

### 1. Get WordPress Application Password
1. Log in to airealent.ng/wp-admin
2. Go to Users → Your Profile
3. Scroll to "Application Passwords"
4. Create a new application password (name it "Property Automation")
5. Copy the generated password (it will look like: `xxxx xxxx xxxx xxxx xxxx xxxx`)

### 2. Update Script Configuration
Open `property-listing-automation.js` and update lines 14-15:
```javascript
const USERNAME = 'YOUR_WORDPRESS_USERNAME'; // Your WordPress username
const PASSWORD = 'YOUR_APPLICATION_PASSWORD'; // The application password you copied
```

### 3. Install Dependencies
No external dependencies required! Uses built-in Node.js modules.

## Usage Examples

### Create a Template File
```bash
node property-listing-automation.js --template
```
Creates `property-template.json` with all required fields.

### Interactive Mode (Single Property)
```bash
node property-listing-automation.js --interactive --draft
```
Walks you through creating a property step-by-step.

### Create from JSON File
```bash
node property-listing-automation.js --file=my-properties.json --draft
```

### Test Mode (Sample Property)
```bash
node property-listing-automation.js --test --draft
```

### Publish Immediately (No --draft flag)
```bash
node property-listing-automation.js --file=properties.json
```

## JSON File Format

### Single Property
```json
{
  "title": "4 Bedroom Terrace Duplex with BQ - Jahi, Abuja",
  "type": "Terrace Duplex",
  "location": "Jahi",
  "price": 350000000,
  "bedrooms": 4,
  "bathrooms": 4,
  "size": "500",
  "sizeUnit": "sqm",
  "status": "For Sale",
  "propertyId": "PROP-JAHI-001",
  "features": ["Guest Toilet", "Dining Area", "Balconies", "Fitted Kitchen"],
  "address": "Jahi District, Abuja, Nigeria"
}
```

### Multiple Properties (Array)
```json
[
  {
    "title": "Property 1",
    "type": "Terrace Duplex",
    "location": "Jahi",
    "price": 350000000,
    "bedrooms": 4,
    "bathrooms": 4
  },
  {
    "title": "Property 2",
    "type": "Apartment",
    "location": "Maitama",
    "price": 250000000,
    "bedrooms": 3,
    "bathrooms": 3
  }
]
```

## Property Field Reference

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | Yes | Property title | "4 Bedroom Terrace Duplex - Jahi" |
| `type` | Yes | Property type | "Terrace Duplex", "Apartment", "Land" |
| `location` | Yes | Abuja area | "Jahi", "Maitama", "Asokoro" |
| `price` | Yes | Price in Naira | 350000000 |
| `bedrooms` | No | Number of bedrooms | 4 |
| `bathrooms` | No | Number of bathrooms | 4 |
| `size` | No | Property size | "500" |
| `sizeUnit` | No | Size unit | "sqm", "hectares", "acres" |
| `status` | No | Listing status | "For Sale", "For Rent", "Sold" |
| `propertyId` | No | Unique ID | "PROP-JAHI-001" |
| `features` | No | Array of features | ["Security", "Pool", "Gym"] |
| `address` | No | Full address | "Jahi District, Abuja" |

## Available Property Types
- Terrace Duplex
- Apartment
- Semi Detached Duplex
- Detached Duplex
- Land
- Commercial Property
- Penthouse
- Block of Flats

## Available Abuja Locations
- Maitama, Asokoro, Wuse, Garki, Jabi, Utako, Life Camp
- Gwarinpa, Karsana, Katampe, Katampe Extension, Jahi
- Dawaki, Lokogoma, Apo, Mabushi, Kado, Wuye
- Gudu, Lugbe, Kubwa, Galadimawa, River Park, Guzape

## Common Features
- Security, Main Road, Utilities, Guest Toilet
- Dining Area, Balconies, Fitted Kitchen, Store
- En-suite, Wardrobe, Ample Parking, Green Area
- Swimming Pool, Gym, Generator, Water Supply
- 24/7 Power, CCTV, Gated Estate, Serviced

## Output Files

### 1. Property Listings Log
Created after each run: `property-listings-log-YYYY-MM-DDTHH-MM-SS.md`
- Lists all created properties with URLs
- Includes edit links for WordPress admin
- Records any errors

### 2. Batch File (when using --file)
Created for easy re-running: `create-property-listings.bat`
- One-click execution for the same JSON file

## Integration with Existing Workflow

### 1. Prepare Property Data
```bash
# Create template
node property-listing-automation.js --template

# Edit template with property details
# Save as specific file (e.g., jahi-properties.json)
```

### 2. Create Draft Listings
```bash
# Create drafts for review
node property-listing-automation.js --file=jahi-properties.json --draft
```

### 3. Review in WordPress
- Check drafts at airealent.ng/wp-admin/edit.php?post_status=draft
- Add images, finalize details
- Publish when ready

### 4. Batch Processing
```bash
# Process multiple properties at once
node property-listing-automation.js --file=all-properties.json --draft
```

## Time Savings Comparison

| Task | Manual (Browser) | Automated (Script) | Time Saved |
|------|------------------|-------------------|------------|
| Basic Info Entry | 2-3 minutes | < 1 second | 99% |
| Feature Selection | 3-5 minutes | < 1 second | 99% |
| Location Setting | 1-2 minutes | < 1 second | 99% |
| SEO Metadata | 1-2 minutes | < 1 second | 99% |
| **Total per Listing** | **7-12 minutes** | **< 5 seconds** | **99%** |
| **10 Listings** | **70-120 minutes** | **< 1 minute** | **99%** |

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check username and password in script
   - Verify application password is active
   - Ensure no spaces in the password string

2. **Property Type Not Found**
   - Use exact property type names from the list above
   - Check WordPress for existing property types

3. **Location Not Recognized**
   - Use exact location names from Abuja areas list
   - Location will be created if it doesn't exist

4. **API Rate Limiting**
   - Script includes 1-second delay between listings
   - For large batches, consider longer delays

### Debug Mode
Add console logging in the script:
```javascript
console.log('Debug:', { postData, result });
```

## Security Notes
- Never commit credentials to version control
- Store application passwords securely
- Use draft mode for testing
- Review listings before publishing

## Future Enhancements
- Image upload support
- Bulk image processing
- Google Sheets integration
- CSV import/export
- Scheduled publishing
- Price update automation

## Support
For issues or feature requests, contact the development team or refer to the script documentation.