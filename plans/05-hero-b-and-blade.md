# 05 — Hero "B" (Split Blade) + Light Inner Headers + Visible Blade Transition (ONE RUN)

> **Owner decision (2026-09-15):** the full-blue hero is too loud. Adopt **direction B**: white page, blue panel cut at the logo's blade angle. Inner pages get a **light header**. Make the page-transition blade **clearly visible**. Apply to **all pages in one run**.
> Read `ANTIGRAVITY.md` first. Rules still apply: side drawer, zero gradients, Arabic split by words only, no invented facts, React 18, tokens only.

---

## 0. Geometry constant (use everywhere)

The logo's outer blades rise at **~61° from horizontal**. For a slanted edge of height `H`, the horizontal run is:

```
RUN = H × 0.554        (= H / tan 61°)
```

Expose it as `--blade-k: 0.554` in `:root`, and a helper `bladeRun(h) = h * 0.554` in `src/motion/tokens.ts`. **Every slanted edge in this plan uses this angle**, and every one is mirrored in RTL.

## 1. Home hero — direction B (`src/sections/home/Hero.tsx`)

### 1.1 Desktop (≥ 1024px)

- **Section:** `bg-white`, fixed height **640px**, `relative overflow-hidden`, with a bottom border `line`.
- **Blue panel:** absolutely positioned on the **inline-end** side, full section height, width **48%** of the section.
  - Its inner edge (toward the text) is slanted with `clip-path`, using `RUN = 640 × 0.554 ≈ 355px`:
    - **LTR** (panel on the right): `clip-path: polygon(355px 0, 100% 0, 100% 100%, 0 100%)`
    - **RTL** (panel on the left): `clip-path: polygon(0 0, calc(100% - 355px) 0, 100% 100%, 0 100%)`
  - Color: solid `brand-600`.
- **Inner blade stripe:** a second element, solid `ink`, **10px wide**, running parallel to the panel's slanted edge, **22px** away from it on the white side, full height. Build it as a thin parallelogram with the same clip angle. It echoes the thin inner blade of the logo.
- **Inside the panel:** `mark-white.svg` (inlined SVG, as today), ~300px wide, standing on a 2px white rule. Center it in the panel's **visible** area, offset away from the slant by about half the RUN. `PeakLines` sit behind it in `brand-800`, quiet.
- **Text block:** inline-start side, max-width ~560px, vertically centered.
  - Eyebrow: pill with `brand-50` background, `brand-700` text (keep the uppercase rule for English only).
  - H1: `ink`, 56px/800.
  - Lead: `body` color.
  - Buttons: primary (`brand-600`) + secondary (white, `line` border). Remove the on-blue variants from this section.

### 1.2 Tablet and mobile (< 1024px)

- Stack: text block first (white background, normal padding), then the blue panel as a **full-width block, 260px tall**.
- The panel's top-inline-start corner is cut at the blade angle (`RUN = 260 × 0.554 ≈ 144px`):
  - **LTR:** `polygon(144px 0, 100% 0, 100% 100%, 0 100%)`
  - **RTL:** `polygon(0 0, calc(100% - 144px) 0, 100% 100%, 0 100%)`
- The ink stripe follows the cut edge (10px, 16px away).
- The white mark (180px) is centered in the panel.
- No horizontal overflow at 360px.

### 1.3 Hero motion (replaces the old hero intro)

- **Panel enter:** the panel slides in from its own edge (`xPercent: ±100 → 0`, sign mirrored per direction) over `0.9s brand`. The ink stripe follows 0.12s later (`scaleY 0 → 1` from the top).
- **Mark:** outline draw with DrawSVG, then the fill fades in (as today), starting at 0.35s.
- **Text:** eyebrow fade, H1 word rise (words only), lead fade, buttons pop, starting at 0.2s.
- **Pointer parallax** (desktop, fine pointer): mark ±12px, `PeakLines` ∓20px, panel ±6px.
- **Scroll-out** (scrub): the text block moves up 30px; the panel moves up 80px and its clip edge flattens slightly (increase the RUN by 40px). Transform and clip-path only.
- Everything is finished by 1.6s. The H1 must be readable by 0.9s.
- **Reduced motion or no JS:** a static final layout, fully visible.

