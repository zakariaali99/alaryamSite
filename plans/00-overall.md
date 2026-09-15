# 00 — Overall Roadmap

| # | Plan | Status |
|---|---|---|
| 01 | Foundation + logo SVGs + Home page (AR + EN) | ✅ Done (`d6a628d`) — `reviews/001` |
| 02 | ONE RUN: full site · side drawer · contact PHP · SEO · motion system · deploy package | ✅ Done (`389bc06`) — `reviews/002` |
| 03 | ONE RUN: fixes & polish (18 issues) | ✅ Done (`d369752`) — `reviews/003`: 14/18 verified, transitions still broken |
| 04 | **ONE RUN:** final fixes — real `viewTransition` prop + browser proof, reveal safety + valid screenshots, 404 head, real video recordings | ▶️ **Run now** |

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
