# PathwayPIS 301 Redirects - Implementation Guide (Option C)

## Method: Redirection Plugin (User-Friendly)

### Step 1: Install Plugin
1. Log into WordPress Admin: https://pathwaypis.com/wp-admin/
2. Go to **Plugins → Add New**
3. Search for **"Redirection"** by John Godley
4. Click **Install Now** → **Activate**

### Step 2: Add Redirects
1. Go to **Tools → Redirection**
2. Click **Add New** button
3. Add each redirect below (one at a time):

---

**Redirect 1:**
- Source URL: `/how-to-hire-a-private-investigator-12-step-checklist-2026/`
- Target URL: `https://pathwaypis.com/how-to-hire-a-private-investigator-12-step-checklist-for-2026/`
- HTTP Code: **301 (Moved Permanently)**
- Group: Leave default or create "SEO Fixes"
- Click **Add Redirect**

---

**Redirect 2:**
- Source URL: `/private-investigator-cost-guide-what-drives-price-in-2026/`
- Target URL: `https://pathwaypis.com/private-investigator-cost-2026-complete-pricing-guide-what-drives-price/`
- HTTP Code: **301 (Moved Permanently)**
- Group: Leave default or create "SEO Fixes"
- Click **Add Redirect**

---

**Redirect 3:**
- Source URL: `/is-it-legal-to-hire-a-private-investigator-complete-2026-guide/`
- Target URL: `https://pathwaypis.com/private-investigator-legal-complete-2026-guide-to-laws-licensing-legal-boundaries/`
- HTTP Code: **301 (Moved Permanently)**
- Group: Leave default or create "SEO Fixes"
- Click **Add Redirect**

---

### Step 3: Test Redirects
After adding all 3, test by visiting:
1. https://pathwaypis.com/how-to-hire-a-private-investigator-12-step-checklist-2026/
   → Should redirect to the "-for-2026" version

2. https://pathwaypis.com/private-investigator-cost-guide-what-drives-price-in-2026/
   → Should redirect to the "complete-pricing-guide" version

3. https://pathwaypis.com/is-it-legal-to-hire-a-private-investigator-complete-2026-guide/
   → Should redirect to the "legal-complete-2026-guide" version

### Step 4: Monitor
- In Redirection plugin, check **404s** tab for any issues
- Check **Redirects** tab to see hit counts (verifies they're working)
- Google Search Console will pick up the changes in 24-48 hours

---

## Summary Table

| # | Old URL (Will Redirect) | New URL (Destination) | Status |
|---|-------------------------|----------------------|--------|
| 1 | /how-to-hire-a-private-investigator-12-step-checklist-2026/ | /how-to-hire-a-private-investigator-12-step-checklist-for-2026/ | ⏳ Pending |
| 2 | /private-investigator-cost-guide-what-drives-price-in-2026/ | /private-investigator-cost-2026-complete-pricing-guide-what-drives-price/ | ⏳ Pending |
| 3 | /is-it-legal-to-hire-a-private-investigator-complete-2026-guide/ | /private-investigator-legal-complete-2026-guide-to-laws-licensing-legal-boundaries/ | ⏳ Pending |

---

## Expected Impact
- ✅ Fixes duplicate content issues
- ✅ Consolidates SEO authority to canonical URLs
- ✅ Improves Google indexing
- ✅ Better user experience (no dead/confusing pages)

---

**Ready to implement?** The whole process takes about 5 minutes once you're in WordPress admin.
