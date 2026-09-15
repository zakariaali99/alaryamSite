# 01 — Foundation + Logo + Home Page

> Read `ANTIGRAVITY.md` and `KNOWLEDGE-content.md` first.
> **Scope:** project setup, design tokens, bilingual routing, header/footer, logo SVGs, and the **Home page only**. Do NOT build Services/About/Contact pages in this plan.
> **Ends with STOP** — screenshots + summary, then wait for owner approval.

---

## Step 1 — Repository & scaffold

1. Inside `ourSite/`, run `git init` (this folder must be its own repository), then add a `.gitignore` for Node/Vite (`node_modules`, `dist`, `.DS_Store`).
2. Scaffold at the folder root (not a subfolder): Vite + React + TypeScript.
3. Install: `tailwindcss` (+ PostCSS setup), `vite-react-ssg`, `react-router-dom`, `@fontsource-variable/cairo`, `lucide-react`.
4. TypeScript `strict: true`. Add scripts: `dev`, `build` (SSG build → `dist/`), `preview`, `check:gradients`:
   ```json
   "check:gradients": "! grep -rniE \"gradient|bg-clip-text|\\bfrom-|\\bvia-\" src"
   ```
5. Structure:
   ```
   src/
     main.tsx            # vite-react-ssg entry
     routes.tsx
     locales/ ar.json en.json
     i18n/               # useT(), useLang(), localized path helpers
     components/         # Header, Footer, Logo, Button, Container, Section, PeakLines…
     sections/home/      # Hero, ServicesGrid, HowWeWork, WhoWeServe, WhyUs, CtaBand
     pages/              # HomePage.tsx (+ temporary stubs, see Step 4)
     data/services.ts
     styles/index.css
   public/
     brand/              # generated logo files (Step 3)
   ```

## Step 2 — Design tokens (Tailwind theme)

Use **only** these tokens. No arbitrary `[#hex]` values in components.

**Colors**
| Token | Hex | Use |
|---|---|---|
| `brand-50` | `#EFEEFB` | tinted section background |
| `brand-100` | `#DCDAF5` | subtle borders on tinted areas, icon tiles |
| `brand-600` | `#0D07AD` | **primary** — hero block, buttons, links, icons (sampled from the logo) |
| `brand-700` | `#0A0590` | button hover |
| `brand-800` | `#070470` | button active, line-art on blue blocks |
| `ink` | `#0B0D17` | headings, dark CTA band, footer |
| `body` | `#2A2E3B` | paragraph text |
| `muted` | `#5B6072` | secondary text |
| `line` | `#E3E5EC` | borders, dividers |
| `surface` | `#F6F7FA` | alternate section background |
| `white` | `#FFFFFF` | page background |

**Typography** — Cairo Variable for both languages. Scale:
| Role | Desktop | Mobile | Weight | Line-height |
|---|---|---|---|---|
| H1 (hero) | 56px | 36px | 800 | 1.2 |
| H2 (section) | 40px | 28px | 700 | 1.25 |
| H3 (card) | 22px | 20px | 700 | 1.35 |
| Lead | 20px | 18px | 400 | 1.8 |
| Body | 17px | 16px | 400 | 1.8 |
| Eyebrow | 14px | 13px | 700 | — (English: uppercase, tracking 0.08em; Arabic: no tracking) |

**Layout & shape**
- Container max-width **1200px**, side padding 24px (mobile 20px).
- Section vertical padding **112px** desktop / **72px** mobile.
- Card radius **20px**, button radius **12px**, icon tile radius **14px**.
- Buttons: height **52px**, horizontal padding 28px, 17px/700.
  - Primary: `brand-600` bg, white text.
  - Secondary: white bg, `ink` text, 1.5px `line` border.
  - On a blue block: white bg + `brand-600` text (primary), transparent + white 1.5px border (secondary).
- Cards: white, 1px `line` border, padding **32px**. Hover: translateY(-4px) + border `brand-100` + shadow `0 12px 32px rgba(11,13,23,0.08)`, 200ms.
- Icon tiles: 56px, `brand-50` bg, `brand-600` icon 26px.
- Focus ring: 3px `brand-600` at 35% opacity, offset 2px, on every interactive element.

## Step 3 — Logo (vectorize, do NOT redraw)

