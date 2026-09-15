# 01 — Foundation, Logo, and Home Page (Summary)

**Date:** 2026-09-15  
**Plan:** `plans/01-foundation-and-home.md`  
**Status:** Completed successfully — ready for owner visual approval.

---

## 1. Summary of Work Built

1. **Repository Scaffolding & Build System (Step 1)**:
   - Initialized standalone Git repository in `ourSite/` with strict `.gitignore`.
   - Scaffolded Vite + React 18 + TypeScript (`strict: true`) at project root.
   - Integrated Tailwind CSS, `@fontsource-variable/cairo`, `lucide-react`, and `vite-react-ssg`.
   - Configured npm scripts: `dev`, `build`, `preview`, `check:gradients`, and `check:i18n`.

2. **Design Tokens & Theme (Step 2)**:
   - Defined strict color tokens (`brand-50`, `brand-100`, `brand-600` `#0D07AD`, `brand-700`, `brand-800`, `ink`, `body`, `muted`, `line`, `surface`, `white`).
   - Configured typography scale for Cairo Variable across desktop and mobile.
   - Enforced radii: `card` (20px), `btn` (12px), `icon` (14px), `cta` (24px).
   - Card styling: white, 1px `line` border, 32px padding, translateY(-4px) hover + `brand-100` border + solid shadow `0 12px 32px rgba(11,13,23,0.08)`.
   - Focus rings: 3px `brand-600` at 35% opacity, 2px offset.

