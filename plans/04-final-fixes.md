# 04 — Final Fixes (ONE RUN)

> Read `reviews/003-plan-03-review.md` first. Small plan: do §1–§6 in one run, then stop.
> All `ANTIGRAVITY.md` rules still apply.

---

## 1. Page transitions — use the real prop (review 003 #1)

1. In `src/components/AppLink.tsx`, pass **`viewTransition`** (the prop react-router-dom 6.30 actually supports). Remove `unstable_viewTransition` and the `isClient` branch; the prop is safe during SSR:
   ```tsx
   export const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
     ({ viewTransition = true, ...props }, ref) => <Link ref={ref} viewTransition={viewTransition} {...props} />
   );
   // same for AppNavLink
   ```
2. `grep -rn "unstable_" src` must return nothing.
3. **Prove it in the browser** (Puppeteer, Chromium):
   - Before navigating, inject a counter:
     `const o = document.startViewTransition.bind(document); window.__vt = 0; document.startViewTransition = (cb) => { window.__vt++; return o(cb); };`
   - Load `/en/`, scroll to the middle of the page (a white section), then click the header "About" link.
   - Paste the value of `window.__vt` (must be ≥ 1).
   - Repeat on `/ar/` → "من نحن" and paste that value too.
   - Capture frames **every 80ms** during each navigation: `frames/vt-en-01.png … vt-en-10.png` and `frames/vt-ar-01.png … vt-ar-10.png`. The blue blade must be visible sweeping over the white section: left→right in English, right→left in Arabic.
4. If the blade direction or angle looks wrong in the frames, fix the CSS keyframes and recapture.

## 2. Reveal safety + valid full-page screenshots (review 003 #2)

1. In `capture-all.js`, before **every** `fullPage` screenshot, scroll through the whole page in steps of 60% of the viewport height, waiting 250ms per step. Then scroll back to the top, wait 800ms, and take the screenshot.
2. Add an automated check to the capture run. On every page (both languages, 1440 and 390), after the scroll-through, count elements that are still hidden:
   ```js
   [...document.querySelectorAll('[data-reveal], .split-word, h1, h2, h3, p, a, li')]
     .filter(el => { const s = getComputedStyle(el); return el.getBoundingClientRect().height > 0 && (parseFloat(s.opacity) < 0.99 || s.visibility === 'hidden'); })
     .length
   ```
   Every page must report **0** (excluding the drawer and its backdrop). Paste the table of results.
3. If any page reports > 0, fix the cause. Examples: a ScrollTrigger `start` that can never be reached near the page bottom → use `start: 'top bottom-=10%'` or `once: true` with a `ScrollTrigger.refresh()` after `load` and after `document.fonts.ready`. Recheck until 0.
4. Recapture all 24 page screenshots into `summaries/screenshots/04/` with the scroll-through applied. In particular, `services-en-1440.png` must show all six rows, the CTA band, and the footer with its columns.

## 3. 404 head (review 003 #3)

In `scripts/generate-404.js`, remove from `404.html`: `<link rel="canonical">`, every `<link rel="alternate" hreflang>`, and `og:url`. Keep `noindex, follow`, the title, and the description. Paste `grep -c 'canonical\|hreflang' dist/404.html` (must be `0`).

## 4. Real recordings (review 003 #4)

- Record real video with Puppeteer screencast (`const recorder = await page.screencast({ path: 'x.webm' })` … `await recorder.stop()`; ffmpeg is at `/opt/homebrew/bin/ffmpeg`), at the browser's native frame rate:
  1. `vt-en.webm`: `/en/` scroll to mid → click About (the transition)
  2. `vt-ar.webm`: the same in Arabic
  3. `hero-intro-ar.webm`: load `/ar/`, wait 2.5s, then scroll slowly to the bottom
  4. `drawer-ar-390.webm`: open and close the drawer at 390px
  5. `contact-success-en.webm`: fill the form and submit (intercepted) → success
- Delete the old slideshow `.mp4` files from `summaries/screenshots/03/`, so nothing is mislabeled.
- If screencast fails, say so plainly and explain why. Do not substitute slideshows.

## 5. Checks + package

Run and paste the outputs:
- `npm run build`, `check:gradients`, `check:i18n`, `check:hex`, `check:links`, `check:classes`
- `grep -rn "unstable_" src`
- The `window.__vt` values (§1)
- The hidden-element table (§2)
- The 404 grep (§3)

Then `npm run package` (a new zip).

## 6. Summary, commit, STOP

`summaries/04-final-fixes.md`: one row per review-003 issue (#1–#4) with **behavioral evidence**: browser counter values, frame names, the hidden-count table, grep outputs, and video file names with their durations (`ffprobe`). No "Resolved" without that evidence.

Commit, then **🛑 STOP**. Do not deploy.