**The logo:** a blue triangle "A" (two slanted blades with an inner "M/V" notch) sitting on a horizontal rule, the word **AL-ARYAM** below it, a second rule, and **Technical partner** in spaced letters.
- **Master:** `brand-source/alaryam-logo-hires.png` (4272×3179, blue on transparent).
- **Visual reference:** `brand-source/alaryam-logo-cropped.png`.
- `potrace` is installed at `/opt/local/bin/potrace`.

1. From the master, build a 1-bit mask where **blue pixels = 1** (for example, alpha > 128 AND blue channel dominant). This drops a tiny grey stray speck near the second "A" — that is intended. Crop to the mask's bounding box plus 2% padding. Save as PBM and run `potrace -s --turdsize 20 --alphamax 1.0 --opttolerance 0.2`.
2. Produce these files (same traced geometry, only the fill color changes):
   | File | Content |
   |---|---|
   | `public/brand/logo-full-blue.svg` | whole logo, fill `#0D07AD`, transparent |
   | `public/brand/logo-full-white.svg` | whole logo, fill `#FFFFFF`, transparent |
   | `public/brand/mark-blue.svg` | **triangle "A" only** (everything above the top horizontal rule, including the rule) — fill `#0D07AD` |
   | `public/brand/mark-white.svg` | same triangle-only crop, fill `#FFFFFF` |
   | `public/favicon.svg` | `mark-blue` centered on a white square with 10% padding |
   | `public/favicon-32.png`, `public/apple-touch-icon.png` (180px) | rendered from `favicon.svg` |
   | `public/og-image.png` | 1200×630, white background, `logo-full-blue` centered at ~420px wide |
   Get the triangle-only crop by cropping the **traced SVG's viewBox** (or by cropping the mask before tracing). Never redraw it by hand.
3. Compare each SVG to the master at the same size and save a side-by-side as `summaries/screenshots/01/logo-compare.png`. Edges must be smooth and straight lines straight. The letterforms of "AL-ARYAM" and "Technical partner" must match exactly — nothing missing, nothing added.
4. `Logo` component:
   - `variant="full"` → `logo-full-blue.svg` (or `-white` on dark backgrounds).
   - `variant="mark"` → `mark-*`.
   - Always `alt` = `company.fullName`. Always links to the home page of the current language.
   - **Never** place Cairo text next to the logo as a fake wordmark. The logo already contains the name.

## Step 4 — Bilingual routing & i18n

1. Routes: `/ar/` and `/en/` → HomePage. Also add `/ar/services/`, `/ar/about/`, `/ar/contact/` (and their `/en/` versions) pointing to a **temporary** `ComingNextPage` that shows only the page title inside the normal layout. These stubs are replaced in plan 02. Do not style them beyond the layout.
2. `/` must output a static page that redirects to `/ar/` (meta refresh + JS `location.replace`). Plan 03 adds the Apache 301.
3. The `<html>` element must have `lang="ar" dir="rtl"` or `lang="en" dir="ltr"` **in the prerendered HTML** (not only after hydration).
4. `useT()` reads from `ar.json` / `en.json`. Put all Home/Global/Service strings from `KNOWLEDGE-content.md` into the JSON now (plan 02 will reuse the service data). Keep keys identical across both files and add a tiny script `npm run check:i18n` that fails if the key sets differ.
5. Services data lives in `src/data/services.ts`: slug + lucide icon name. Text comes from the locale file.
   Icons: software-development → `Code2` · technical-support → `Headset` · security-surveillance → `Cctv` · networks-infrastructure → `Network` · project-management → `Workflow` · iot → `Cpu`.