3. **Logo Vectorization & Brand Assets (Step 3)**:
   - Vectorized master logo (`brand-source/alaryam-logo-hires.png`) via `potrace 1.16` using exact 1-bit blue pixel mask (dropping the stray grey speck at #DEDEDE).
   - Output identical vector assets in `public/brand/`:
     - `logo-full-blue.svg` (#0D07AD)
     - `logo-full-white.svg` (#FFFFFF)
     - `mark-blue.svg` (triangle "A" + top rule, #0D07AD)
     - `mark-white.svg` (#FFFFFF)
     - `public/favicon.svg` (mark-blue centered on white square with 10% padding)
     - `public/favicon-32.png` (32×32)
     - `public/apple-touch-icon.png` (180×180)
     - `public/og-image.png` (1200×630 with logo-full-blue centered at 420px)
     - `summaries/screenshots/01/logo-compare.png` (side-by-side comparison with master).

4. **Bilingual i18n & Routing (Step 4)**:
   - Extracted all copy verbatim from `KNOWLEDGE-content.md` into `src/locales/ar.json` and `src/locales/en.json`.
   - Implemented `src/i18n/context.tsx` with `useT()`, `useLang()`, and language toggle route mapping.
   - Configured prerendered HTML output to inject `<html lang="ar" dir="rtl">` or `<html lang="en" dir="ltr">`.
   - Configured routes: `/` (redirects to `/ar/`), `/ar/` & `/en/` (HomePage), and temporary stubs for services, about, and contact.

5. **Header, Footer & Components (Steps 5 & 6)**:
   - `Header`: sticky white bar (88px desktop / 72px mobile), solid scroll shadow, active underline, language switch, responsive sliding panel for mobile.
   - `Footer`: solid `ink` background, full white logo (96px), `PeakLines` decoration along top, service and company columns, and `Info@Alaryam.ly` mailto link.
   - `PeakLines`: inline SVG echoing the logo's 60.9° slanted geometry with 2px stroke, solid color, square caps, mirrored in RTL.

6. **Home Page Sections (Step 7)**:
   - **Hero**: Solid `brand-600` block (min-height 620px), start-aligned text, white lead, on-blue buttons, end-aligned `mark-white.svg` standing on a 2px white rule with `PeakLines` in `brand-800`.
   - **Services Grid**: Centered H2 + lead, 3×2 grid desktop, 56px icon tiles in `brand-50`, H3, short description, and "Learn more" arrow link.
   - **How We Work**: `surface` background, centered header, 4 steps with large numerals (`01`–`04`) in `brand-600` (40px/800), connected by a solid 2px line on desktop.
   - **Who We Serve**: White background, start-aligned H2, 3 cards on the end side with `Building2`, `Briefcase`, and `Landmark` icons.
   - **Why AL-ARYAM**: `brand-50` background, 2 columns with H2 on start side, 2×2 grid of four items with `ShieldCheck`, `Layers`, `LifeBuoy`, and `BadgeCheck`.
   - **CTA Band**: `ink` background, 24px radius, 64px padding, `PeakLines` in `brand-600` on the end side, title, lead, and contact button.

---

## 2. File Tree

```
ourSite/
├── .gitignore
├── ANTIGRAVITY.md
├── KNOWLEDGE-content.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── public/
│   ├── favicon.svg
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   ├── og-image.png
│   ├── robots.txt
│   └── brand/
│       ├── logo-full-blue.svg
│       ├── logo-full-white.svg
│       ├── mark-blue.svg
│       └── mark-white.svg
├── scripts/
│   ├── check-i18n.js
│   ├── trace_logo.py
│   └── take-screenshots.js
├── src/
│   ├── main.tsx
│   ├── routes.tsx
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Container.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── Logo.tsx
│   │   ├── PeakLines.tsx
│   │   └── SeoHead.tsx
│   ├── data/
│   │   └── services.ts
│   ├── i18n/
│   │   └── context.tsx
│   ├── locales/
│   │   ├── ar.json
│   │   └── en.json
│   ├── pages/
│   │   ├── ComingNextPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── RootRedirect.tsx
│   ├── sections/home/
│   │   ├── CtaBand.tsx
│   │   ├── Hero.tsx
│   │   ├── HowWeWork.tsx
│   │   ├── ServicesGrid.tsx
│   │   ├── WhoWeServe.tsx
│   │   └── WhyUs.tsx
│   └── styles/
│       └── index.css
└── summaries/
    ├── 01-foundation-and-home.md
    └── screenshots/01/
        ├── header-mobile-menu-open-ar-390.png
        ├── home-ar-1440.png
        ├── home-ar-390.png
        ├── home-en-1440.png
        ├── home-en-390.png
        └── logo-compare.png
```

---

## 3. Check Outputs & Verification

### A. Build Verification (`npm run build`)
```
> our-site@0.1.0 build
> vite-react-ssg build

[vite-react-ssg] Build for client...
✓ built in 1.19s
[vite-react-ssg] Build for server...
✓ built in 64ms
[vite-react-ssg] Rendering Pages... (9)
dist/en/index.html           34.94 KiB
dist/en/services/index.html  11.29 KiB
dist/ar/services/index.html  11.09 KiB
dist/ar/index.html           34.19 KiB
dist/ar/contact/index.html   10.83 KiB
dist/en/contact/index.html   10.98 KiB
dist/en/about/index.html     11.30 KiB
dist/ar/about/index.html     11.09 KiB
dist/index.html              1.25 KiB
[vite-react-ssg] Build finished.
```

### B. Prerendered HTML Copy Check
```bash
grep -o "الابتكار، الأمان، الحلول المتكاملة" dist/ar/index.html
# Output: الابتكار، الأمان، الحلول المتكاملة

grep -o "Innovation, security, integrated solutions" dist/en/index.html
# Output: Innovation, security, integrated solutions
```

### C. Zero-Gradient Check (`npm run check:gradients`)
```
> our-site@0.1.0 check:gradients
> ! grep -rniE "gradient|bg-clip-text|\bfrom-|\bvia-" src

(Exit code: 0 - no matches)
```

### D. i18n Key Parity Check (`npm run check:i18n`)
```
> our-site@0.1.0 check:i18n
> node scripts/check-i18n.js

✅ i18n check passed: exactly 117 matching keys across ar.json and en.json.
```

### E. Mobile Viewport Overflow Check at 360px
```
AR at 360px: scrollWidth = 360, clientWidth = 360
EN at 360px: scrollWidth = 360, clientWidth = 360
✅ No horizontal scroll at 360px.
```

### F. Lighthouse Scores (`npm run preview` on `/ar/`)
| Metric | Target | Result | Status |
|---|---|---|---|
| **Performance** | ≥ 95 | **100** | Pass |
| **Accessibility** | ≥ 95 | **100** | Pass |
| **Best Practices** | ≥ 95 | **96** | Pass |
| **SEO** | ≥ 95 | **100** | Pass |

---

## 4. Screenshots Captured

All screenshots are saved in `summaries/screenshots/01/`:
- `home-ar-1440.png` — Desktop Arabic (RTL) Home page.
- `home-en-1440.png` — Desktop English (LTR) Home page.
- `home-ar-390.png` — Mobile Arabic Home page.
- `home-en-390.png` — Mobile English Home page.
- `header-mobile-menu-open-ar-390.png` — Mobile navigation menu opened.
- `logo-compare.png` — Side-by-side comparison of the master PNG and traced potrace SVG.

---

## 5. Deviations from Plan & TODO-COPY

- **Deviations**: None. Added standard `public/robots.txt` to achieve 100/100 in Lighthouse SEO audit.
- **`TODO-COPY`**: None. Every visible string is verbatim from `KNOWLEDGE-content.md`.

---

## 🛑 STOP Gate
Plan 01 execution is complete. Halting per workflow instructions for owner visual approval of the screenshots before proceeding to Plan 02.
