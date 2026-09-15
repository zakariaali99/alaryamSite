# 03 — Fixes & Polish (ONE RUN)

> Read `reviews/002-plan-02-review.md` first. Fix **every** issue listed there. Do all sections below in one run, and stop only after §12.
> `ANTIGRAVITY.md` rules still apply (side drawer, zero gradients, words-only Arabic splitting, no invented facts, React 18).

---

## 1. Page transitions — implement for real (review #1)

1. Add `viewTransition` to **every internal navigation**: `Button` (when `to`), `Logo`, header `NavLink`s, drawer links, footer links, breadcrumbs, service cards, "Learn more" links, and the language switch. The simplest safe way is a small `AppLink` wrapper around `Link` that always passes `viewTransition`, used everywhere instead of raw `Link`/`NavLink` (keep `NavLink` semantics for active state).
2. CSS in `index.css` (solid colors only):
   ```css
   ::view-transition-old(root) { animation: vt-old 450ms var(--ease-brand-in-out) both; }
   ::view-transition-new(root) { animation: vt-new 700ms var(--ease-brand) both; }

   /* LTR: the blue blade sweeps left → right; RTL mirrors it */
   @keyframes vt-old { to { opacity: 0; transform: translateX(-40px); } }
   @keyframes vt-new {
     0%   { clip-path: polygon(0 0, 0 0, -30% 100%, -30% 100%); }
     100% { clip-path: polygon(0 0, 130% 0, 100% 100%, -30% 100%); }
   }
   :root[dir="rtl"]::view-transition-old(root) { animation-name: vt-old-rtl; }
   :root[dir="rtl"]::view-transition-new(root) { animation-name: vt-new-rtl; }
   @keyframes vt-old-rtl { to { opacity: 0; transform: translateX(40px); } }
   @keyframes vt-new-rtl {
     0%   { clip-path: polygon(100% 0, 100% 0, 130% 100%, 130% 100%); }
     100% { clip-path: polygon(100% 0, -30% 0, 0 100%, 130% 100%); }
   }
   /* A solid brand-600 blade leading the new page */
   ::view-transition-group(root) { background: var(--brand-600); }

   ::view-transition-group(site-header) { animation: none; }

   @media (prefers-reduced-motion: reduce) {
     ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
   }
   ```
   You may tune the polygon so the leading edge matches the logo's blade angle (~61°), but keep it **one solid blue blade, no gradients**. Total duration ≤ 900ms.
3. After navigation: scroll to top (Lenis `scrollTo(0, {immediate:true})` or `window.scrollTo`), then call `ScrollTrigger.refresh()`.
4. **Evidence required:** paste `grep -rn "viewTransition" src | wc -l` (must cover all internal links) and capture a 6-frame sequence `frames/page-transition-en-*.png` (Home → Services) plus `frames/page-transition-ar-*.png` showing the blade direction.

## 2. Motion-ready flag (review #2)

- In the client-only motion bootstrap (`src/motion/gsap.ts` or where plugins register after hydration), set `window.__ALARYAM_MOTION_READY__ = true` right after GSAP plugins are registered and the first `ScrollTrigger.refresh()` has run.
- Declare the global type in `src/vite-env.d.ts`.
- Once motion is ready, the failsafe must never remove `motion-ok`.
- **Evidence:** in DevTools with **CPU 4× slowdown**, load `/ar/`, wait 5s, scroll: sections below the fold must still animate in (not already visible). Capture `frames/reveal-after-5s-*.png` (before and after scrolling), and paste `window.__ALARYAM_MOTION_READY__` and `document.documentElement.className` from the console.

## 3. Undefined classes + unified buttons (reviews #3, #6, #7)

1. **Add a check:** `npm run check:classes`, a Node script that:
   - Collects every class token from `className="…"` and template strings in `src/**/*.tsx`. Ignore `${…}` fragments, and allow a small documented list of intentionally unstyled hook classes.
   - Builds the CSS (or uses the latest `dist/assets/*.css`).
   - Fails for any token that has no matching selector in the CSS.
   - Wire it into `npm run package`.
2. Fix everything it reports. Known cases:
   - `rounded-button` → `rounded-btn`
   - `rounded-band` → `rounded-cta`
   - `ring-3` → add `ringWidth: { 3: '3px' }` to the Tailwind config
   - `text-body-sm`, `shadow-xs` → define tokens or replace with existing ones
3. **All buttons use the shared `Button` component**: contact submit (add a `loading` prop with spinner + `form.sending`), copy-email button (add `size="sm"` + `variant="secondary"` + an icon slot), both 404 buttons, and every CTA. No hand-styled `<button>`/`<a>` that looks like a button.
4. **Button hover fill** (plan 02 §6.4.6):
   - Add an absolutely-positioned inner `<span aria-hidden>` layer with `overflow-hidden` on the button.
   - The layer scales X from the **start side** on hover (`transform-origin: inline-start` via `[dir]` selectors), 350ms `brand` ease. Label sits above it.
   - Colors: primary → layer `brand-700`. Secondary → layer `surface`. On-blue primary → layer `brand-50`. On-blue secondary → layer `white`, with the label turning `brand-600`.
   - Keep magnetic (desktop) + press scale 0.97. No effect under reduced motion (instant color change).