## 2. Inner pages — light `PageHero` (`src/components/PageHero.tsx`)

Used by Services, Service detail ×6, About, Contact.

- **Section:** `bg-surface`, bottom border `line`, min-height **340px** desktop / auto on mobile, padding-block 72px desktop / 48px mobile.
- **Text:** breadcrumb (`muted`, current item in `ink`), H1 `ink`, lead `body`, max-width ~720px. Unchanged content.
- **Blade slab:** on the inline-end side, a solid `brand-600` slab, **22%** of the section width, full section height, inner edge slanted at the blade angle (`RUN = sectionHeight × 0.554`). Measure the height with `ResizeObserver` and set the RUN as a CSS variable, so the angle stays exact whatever the height. Add a parallel `ink` stripe (8px wide, 18px away).
  - Below 768px: the slab becomes a **40px-wide** slanted strip on the inline-end edge. The stripe is hidden.
- **Service detail icon tile:** now a **`brand-600` tile with a white icon** (72px), placed above the H1 (it was a white tile on blue).
- `PeakLines` inside the slab in `brand-800` (desktop only).
- **Motion:** slab slides in from its edge (0.7s brand), stripe follows, breadcrumb/H1 (words)/lead reveal as today. Reduced motion: static.

## 3. Page transition — real blade overlay (replaces View Transitions)

The previous View-Transitions sweep is invisible over colored heroes. Replace it with a **dedicated overlay** that covers, holds, and reveals.

### 3.1 Remove the old mechanism
- In `AppLink`/`AppNavLink`: stop passing `viewTransition` and use the blade navigation instead (§3.3).
- Delete the `::view-transition-*` rules and the `vt-*` keyframes from `index.css`, and remove `viewTransitionName: 'site-header'`.
- `grep -rn "view-transition\|viewTransition" src` must return nothing.

### 3.2 Overlay component — `src/motion/BladeTransition.tsx`

- Mounted once, near the root, inside the router.
- `position: fixed; inset: 0; z-index: 200; pointer-events: none;` It blocks clicks only while active.
- **Blade:** a solid `brand-600` element, `height: 100vh`, `width: calc(100vw + RUN)` where `RUN = 100vh × 0.554`, with parallelogram `clip-path` so both vertical edges are slanted at the blade angle.
- **Leading stripe:** a solid `ink` parallelogram, **14px** wide, riding just ahead of the blade's leading edge (8px gap).
- **Center mark:** `mark-white` at 112px, centered in the viewport, `opacity: 0`.
- **Direction:** the blade travels in **reading direction**: left → right for `en`, right → left for `ar`. Use the language of the page being **left**.

### 3.3 Navigation flow — `useBladeNavigate()` (context provider)

On an internal link click, a plain left click without modifier keys:
1. **Skip the blade** and let normal navigation happen when:
   - the target equals the current path (only scroll to top), or it is a hash on the same page;
   - the link is external, or has `target` / `download`;
   - reduced motion is on;
   - a transition is already running (ignore the click).
2. `preventDefault()`, then set the overlay active and stop Lenis.
3. **Cover (0.36s, `brandInOut`):** the blade and stripe move from fully off-screen at the start edge to fully covering the viewport.
4. **Hold (~0.16s):** the center mark scales 0.85 → 1 and fades in.
5. While covered: `navigate(to)`, `window.scrollTo(0, 0)` (or `lenis.scrollTo(0, { immediate: true })`), and wait for the new route to **commit**. The new page's `Layout` resolves a "page ready" promise in `useLayoutEffect`, plus one `requestAnimationFrame` and `document.fonts.ready`. Cap the wait at 1200ms.
6. `ScrollTrigger.refresh()`, then dispatch `window` event `alaryam:page-enter`.
7. **Reveal (0.42s, `brand`):** the mark fades out (0.1s), and the blade and stripe continue out through the far edge.
8. Deactivate the overlay and start Lenis.

