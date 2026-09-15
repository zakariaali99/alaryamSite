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
| **REVIEW** | Claude's review of your work | `reviews/NNN-*.md` | Read it, fix what it lists, then go to the plan number it points to |
| **SUMMARY** | Your report after each plan | `summaries/NN-*.md` | **You write this** at the end of every plan |
| **BRAND SOURCE** | The approved logo | `brand-source/` (`alaryam-logo-hires.png` = 4272×3179 master, `alaryam-logo-cropped.png` = visual reference, `.emf`/`.svg` = originals) | Already vectorized into `public/brand/`. Never redraw or restyle it |

`plans/00-overall.md` is the roadmap. Only numbered plans are instructions to build.

## 2) Hard rules

1. **Brand is fixed.** The only logo is the blue triangle mark with "AL-ARYAM" and "Technical partner" underneath (vectorized in `public/brand/`). Primary blue: **`#0D07AD`**. Do not invent another logo, mark, palette, or accent color. Any other "A" or circuit-board logo you may have seen is **not** the brand.
2. **Company name in English is `AL-ARYAM`** (uppercase, hyphenated). In Arabic: **شركة الأريام**.
3. **ZERO gradients.** No `linear-gradient`, `radial-gradient`, `conic-gradient`, `bg-gradient-*`, `from-*/via-*/to-*`, gradient text, or gradient SVG fills. Every color is a solid block. `npm run check:gradients` must be clean.
4. **Motion is required and must be premium** — transitions, animated movement and effects on every page, following the motion system in plan 02 §6 (GSAP + ScrollTrigger + SplitText + DrawSVG + Lenis). **Page transitions use the GSAP blade overlay from plan 05 §3 — not the View Transitions API.** Hero layout follows plan 05 (direction B: white page + blue panel cut at the logo's 61° blade angle; light inner-page headers). **Still banned:** glassmorphism/backdrop blur, glow or neon, particles, confetti, typewriter effects, WebGL scenes, custom cursors, preloaders that hide the page.
5. **Motion must be safe:** content is fully visible without JS; everything is disabled under `prefers-reduced-motion`; touch devices get a lighter set (no tilt, magnetic, or smooth scroll); animate only transform, opacity, clip-path and SVG strokes.
6. **Arabic text is animated by WORDS only — never split Arabic into characters** (it breaks letter joining).
7. **No invented facts.** No statistics ("+50 clients"), client logos, testimonials, team members, past projects, certifications, addresses, phone numbers, or social links. The only contact channel is **`Info@Alaryam.ly`**.
8. **No stock photos.** Decoration comes only from thin line-art derived from the logo's own geometry (slanted strokes at the triangle's angle + horizontal rules), in solid colors — the `PeakLines` component.
9. **Light theme only.** No dark mode, no theme toggle.
10. **Bilingual.** Arabic (RTL, default) and English (LTR). Every visible string comes from the locale dictionaries — no hardcoded text in components. No hex colors in components — tokens only.
11. **📱 Mobile navigation is a SIDE DRAWER.** Below 1024px, the menu slides in horizontally from the **inline-start edge** — the **RIGHT** edge in Arabic, the **LEFT** edge in English — at full viewport height, with a dim backdrop. **It must NEVER drop down or slide from the top.** Spec: plan 02 §2.
12. **Static output for cPanel.** The host is cPanel shared hosting (Apache + PHP, no Node runtime). The site builds to static files. The only server code is `public/api/contact.php`.
13. **Stop at the end of each plan** for owner review. A plan marked **ONE RUN** is done entirely in one go, without stopping between its sections.

## 3) Tech stack (fixed)

- Vite + React 18 + TypeScript (strict) — **do not upgrade React**
- react-router-dom 6.30 (use its `viewTransition` prop)
- Tailwind CSS (tokens in `tailwind.config.ts` + generated CSS variables; no arbitrary hex in components)
- `vite-react-ssg` — every route prerendered to real HTML
- Font: **Cairo** self-hosted via `@fontsource-variable/cairo`
- Icons: `lucide-react`, stroke 1.75
- Motion: `gsap` (ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase — all free) + `@gsap/react` + `lenis`
- No UI kit (no Bootstrap, MUI, HeroUI). No jQuery. No Framer Motion (GSAP only, to avoid two engines).

## 4) How we work

1. Owner tells you which plan to run.
2. You implement it, then run every check the plan lists (build, gradients, i18n, hex, links, Lighthouse…).
3. You write `summaries/NN-<topic>.md`: what you did, files created or changed, commands run and their outputs, screenshots/recordings (paths), deviations, and anything you could not do.
4. You commit (`git`) with clear messages and **STOP**.
5. Claude reads your work and writes `reviews/NNN-*.md`, which tells you what to do next.

Screenshots and recordings go in `summaries/screenshots/NN/`.