6. Language switch: links to the **same page** in the other language (`/ar/x/` ↔ `/en/x/`).
7. Use logical CSS properties (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`, `text-start`) everywhere so RTL and LTR both work without duplicated styles. Mirror directional icons (arrows) in RTL.
8. Per-page `<title>`, meta description, canonical, `og:image` (`/og-image.png`), and `hreflang` alternates (`ar`, `en`, `x-default` → ar) in the prerendered head.

## Step 5 — Header & footer

**Header** (sticky, white, bottom border `line`, height **88px** desktop / 72px mobile; when scrolled, add a subtle solid shadow — no blur):
- Start side: `Logo variant="full"` blue, **height 60px** desktop / 48px mobile (the logo is ~1.24:1, so it stays compact).
- Center/end: nav links (Home, Services, About, Contact) — 16px/600, `body`; the active link is `brand-600` with a 2px underline.
- End: language switch (text link) + primary button `cta.contact` (height 44px in header).
- Below 1024px: hamburger → full-width solid white panel sliding down, links stacked at 20px, with the button at the bottom. Trap focus, close on Esc and on route change.

**Footer** (`ink` background, white text):
- Row 1: `Logo variant="full"` **white**, height 96px + `footer.blurb` · a services list (6 links) · a company column (About, Contact) · the email `Info@Alaryam.ly` as a `mailto:` link with the `Mail` icon.
- A thin `PeakLines` decoration (Step 6) along the top of the footer in `brand-800`.
- Bottom row: `footer.rights` with the current year, `company.tagline`.

## Step 6 — `PeakLines` decoration

A reusable inline-SVG component that echoes the logo's **own geometry**: the two slanted blades of the triangle and its horizontal rules.
- 3–5 thin parallel strokes running at the **same angle as the logo's outer triangle edges** (measure it from the traced SVG, ~60°), meeting a horizontal baseline, like the logo's triangle standing on its rule.
- Stroke width 2, square caps, solid color passed as a prop, no fills.
- **No gradients, no glow, no looping animation.**
- Mirror horizontally in RTL. `aria-hidden="true"`.
- Keep it quiet: it is texture, not a second logo. Never draw a full triangle "A" with it.

## Step 7 — Home page sections (in this order)

Copy: `KNOWLEDGE-content.md` → Home. Every section uses `Container`.

1. **Hero** — a full-width **solid `brand-600` block** (below the white header), min-height ~620px desktop.
   - Two columns on desktop (text on the start side, visual on the end side); stacked on mobile with text first.
   - Text: eyebrow (white), H1 white, lead white, and two buttons (the on-blue variants).
   - Visual: `mark-white.svg` (triangle only) at ~360px wide, standing on a white 2px horizontal rule that runs to the page edge, with `PeakLines` in `brand-800` behind it. No photos.
   - The hero bottom edge is a straight line (no waves or curves).
2. **Services grid** — white background. Section header centered: H2 + lead (max-width 720px). Grid 3×2 desktop, 2 columns tablet, 1 column mobile, gap 24px. Each card: icon tile → H3 title → `short` → "Learn more" link with an arrow, linking to `/{lang}/services/{slug}/`. The whole card is clickable (one link, no nested links).
3. **How we work** — `surface` background. H2 + lead. Four steps in a row on desktop, 2×2 on tablet, a vertical list on mobile. Each step: a large number (`01`…`04`, 40px/800, `brand-600`) + H3 + text. Steps connected by a thin 2px `line` connector on desktop (a solid line, not dashed).
4. **Who we serve** — white background. H2 on the start side, three cards (title + text) in a row with `Building2`, `Briefcase`, and `Landmark` icons.
5. **Why AL-ARYAM** — `brand-50` background. Two columns: H2 on the start side (sticky on desktop is fine), and a 2×2 grid of the four items on the end side (icons: `ShieldCheck`, `Layers`, `LifeBuoy`, `BadgeCheck`).
6. **CTA band** — `ink` background, white text, radius 24px, inset within the container with 64px padding, `PeakLines` in `brand-600` on the end side. Title + lead + primary button → `/{lang}/contact/`.

Scroll reveal: each section's content fades in with a 16px translate, 500ms, once. Disable for `prefers-reduced-motion`.

## Step 8 — Quality checks (all must pass)

- `npm run build` — zero errors. `dist/ar/index.html` and `dist/en/index.html` contain the **full Home copy as real HTML** (verify with grep and paste the output in your summary).
- `npm run check:gradients` — no output.
- `npm run check:i18n` — passes.
- Only `/`, `/ar/*`, and `/en/*` routes exist.
- Keyboard: tab through the header, the mobile menu, and every card — focus is always visible.
- No horizontal scroll at 360px.
- Lighthouse (desktop, `npm run preview`) on `/ar/`: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. Paste the scores.
- Text contrast ≥ 4.5:1 everywhere.

## Step 9 — Screenshots, summary, STOP

Save full-page screenshots to `summaries/screenshots/01/`:
- `home-ar-1440.png`, `home-en-1440.png`
- `home-ar-390.png`, `home-en-390.png`
- `header-mobile-menu-open-ar-390.png`
- `logo-compare.png`

Write `summaries/01-foundation-and-home.md` covering: what was built · the file tree · all check outputs and Lighthouse scores · deviations from this plan and why · any `TODO-COPY`.

Commit: `feat: foundation, logo SVGs, bilingual home page (plan 01)`.

## 🛑 STOP

Do not start plan 02. Do not style any other page. Wait for the owner's approval of the screenshots.
