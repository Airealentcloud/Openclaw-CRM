# PathwayPIS Plugin Installation Guide

## ✅ PLUGINS ALREADY INSTALLED

The following plugins have been successfully installed and activated:

| Plugin | Status | Purpose |
|--------|--------|---------|
| **Redirection** | ✅ Active | 301 redirects for duplicate content |
| **Better Search Replace** | ✅ Active | Bulk internal link updates |
| **Wordfence Security** | ✅ Active | Website security & firewall |

---

## 📋 MANUAL INSTALLATION REQUIRED

The WordPress REST API is blocking further plugin installations. Please install these manually:

### 1. Rank Math SEO (FREE)
**Likely already installed** - just needs activation check

**To verify:**
1. Log in to https://pathwaypis.com/wp-admin/
2. Go to Plugins → Installed Plugins
3. Look for "Rank Math SEO" or "SEO by Rank Math"
4. If installed but inactive, click "Activate"
5. If not installed:
   - Plugins → Add New
   - Search: "Rank Math SEO"
   - Install Now → Activate

**Configuration:**
- Run the Setup Wizard
- Connect to Rank Math account (optional)
- Enable Schema Markup
- Enable XML Sitemaps

---

### 2. WPForms Lite (FREE)
**Purpose:** Contact forms for consultation requests

**Installation:**
1. Plugins → Add New
2. Search: "WPForms"
3. Install "WPForms Lite" (by WPForms)
4. Activate

**Create Contact Form:**
1. WPForms → Add New
2. Select "Simple Contact Form" template
3. Add fields:
   - Name
   - Email
   - Phone
   - Case Type (dropdown)
   - Message
   - File Upload (optional)
4. Configure notifications
5. Add to Contact page using shortcode

---

### 3. LiteSpeed Cache (FREE)
**Purpose:** Performance optimization

**Installation:**
1. Plugins → Add New
2. Search: "LiteSpeed Cache"
3. Install → Activate

**Basic Configuration:**
1. LiteSpeed Cache → Cache → Enable
2. Image Optimization → Request Key
3. Page Optimization:
   - CSS Minify: ON
   - JS Minify: ON
   - HTML Minify: ON
4. Database → Clean All

---

### 4. Smush (FREE)
**Purpose:** Image optimization

**Installation:**
1. Plugins → Add New
2. Search: "Smush"
3. Install "Smush – Compress, Optimize and Lazy Load Images"
4. Activate

**Configuration:**
1. Run Bulk Smush
2. Enable Lazy Load
3. Enable WebP conversion
4. Set max width: 1920px

---

### 5. Broken Link Checker (FREE)
**Purpose:** Monitor for broken links

**Installation:**
1. Plugins → Add New
2. Search: "Broken Link Checker"
3. Install → Activate

**Configuration:**
1. Settings → Link Checker
2. Check intervals: Weekly
3. Email notifications: ON
4. Check external links: ON

---

### 6. MonsterInsights (FREE)
**Purpose:** Google Analytics integration

**Installation:**
1. Plugins → Add New
2. Search: "MonsterInsights"
3. Install "Google Analytics for WordPress by MonsterInsights"
4. Activate

**Configuration:**
1. Launch Setup Wizard
2. Connect Google Analytics account
3. Enable enhanced e-commerce (if applicable)
4. Enable form tracking

---

## 🔧 IMMEDIATE ACTIONS AFTER INSTALLATION

### Step 1: Configure Redirection Plugin

1. Tools → Redirection
2. Add the 3 redirects for duplicate content:

```
Source URL: /how-to-hire-a-private-investigator-practical-checklist/
Target URL: /how-to-hire-a-private-investigator-12-step-checklist-2026/
Type: 301 Permanent

Source URL: /legal-private-investigator-guide-2026/
Target URL: /private-investigator-legal-complete-2026-guide-to-laws-licensing-legal-boundaries/
Type: 301 Permanent

Source URL: /private-investigator-near-me-how-to-choose/
Target URL: /how-to-find-a-private-investigator-near-me-2026-guide/
Type: 301 Permanent
```

### Step 2: Run Better Search Replace

1. Tools → Better Search Replace
2. Run these replacements:

**Search:** `https://pathwaypis.com/legal-private-investigator-guide-2026/`
**Replace:** `https://pathwaypis.com/private-investigator-legal-complete-2026-guide-to-laws-licensing-legal-boundaries/`
**Tables:** wp_posts (check only this table)

**Search:** `https://pathwaypis.com/how-to-hire-a-private-investigator-practical-checklist/`
**Replace:** `https://pathwaypis.com/how-to-hire-a-private-investigator-12-step-checklist-2026/`

**Search:** `https://pathwaypis.com/private-investigator-near-me-how-to-choose/`
**Replace:** `https://pathwaypis.com/how-to-find-a-private-investigator-near-me-2026-guide/`

⚠️ **IMPORTANT:** Run as "Dry Run" first to preview changes!

### Step 3: Configure Rank Math SEO

1. Rank Math → Dashboard
2. Run Setup Wizard
3. Enable modules:
   - ✅ Titles & Meta
   - ✅ Sitemap
   - ✅ Schema (Structured Data)
   - ✅ 404 Monitor
   - ✅ Redirections
   - ✅ Link Counter

4. Add canonical tag to post 1173:
   - Posts → Edit "Private Investigator Cost Guide: What Drives Price"
   - Rank Math meta box → Advanced
   - Canonical URL: `https://pathwaypis.com/private-investigator-cost-guide-2026-pricing/`

### Step 4: Run Wordfence Security Scan

1. Wordfence → Scan
2. Click "Start New Scan"
3. Review any issues found
4. Enable firewall (follow prompts)

---

## 📊 PLUGIN PRIORITY MATRIX

### Install Today (Essential):
1. ✅ Redirection (DONE)
2. ✅ Better Search Replace (DONE)
3. ✅ Wordfence (DONE)
4. ⏳ Rank Math (verify/activate)
5. ⏳ WPForms (install)

### Install This Week (Important):
6. ⏳ LiteSpeed Cache
7. ⏳ Smush
8. ⏳ Broken Link Checker

### Install Soon (Nice to Have):
9. ⏳ MonsterInsights
10. ⏳ Internal Link Juicer

---

## 💰 COST SUMMARY

| Plugin | Cost | Status |
|--------|------|--------|
| Redirection | FREE | ✅ Installed |
| Better Search Replace | FREE | ✅ Installed |
| Wordfence | FREE | ✅ Installed |
| Rank Math | FREE | ⏳ Verify |
| WPForms Lite | FREE | ⏳ Install |
| LiteSpeed Cache | FREE | ⏳ Install |
| Smush | FREE | ⏳ Install |
| Broken Link Checker | FREE | ⏳ Install |
| MonsterInsights | FREE | ⏳ Install |
| **TOTAL** | **$0** | 3/9 Done |

---

## 🎯 NEXT STEPS

1. ✅ Log in to WordPress admin
2. ✅ Verify Rank Math is active
3. ⏳ Install WPForms Lite
4. ⏳ Configure Redirection plugin (add 3 redirects)
5. ⏳ Run Better Search Replace (update internal links)
6. ⏳ Add canonical tag to post 1173
7. ⏳ Run Wordfence scan
8. ⏳ Install remaining plugins

---

*Document created: 2026-03-19*
*Plugins installed via API: 3/9*
*Manual installation required: 6/9*
