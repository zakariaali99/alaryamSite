# 00 — Overall Roadmap

| # | Plan | Status |
|---|---|---|
| 01 | Foundation + logo SVGs + Home page (AR + EN) | ✅ Done (`d6a628d`) — `reviews/001` |
| 02 | ONE RUN: full site · side drawer · contact PHP · SEO · motion system · deploy package | ✅ Done (`389bc06`) — `reviews/002`: not launch-ready yet |
| 03 | **ONE RUN:** fix all review-002 issues — page transitions, motion-ready flag, undefined classes/buttons, contact success + i18n, PHP hardening, 404 noindex, emoji, Lighthouse, About copy, polish, recordings | ▶️ **Run now** |

## Owner decisions
- **2026-09-15 (initial):**
  - Logo: blue triangle + "AL-ARYAM — Technical partner" (`public/brand/`). Primary blue `#0D07AD`.
  - English name **AL-ARYAM**; Arabic **شركة الأريام**.
  - Bilingual: Arabic (default, RTL) + English.
  - Light theme only.
  - Contact: **email only** — `Info@Alaryam.ly`.
  - Hosting: **cPanel** (Apache + PHP).
- **2026-09-15 (update):**
  - Premium transitions, animated movement and effects across the site.
  - Mobile nav = side drawer (right in Arabic, left in English).
  - Work is delivered in one-run plans.

## Site map (final)
```
/                                  → 301 to /ar/
/ar/  /en/                         Home
/ar/services/  /en/services/       Services overview
/ar/services/:slug/  (6 slugs)     Service detail
/ar/about/  /en/about/             About
/ar/contact/  /en/contact/         Contact (form → /api/contact.php)
/404.html                          Bilingual 404 (noindex)
/sitemap.xml  /robots.txt
```
