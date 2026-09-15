# 00 — Overall Roadmap

| # | Plan | Status |
|---|---|---|
| 01 | Foundation + logo SVGs + Home page (AR + EN) | ✅ Done (`d6a628d`) — `reviews/001` |
| 02 | ONE RUN: full site · side drawer · contact PHP · SEO · motion system · deploy package | ✅ Done (`389bc06`) — `reviews/002` |
| 03 | ONE RUN: fixes & polish (18 issues) | ✅ Done (`d369752`) — `reviews/003` |
| 04 | ONE RUN: final fixes — transitions, reveal safety, 404 head, real recordings | ✅ Done (`c531c06`) — `reviews/004` |
| 05 | **ONE RUN:** hero direction B (split blade) · light inner-page headers · visible GSAP blade page transition — all pages | ▶️ **Run now** |
| — | Deploy to cPanel (owner, manual — `DEPLOY.md` + `reviews/004` §3) | ⏳ After plan 05 review |

## Owner decisions
- **Logo:** blue triangle + "AL-ARYAM — Technical partner". Primary blue `#0D07AD`.
- **Names:** English **AL-ARYAM**; Arabic **شركة الأريام**.
- **Languages:** Arabic (default, RTL) + English.
- **Theme:** light only.
- **Contact:** email only — `Info@Alaryam.ly`.
- **Hosting:** cPanel (Apache + PHP).
- **Motion:** premium transitions, animated movement and effects.
- **Mobile nav:** side drawer (right in Arabic, left in English).
- **Delivery:** one-run plans.
- **Hero** (2026-09-15, after launch-ready review): full-blue hero rejected. **Direction B** instead: white page + blue panel cut at the logo's 61° angle + ink stripe. Inner pages get light headers with a slim blade slab.
- **Page transition:** must be clearly visible. A GSAP blade overlay (cover → mark → reveal, reading direction).

## Site map (final)
```
/                                  → 301 to /ar/
/ar/  /en/                         Home
/ar/services/  /en/services/       Services overview
/ar/services/:slug/  (6 slugs)     Service detail
/ar/about/  /en/about/             About
/ar/contact/  /en/contact/         Contact (form → /api/contact.php)
/404.html                          Bilingual 404 (noindex, no canonical)
/sitemap.xml  /robots.txt
```
