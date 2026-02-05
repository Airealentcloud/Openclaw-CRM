# SpyWizards Image Upload Workflow

## Method: WP-CLI via wp-wpcli-and-ops skill

### Step 1: Prepare Image URLs
Collect all image URLs to upload in a text file:
```
images.txt
---
https://example.com/image1.jpg
https://example.com/image2.jpg
https://example.com/image3.jpg
```

### Step 2: WP-CLI Command
```bash
wp media import <images.txt> --allow-root
```

Or upload single image:
```bash
wp media import https://example.com/image.jpg --title="Image Title" --porcelain
```

### Step 3: Attach Images to Posts
After upload, get attachment IDs and attach to posts:
```bash
wp post attach <attachment_id> --post_id=<post_id>
```

### Alternative: REST API
```bash
curl -X POST "https://spywizards.com/blog/wp-json/wp/v2/media" \
  -H "Authorization: Basic $(echo -n 'aiwisemind:APPPASSWORD' | base64)" \
  -H "Content-Type: image/jpeg" \
  --data-binary @image.jpg
```

## Current Status
- Browser tab open at SpyWizards WP Admin
- Need: List of image URLs to upload + target post IDs
