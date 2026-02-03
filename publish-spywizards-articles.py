#!/usr/bin/env python3
"""
SpyWizards Article Publisher via WordPress REST API
Publishes articles from markdown files to WordPress with Rank Math SEO metadata
"""

import requests
import base64
import os
import re
from pathlib import Path

# Configuration
SITE_URL = "https://spywizards.com/blog/wp-json"
USERNAME = "Aiwisemind"
PASSWORD = "IbGx RiYc qzoX swu5 nZtb mR37"

# Content folder
CONTENT_FOLDER = Path(__file__).parent / "spywizards-content"

# Authentication
auth = base64.b64encode(f"{USERNAME}:{PASSWORD}".encode()).decode()
headers = {
    "Authorization": f"Basic {auth}",
    "Content-Type": "application/json"
}

def extract_seo_frontmatter(content):
    """Extract SEO metadata from markdown frontmatter-style headers"""
    seo = {
        "title": "",
        "description": "",
        "focus_keyword": "",
        "categories": ["Cybersecurity", "Social Media Security"],
        "tags": []
    }
    
    # Look for title patterns
    title_match = re.search(r'^# (.+)$', content, re.MULTILINE)
    if title_match:
        seo["title"] = title_match.group(1).strip()
    
    # Look for focus keyword
    keyword_match = re.search(r'\*\*Focus Keyword[:\-]\*\*\s*(.+)', content)
    if keyword_match:
        seo["focus_keyword"] = keyword_match.group(1).strip()
    
    # Look for meta description pattern
    desc_match = re.search(r'\*\*Meta Description[:\-]\*\*\s*(.+)', content)
    if desc_match:
        seo["description"] = desc_match.group(1).strip()
    
    # Extract tags from last lines
    tags_match = re.search(r'Tags[:\-]\s*(.+)', content)
    if tags_match:
        seo["tags"] = [t.strip() for t in tags_match.group(1).split(',')]
    
    # Look for categories
    cat_match = re.search(r'Categories[:\-]\s*(.+)', content)
    if cat_match:
        seo["categories"] = [c.strip() for c in cat_match.group(1).split(',')]
    
    return seo

def convert_markdown_to_html(content):
    """Simple markdown to HTML conversion"""
    # Headers
    content = re.sub(r'^### (.+)$', r'<h3>\1</h3>', content, flags=re.MULTILINE)
    content = re.sub(r'^## (.+)$', r'<h2>\1</h2>', content, flags=re.MULTILINE)
    content = re.sub(r'^# (.+)$', r'<h1>\1</h1>', content, flags=re.MULTILINE)
    
    # Bold
    content = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', content)
    
    # Paragraphs (split by double newlines)
    paragraphs = content.split('\n\n')
    html_paragraphs = []
    for p in paragraphs:
        if p.strip() and not p.startswith('<h'):
            html_paragraphs.append(f"<p>{p.strip()}</p>")
        elif p.strip():
            html_paragraphs.append(p.strip())
    
    return '\n'.join(html_paragraphs)

def get_category_id(category_name):
    """Get WordPress category ID by name"""
    response = requests.get(
        f"{SITE_URL}/wp/v2/categories",
        headers=headers,
        params={"search": category_name}
    )
    if response.status_code == 200:
        categories = response.json()
        for cat in categories:
            if cat["name"].lower() == category_name.lower():
                return cat["id"]
    return None

def get_tag_id(tag_name):
    """Get WordPress tag ID by name"""
    response = requests.get(
        f"{SITE_URL}/wp/v2/tags",
        headers=headers,
        params={"search": tag_name}
    )
    if response.status_code == 200:
        tags = response.json()
        for tag in tags:
            if tag["name"].lower() == tag_name.lower():
                return tag["id"]
    return None

def create_category(category_name):
    """Create a new category and return its ID"""
    response = requests.post(
        f"{SITE_URL}/wp/v2/categories",
        headers=headers,
        json={"name": category_name}
    )
    if response.status_code == 201:
        return response.json()["id"]
    return None

