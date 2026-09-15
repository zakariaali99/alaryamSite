# Review 001 — Plan 01 (Foundation + Logo + Home)

> **Reviewer:** Claude (read-only: git log, source, `dist/`, screenshots, `summaries/01`)
> **Commit reviewed:** `d6a628d feat: foundation, logo SVGs, bilingual home page (plan 01)`
> **Verdict:** ✅ Strong foundation — logo trace, tokens, i18n and layout are correct. Approved as the base. Scope has now changed (owner update), and the fixes below are folded into **plan 02**.

---

## 1. What is good (keep it)

- **Logo trace is excellent.** `logo-compare.png` shows the traced SVG matching the master exactly, and the grey speck was dropped as intended. All variants, favicons and the OG image are present.
- **Tokens:** colors, radii, type scale and section rhythm match plan 01. Zero gradients (`check:gradients` is clean).
- **i18n:** 117 keys in each locale with matching sets. `lang`/`dir` are correct in the prerendered HTML for `/ar/` and `/en/about/`. The language switch maps to the same page.
- **Home layout** matches the plan in both languages at 1440 and 390: hero blue block, 3×2 services, 4 steps, who-we-serve, why-us, dark CTA band, ink footer. RTL mirroring is correct.
- Lighthouse 100/100/96/100. No horizontal scroll at 360px.

## 2. Issues found (all fixed in plan 02)

| # | Severity | Issue | Where |
|---|---|---|---|
| 1 | 🔴 | **Mobile menu drops down from the top.** The owner requires a **side drawer** (see `ANTIGRAVITY.md` rule 11). It is also mounted/unmounted with no animation, and focus is not trapped (only Esc is handled). *This came from plan 01's wording, not from your implementation.* | `src/components/Header.tsx` (mobile panel `absolute top-full`) |
| 2 | 🔴 | **`hreflang` alternates always point to the home pages** (`/ar/`, `/en/`) on every route. Each page must point to its own counterpart. | `src/components/SeoHead.tsx` |
| 3 | 🟠 | **Static `<title>` in `index.html`** (Arabic) is emitted in every page's HTML alongside the per-page title, so `/en/about/` ships an Arabic `<title>` first. Remove it from `index.html` and let `SeoHead` own the head. | `index.html` |
| 4 | 🟠 | **Reveal hides content in the prerendered HTML.** `.reveal-init` (opacity 0) is in the static markup, so if JS fails or is slow, whole sections stay invisible. Hidden initial states must only be applied when JS runs (see plan 02 §6.2). | `HomePage.tsx`, `index.css` |
| 5 | 🟠 | **Hardcoded hex in components:** `PeakLines color="#070470"` in `Hero.tsx` and `Footer.tsx`; hex in `index.css` card and focus styles. Use Tailwind tokens / CSS variables only. | `Hero.tsx`, `Footer.tsx`, `index.css` |
| 6 | 🟡 | **English copy starts lowercase** in Who we serve and Why AL-ARYAM ("systems and networks…", "every solution…"). Capitalize the first letter of every English `text`. | `src/locales/en.json` |
| 7 | 🟡 | **Scratch files committed:** `scripts/lighthouse-report.json`, `scripts/t1.svg`, `scripts/t2.svg`. Delete them and add `scripts/*.json` reports to `.gitignore`. | `scripts/` |
| 8 | 🟡 | **No `404.html` in `dist/`**, and `sitemap.xml` is referenced in `robots.txt` but does not exist. | build / `public/` |
| 9 | 🟡 | Cards and footer link to `/{lang}/services/{slug}/`, which does not exist yet (expected; built in plan 02). | — |
| 10 | 🟡 | The hero eyebrow pill uses `bg-white/10` on blue. This is acceptable (flat, no blur), but prefer the `brand-700` solid token for consistency. | `Hero.tsx` |

## 3. Scope change from the owner (2026-09-15)

1. **Build the rest of the site in ONE run** — all remaining pages, motion, contact endpoint, SEO and the deploy package. No intermediate stop.
2. **Premium motion everywhere** — transitions, animated movement and effects. This **replaces** plan 01's "calm motion only / no looping animation" rule. Full spec in plan 02 §6.
3. **Mobile nav = side drawer** from the start side (right in Arabic, left in English). Never a top dropdown.

## ➡️ Next for AG

Read the updated `ANTIGRAVITY.md`, then implement **`plans/02-full-site-motion-launch.md`** end to end in a single run. Fix every issue in §2 as part of it. Stop only at the end of plan 02.
