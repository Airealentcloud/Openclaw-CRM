# Memory

## User Profile
- Name: Israel
- Telegram: @Lordlords12
- Email: israelakhas@gmail.com

## Setup
- Platform: Windows (PC)
- OpenClaw version: 2026.1.29
- Model provider: OpenAI Codex (oauth, ChatGPT Plus)
- Primary model: openai-codex/gpt-5.2-codex
- Fallbacks: openai-codex/gpt-5.1-codex-max, openai-codex/kimi-k2-thinking
- Telegram bot: @easyeclawdbot
- Browser: Google Chrome (default)
- Brave Search API: configured in openclaw.json at tools.web.search.apiKey
- Gateway: local, port 18789

## Installed Skills
- coding-agent (ready)
- bluebubbles (ready)
- skill-creator (ready)
- nano-banana-pro (image gen via Gemini)
- clawdhub (skill marketplace)
- bird (X/Twitter CLI)
- session-logs (jq + rg)

## WordPress Sites

### spywizards.com (Separate Project - Not Related to airealent.ng)
- URL: https://spywizards.com/blog/wp-admin/
- Username: aiwisemind
- Role: Admin (test/backup site)
- Context: Completely separate from airealent.ng and the A.I Realent business

### airealent.ng (Main Business Site)
- Main real estate website for A.I Realent Global Resources Ltd.
- Focus: Abuja luxury properties, verified listings, AI-powered due diligence
- Related sites: housesforsaleinabuja.com, landforsaleinabuja.com

## Notes
- Google Antigravity auth plugin disabled (was returning "no longer supported" error)
- Switched from Google Antigravity to OpenAI Codex provider on 2026-01-31
- Browser control: ALWAYS use --browser-profile openclaw (direct CDP, port 18800). Do NOT use the "chrome" extension relay profile — it times out. The openclaw profile is set as default.
- WordPress admin is already logged in on the openclaw browser profile (tab open at https://spywizards.com/blog/wp-admin/)
- Spywizards WP admin: https://spywizards.com/blog/wp-admin/ | username: aiwisemind | REST API app password provided by user (not stored; request when needed)
- CRM GitHub repo: https://github.com/Airealentcloud/Openclaw-CRM.git
- Image Upload: wp-wpcli-and-ops skill enables bulk image imports via `wp media import` command
- CRM UI update requested: build a better, mobile‑friendly "mission control" dashboard; show clearer outreach status (pending vs email‑ready) and include TikTok/YouTube content sections.

## Business Context (2026-02-01)
- Israel Akhabue: Nigerian entrepreneur, CEO of A.I Realent Global Resources Ltd.
- Real estate marketing & brokerage in Abuja, Nigeria: sells residential/commercial properties; markets lands, apartments, duplexes, terraces, luxury homes; works with developers/estate owners/investors; helps local & diaspora buyers find verified properties; emphasizes FCDA-approved lands, genuine titles, due diligence.
- Key locations: Maitama, Asokoro, Katampe Extension, Jahi, Jabi, Utako, Wuse, Life Camp, Gwarinpa, Karsana, Dawaki, Lokogoma, Apo, nearby growth areas.
- Digital-first brand: property websites, SEO-driven content, social media (Instagram, TikTok, YouTube, Facebook), video tours, voiceovers, short-form content.
- Websites: airealent.ng, housesforsaleinabuja.com, landforsaleinabuja.com.
- Also runs 9jaDirectory (business directory & digital visibility platform): listings for Nigerian businesses, SEO/backlinks, press releases/mentions/media features; targets startups/SMEs/professionals; goals: traffic monetization, SEO authority building, business discovery, media/press distribution.
- Assistant preferences: clear, practical, business-focused; avoid hype/storytelling; support SEO/marketing/automation/monetization; prioritize Nigerian (Abuja) context; focus on ranking, conversions, credibility, scale; treat real estate as a company.

## SEO Diagnosis (2026-01-31)
- Google Search Console: 314 pages "Discovered - currently not indexed"
- robots.txt issues: Disallow /*?* blocks URL params; /tag/, /author/, /category/*/* blocked
- Polylang: creating thin translated pages (/af/, /de/, /fr/, /nl/, /pt/, /ru/) that waste crawl budget
- Many posts in "Uncategorized" category
- Rank Math SEO installed, sitemaps exist (last modified Dec 2025)
- Posts have correct meta robots (index, follow), canonical tags OK
- No fresh content since Dec 2025