5. The service-detail CTA band gets `rounded-cta` like every other band.

## 4. Contact page (reviews #4, #5, #14)

1. Copy button text from locale keys (add to both JSON files):
   | Key | Arabic | English |
   |---|---|---|
   | `contact.copyEmail` | نسخ البريد | Copy email |
   | `contact.copied` | تم النسخ! | Copied! |
   It shows `copyEmail`, then `copied` with a check icon for 1.5s.
2. **Service select:** the first option is an empty value with text `—` (not the label). The floating label stays "Service of interest" / "الخدمة المطلوبة".
3. **Success state proof:** make `scripts/capture-all.js` intercept `POST /api/contact.php` (`page.setRequestInterception(true)`) and respond `200 {"ok":true}` after 800ms. Capture:
   - `contact-success-en-1440.png` (the success panel with the drawn check)
   - `contact-success-ar-390.png`
   - `contact-error-ar-1440.png` (intercept responding `500 {"ok":false,"error":"server"}`)
   - `frames/contact-submit-*.png`

## 5. PHP hardening (reviews #8, #9)

1. **Client IP:** use `$_SERVER['REMOTE_ADDR']` only. Do not read `X-Forwarded-For`.
2. **`ts` validation:** if `ts` is missing, non-numeric, in the future (>60s ahead), younger than 3s, or older than 24h → quiet `200 {ok:true}` with no mail.
3. Guard `mb_*` functions: if `function_exists('mb_strlen')` is false, fall back to `strlen` / `iconv_strlen`. If `mb_encode_mimeheader` is missing, use `'=?UTF-8?B?' . base64_encode($subject) . '?='`.
4. Add a `lang` whitelist (`ar` | `en`).
5. Keep everything else.

## 6. 404 (review #10)

- Remove `/404` from `includedRoutes`, so only `dist/404.html` exists (generate it the same way you do now).
- Add `<meta name="robots" content="noindex, follow">` to the 404 page.
- Make sure `check:links` and `sitemap.xml` never include `/404`.

## 7. Header (review #11)

- Remove the `🌐` emoji. Use lucide `Languages` (18px, stroke 1.75, `brand-600`) before the language label in the drawer and in the desktop header.
- `grep -rnP "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" src` must be empty.

## 8. Lighthouse to target (review #12)

- Run Lighthouse on `/en/services/`, `/ar/about/`, `/en/contact/`, `/ar/services/iot/` (desktop + mobile).
- For **any** category below target (Perf ≥ 90 desktop / ≥ 80 mobile, Accessibility ≥ 95, Best Practices ≥ 95 ignoring `is-on-https` locally, **SEO = 100**), paste the failing audit IDs and what you changed.
- Final scores in the summary.

## 9. About copy (review #13)

Add to both locale files and use in About → capabilities:
| Key | Arabic | English |
|---|---|---|
| `about.capabilitiesTitle` | قدراتنا | Our capabilities |
| `about.capabilitiesLead` | خبرة تقنية وهندسية تغطي دورة المشروع كاملة. | Technical and engineering expertise across the full project lifecycle. |

Remove the reused Home services title and the duplicated intro from that section.

## 10. Layout & server polish (reviews #15, #16)

1. **Services overview:** remove the extra gap before the CTA band. The spacing between the last row and the band must equal the standard section rhythm (≤ 112px desktop / 72px mobile). Verify in the screenshot.
2. **`.htaccess`:** collapse HTTPS + www into one redirect:
   ```apache
   RewriteCond %{HTTPS} off [OR]
   RewriteCond %{HTTP_HOST} ^www\. [NC]
   RewriteRule ^ https://alaryam.ly%{REQUEST_URI} [L,R=301]
   ```
   HTML: `Cache-Control: no-cache` (remove `no-store`, `Pragma`, `Expires 0`).

## 11. Recordings (review #17)

- Try real video: Puppeteer `page.screencast({ path: '….webm' })` (needs `ffmpeg`; check `which ffmpeg`).
- Record the five clips from plan 02 §9, plus the page transition in both languages.
- If `ffmpeg` is unavailable, state that explicitly and provide 8-frame sequences for each clip instead.

## 12. Quality checks, screenshots, summary, STOP

**Checks (paste outputs):**
- `build`, `check:gradients`, `check:i18n`, `check:hex`, `check:links`
- **new** `check:classes`, the emoji grep
- `grep -rn "viewTransition" src | wc -l`
- the `__ALARYAM_MOTION_READY__` evidence
- `hreflang` sample
- Lighthouse table (§8)

Then `npm run package` (a new zip).

**Screenshots → `summaries/screenshots/03/`:**
- `contact-en-1440.png`, `contact-ar-390.png`, `404-ar-1440.png`, `services-en-1440.png`, `services-software-development-ar-1440.png`, `about-ar-1440.png`
- the drawer in both languages (to confirm the icon change)
- the §4 success/error shots
- all frame sequences requested above

**Summary `summaries/03-fixes-and-polish.md`:** a table with one row per review-002 issue (#1–#18): status + **evidence** (file:line, command output, or screenshot name). No claim without evidence. Anything not done → say why.

Commit, then **🛑 STOP**. Do not deploy.
