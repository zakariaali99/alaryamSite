# 00 — Overall Roadmap

| # | Plan | Status |
|---|---|---|
| 01 | Foundation + logo SVGs + Home page (AR + EN) | ✅ Done (`d6a628d`) — reviewed in `reviews/001` |
| 02 | **ONE RUN:** review fixes · mobile side drawer · Services, 6 service pages, About, Contact (+ PHP), 404 · SEO · **full motion system** · `.htaccess` + deploy package | ▶️ **Run now** — stop only at the end |

## Owner decisions
- **2026-09-15 (initial):**
  - Logo: blue triangle + "AL-ARYAM — Technical partner" (`public/brand/`). Primary blue `#0D07AD`.
  - English name **AL-ARYAM**; Arabic **شركة الأريام**.
  - Bilingual: Arabic (default, RTL) + English.
  - Light theme only.
  - Contact: **email only** — `Info@Alaryam.ly`. No phone, address, map, or social links.
  - Hosting: **cPanel** (Apache + PHP). Domain `alaryam.ly` just renewed.
- **2026-09-15 (update):**
  - **Premium transitions, animated movement and effects** across the whole site.
  - **Mobile nav = side drawer** (right in Arabic, left in English) — never a top dropdown.
  - **Finish the rest of the site in one run.**

## Site map (final)
```
/                                  → 301 to /ar/
/ar/  /en/                         Home
/ar/services/  /en/services/       Services overview
/ar/services/:slug/  (6 slugs)     Service detail
/ar/about/  /en/about/             About
/ar/contact/  /en/contact/         Contact (form → /api/contact.php)
/404.html                          Bilingual 404
/sitemap.xml  /robots.txt
```

Service slugs: `software-development`, `technical-support`, `security-surveillance`, `networks-infrastructure`, `project-management`, `iot`.
