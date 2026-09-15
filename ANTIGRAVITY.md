# AL-ARYAM Website — Guide for Antigravity (READ FIRST)

> # 🚨 NEVER LEAVE THIS FOLDER
> All work happens inside `/Users/zakaria/projects/Claude/Alaryam/ourSite/` only.
> - NEVER create symlinks to anything outside this folder.
> - NEVER read, write, or delete anything outside this folder. An older, abandoned attempt exists elsewhere on disk — **do not open it, copy from it, or reuse its design**.
> - NEVER delete files in `brand-source/`.
> - If you think you need something outside this folder, STOP and ask the owner.

This repository builds the official company website of **AL-ARYAM** (شركة الأريام لتقنية المعلومات), a Libyan IT & engineering solutions company, at **https://alaryam.ly**.

---

## 1) Document types — do not confuse them

| Type | Meaning | Location | Your action |
|---|---|---|---|
| **PLAN** | Work to implement | `plans/NN-*.md` | Implement **only the plan you are told to**, in order |
| **CONTENT** | All site copy (Arabic + English) | `KNOWLEDGE-content.md` | Use **verbatim**. Do not write your own marketing copy |
| **REVIEW** | Claude's review of your work | `reviews/NNN-*.md` | Read it, then go to the plan number it points to |
| **SUMMARY** | Your report after each plan | `summaries/NN-*.md` | **You write this** at the end of every plan |
| **BRAND SOURCE** | The approved logo | `brand-source/` (`alaryam-logo-hires.png` = 4272×3179 master, `alaryam-logo-cropped.png` = visual reference, `.emf`/`.svg` = originals) | Vectorize it per plan 01; never redraw or restyle it |

`plans/00-overall.md` is the roadmap. Only numbered plans are instructions to build.

## 2) Hard rules

1. **Brand is fixed.** The only logo is the blue triangle mark with "AL-ARYAM" and "Technical partner" underneath — reference image `brand-source/alaryam-logo-cropped.png` (source files `alaryam-logo.emf` / `alaryam-logo.svg` in the same folder). Primary blue is sampled from it: **`#0D07AD`**. Do not invent another logo, mark, palette, or accent color. Any other "A" or circuit-board logo you may have seen is **not** the brand.
2. **Company name in English is `AL-ARYAM`** (uppercase, hyphenated). In Arabic: **شركة الأريام**.
3. **ZERO gradients.** No `linear-gradient`, `radial-gradient`, `bg-gradient-*`, `from-*/via-*/to-*`, gradient text, or gradient SVG fills. Every color is a solid block. `grep -rniE "gradient|from-|via-|bg-clip-text" src` must return nothing.
4. **No glassmorphism, glow, neon, particles, 3D tilt, typing effects, confetti, or blurred decorative blobs.**
5. **No invented facts.** No statistics ("+50 clients"), client logos, testimonials, team members, past projects, certifications, addresses, or phone numbers. The only contact channel is **`Info@Alaryam.ly`**.
6. **No stock photos.** Decoration comes only from thin line-art derived from the logo's own geometry (slanted strokes at the triangle's angle + horizontal rules), in solid colors — see `PeakLines` in plan 01.
7. **Light theme only.** No dark mode, no theme toggle.
8. **Bilingual from day one.** Arabic (RTL, default) and English (LTR). Every visible string comes from the locale dictionaries — no hardcoded text in components.
9. **Static output.** The host is **cPanel shared hosting** (Apache + PHP, no Node runtime). The site must build to static files. The only server code allowed is the PHP contact endpoint defined in the plans.
10. **Stop at the end of each plan** for owner approval. Do not start the next plan on your own.

## 3) Tech stack (fixed)

- Vite + React 18 + TypeScript (strict)
- Tailwind CSS (tokens defined in `plans/01`; no arbitrary hex values in components)
- `vite-react-ssg` (react-router based) — every route prerendered to real HTML
- Font: **Cairo** self-hosted via `@fontsource-variable/cairo` (no Google Fonts CDN)
- Icons: `lucide-react`, stroke 1.75
- Motion: CSS only (a subtle fade/translate-in on scroll via IntersectionObserver). Respect `prefers-reduced-motion`.
- No UI kit (no Bootstrap, MUI, HeroUI). No jQuery.

## 4) How we work

1. Owner tells you which plan to run.
2. You implement it, then run: `npm run build` (must pass with zero TS errors) and the gradient grep.
3. You write `summaries/NN-<topic>.md`: what you did, files created or changed, commands run and their output, screenshots taken (paths), and anything you could not do.
4. You commit (`git`) with a clear message and **STOP**.
5. Claude reads your work and writes `reviews/NNN-*.md`, which tells you the next plan.

Screenshots go in `summaries/screenshots/NN/`.