def create_tag(tag_name):
    """Create a new tag and return its ID"""
    response = requests.post(
        f"{SITE_URL}/wp/v2/tags",
        headers=headers,
        json={"name": tag_name}
    )
    if response.status_code == 201:
        return response.json()["id"]
    return None

def publish_article(filepath):
    """Publish a single article to WordPress"""
    print(f"\n📄 Publishing: {filepath.name}")
    
    # Read markdown file
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract SEO metadata
    seo = extract_seo_frontmatter(content)
    
    # Convert to HTML (simple conversion)
    html_content = convert_markdown_to_html(content)
    
    # Create slug from filename
    slug = filepath.stem.lower().replace('_', '-')
    
    # Prepare post data
    post_data = {
        "title": seo["title"] or filepath.stem.replace('-', ' ').title(),
        "content": html_content,
        "slug": slug,
        "status": "publish"
    }
    
    # Create categories and tags
    category_ids = []
    for cat_name in seo["categories"]:
        cat_id = get_category_id(cat_name)
        if not cat_id:
            cat_id = create_category(cat_name)
        if cat_id:
            category_ids.append(cat_id)
    
    tag_ids = []
    for tag_name in seo["tags"]:
        tag_id = get_tag_id(tag_name)
        if not tag_id:
            tag_id = create_tag(tag_name)
        if tag_id:
            tag_ids.append(tag_id)
    
    if category_ids:
        post_data["categories"] = category_ids
    if tag_ids:
        post_data["tags"] = tag_ids
    
    # Add Rank Math SEO metadata (as custom fields via REST API or meta schema)
    # Note: Rank Math stores SEO data in post meta
    post_data["meta"] = {
        "rank_math_title": seo["title"],
        "rank_math_description": seo["description"],
        "rank_math_focus_keyword": seo["focus_keyword"]
    }
    
    # Publish post
    response = requests.post(
        f"{SITE_URL}/wp/v2/posts",
        headers=headers,
        json=post_data
    )
    
    if response.status_code == 201:
        post = response.json()
        print(f"✅ Published: {post['link']}")
        return {"success": True, "url": post['link'], "id": post['id']}
    else:
        print(f"❌ Failed: {response.status_code} - {response.text[:200]}")
        return {"success": False, "error": response.text}

def main():
    """Main function to publish all articles"""
    print("🚀 Starting SpyWizards Article Publisher")
    print(f"📁 Content folder: {CONTENT_FOLDER}")
    print(f"🌐 Site: {SITE_URL}")
    
    # Find all markdown files
    md_files = sorted(CONTENT_FOLDER.glob("*.md"))
    
    print(f"\n📊 Found {len(md_files)} articles to publish\n")
    
    results = []
    for md_file in md_files:
        result = publish_article(md_file)
        results.append(result)
    
    # Summary
    print("\n" + "="*50)
    print("📈 PUBLICATION SUMMARY")
    print("="*50)
    successful = sum(1 for r in results if r.get("success"))
    failed = len(results) - successful
    print(f"✅ Successful: {successful}")
    print(f"❌ Failed: {failed}")
    
    if successful > 0:
        print("\n🔗 Published URLs:")
        for r in results:
            if r.get("success"):
                print(f"  - {r['url']}")
    
    # Save log
    log_file = CONTENT_FOLDER.parent / "spywizards-posts-log.md"
    with open(log_file, 'w', encoding='utf-8') as f:
        f.write("# SpyWizards.com Posts Log\n\n")
        f.write(f"**Published:** {successful}\n")
        f.write(f"**Failed:** {failed}\n\n")
        f.write("## Published Posts\n\n")
        for r in results:
            if r.get("success"):
                f.write(f"- [{r['url']}]({r['url']}) - ID: {r['id']}\n")
    print(f"\n📝 Log saved to: {log_file}")

if __name__ == "__main__":
    main()