- Total ≈ 1.0s.
- **Browser back/forward (`popstate`):** no blade. Navigate instantly, scroll to top, and dispatch `alaryam:page-enter`.
- **Page intro timing:** `Hero` and `PageHero` intros must wait for `alaryam:page-enter` when the page was reached via a blade navigation, so the intro plays as the blade exits. On first load (SSG hydration) they run immediately. Expose `usePageEnter(cb)`.
- **Accessibility:**
  - The overlay is `aria-hidden`.
  - After navigation, move focus to the new page's `<h1>` (`tabIndex=-1`) and update the document title as today.
  - An `aria-live="polite"` region announces the new page title.
- **No-JS:** links are normal `<a href>`, so navigation still works.

### 3.4 Language switch
Uses the same blade. Direction follows the page being left.

## 4. Knock-on updates

1. `ANTIGRAVITY.md` already reflects the new motion stack. Treat anything in plans 02–04 about View Transitions as **superseded by this plan**.
2. **Header:** it now sits on white heroes too. Keep the solid white header with its bottom border, and check there is no double border with the `PageHero` border.
3. `CtaBand` and the service-detail CTA band stay as they are (ink / blue). They are the only full-color blocks left, which is intended.
4. `nojs` and reduced-motion screenshots must show hero B and the light PageHero correctly.
5. `check:classes` must still pass with the new classes.

## 5. Checks (paste outputs)

- `npm run build`, `check:gradients`, `check:i18n`, `check:hex`, `check:links`, `check:classes`
- `grep -rn "view-transition\|viewTransition" src` → empty
- **Hidden-element audit** (the scroll-through script from plan 04) on all 24 page views → all **0**
- **Horizontal overflow** at 360px on every page, both languages → none
- **Blade proof** (Puppeteer):
  - Count overlay activations via `window.__blade = (window.__blade||0)+1` inside the provider.
  - Navigate `/en/` → Services → About → Contact, then `/ar/` → خدماتنا → من نحن. Paste the counter value (must be 5).
  - Capture frames every **60ms** for one EN and one AR navigation: `frames/blade-en-01…14.png`, `frames/blade-ar-01…14.png`. The blade must visibly cover the page, show the mark, and exit in reading direction.
- **Back button:** after the navigations above, `page.goBack()` must not trigger the blade (the counter stays the same) and the page must render correctly.
- **Lighthouse** (desktop + mobile) on `/ar/`, `/en/`, `/ar/services/software-development/`: Performance ≥ 90 desktop / ≥ 80 mobile, Accessibility ≥ 95, SEO 100, **CLS < 0.05**.

## 6. Evidence → `summaries/screenshots/05/`

- All **24** full-page screenshots (scroll-through first), same names as plan 04.
- Close-ups (viewport-only, after the intro finishes):
  - `hero-ar-1440.png`, `hero-en-1440.png`, `hero-ar-390.png`, `hero-en-390.png`
  - `pagehero-services-ar-1440.png`, `pagehero-service-detail-en-1440.png`, `pagehero-about-ar-390.png`
- `nojs-home-ar-1440.png`, `reduced-motion-home-en-1440.png`, `drawer-open-ar-390.png`
- Real recordings (Puppeteer screencast, 30fps):
  - `blade-en.webm` (Home → Services → About)
  - `blade-ar.webm` (الرئيسية → خدماتنا → من نحن)
  - `hero-intro-en.webm`
  - `hero-intro-ar-390.webm`
- Frame sequences from §5.

## 7. Summary, package, commit, STOP

- `summaries/05-hero-b-and-blade.md`: each section with status and **behavioral evidence** (counter values, frame names, the hidden table, grep outputs, Lighthouse table, video durations from `ffprobe -count_packets`).
- `npm run package` (a new zip).
- Commit, then **🛑 STOP**. Do not deploy.
