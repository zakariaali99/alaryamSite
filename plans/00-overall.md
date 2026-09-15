# 00 — Overall Roadmap

| # | Plan | Status |
|---|---|---|
| 01 | Foundation + logo SVGs + **Home page only** (AR + EN) | ▶️ **Run now** — then STOP for visual approval |
| 02 | Services, service detail, About, Contact (+ PHP endpoint), 404 | ⏳ Written after 01 is approved |
| 03 | SEO polish, `.htaccess`, production build, cPanel deploy package | ⏳ Written after 02 is approved |

## Owner decisions (2026-09-15)
- Logo: blue triangle + "AL-ARYAM — Technical partner" (`brand-source/alaryam-logo-cropped.png`). Primary blue `#0D07AD`.
- English name: **AL-ARYAM**. Arabic: **شركة الأريام**.
- Bilingual: Arabic (default, RTL) + English.
- Light theme only.
- Contact: **email only** — `Info@Alaryam.ly`. No phone, address, map, or social links.
- Hosting: **cPanel** (Apache + PHP). Domain `alaryam.ly` just renewed.
- Stack: Vite + React + TS + Tailwind + `vite-react-ssg` (see `ANTIGRAVITY.md`).

## Site map (final)
```
/                  → redirects to /ar/
/ar/  /en/                         Home
/ar/services/  /en/services/       Services overview
/ar/services/:slug/  (6 slugs)     Service detail
/ar/about/  /en/about/             About
/ar/contact/  /en/contact/         Contact (form → /api/contact.php)
404 (bilingual)
```

## Why the visual approval gate exists
A previous project lost three full rounds because a visual direction was applied to every page before the owner saw one. **Plan 01 builds one page. Nothing else gets styled until the owner approves the screenshots.**
