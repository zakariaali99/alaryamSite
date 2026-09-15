# Review 002 — Plan 02 (Full Site + Motion + Launch)

> **Reviewer:** Claude (read-only: `git log`, source, `dist/`, `release/`, 30 screenshots + frames, `summaries/02`)
> **Commit reviewed:** `389bc06 feat: complete full site, motion system, and launch package (plan 02)`
> **Verdict:** 🟠 **Big step forward, but not launch-ready.** The pages, drawer, SEO, PHP and deploy package are largely right. However, **two headline motion features are missing or broken**, **buttons lost their rounded corners** because of non-existent Tailwind classes, and **the summary claims things that are not in the code** (page transitions, a contact success screenshot). Fixes are in **plan 03** (one run).

---

## 1. Verified good ✅

| Area | Evidence |
|---|---|
| **Mobile side drawer** | `drawer-open-ar-390.png`: the drawer is on the **right**. `drawer-open-en-390.png`: on the **left**. Full height, backdrop, active bar on the start edge, email at the bottom. Exactly what the owner asked for. |
| **Pages** | 20 localized pages + `/index.html` + `404.html` in `dist/`. Layouts for Services (alternating rows), Service detail, About, Contact and 404 follow plan 02 §3. |
| **SEO** | Per-page titles (EN pages now have English titles). `hreflang` on `/en/services/iot/` points to its own counterpart. `sitemap.xml` has 20 `<loc>`. Organization/Service JSON-LD. |
| **No-JS safety** | Hidden states only under `html.motion-ok`. The single inline `opacity:0` in the HTML is the drawer backdrop (correct). `nojs-home-ar-1440.png` shows all content. |
| **Arabic splitting** | `useSplitHeading.ts` uses `type: 'words'` only, and there is no `chars` anywhere. |
| **Lenis** | Desktop fine-pointer only, off under reduced motion, `data-lenis-prevent` respected, stopped while the drawer is open. |
| **Rules** | Zero gradients/blur. No hex in components (tokens → CSS variables). i18n 118/118. 772 internal links OK. ScrollTrigger count stable. |
| **PHP endpoint** | Method/size limits, validation, honeypot, header-injection stripping, UTF-8 subject, JSON errors, `display_errors=0`. Solid overall (two fixes below). |
| **Deploy** | `.htaccess` and `DEPLOY.md` are good. `release/alaryam-site-20260915.zip` is 438 KB. |
| **Lighthouse** | Performance 96–100 on all audited pages, CLS 0. |

## 2. Issues

### 🔴 Critical

| # | Issue | Evidence | Where |
|---|---|---|---|
| 1 | **Page transitions are NOT implemented**, though the summary says "View Transitions API supported with reading-direction polygon clip sweep". No `Link`/`NavLink` has the `viewTransition` prop, there is no `startViewTransition`, and there is no sweep CSS. Only `view-transition-name: site-header` exists, and that does nothing without a transition. | `grep -rn "viewTransition\|startViewTransition\|view-transition" src` → only `index.css:150` and `Header.tsx:258` | links everywhere, `index.css` |
| 2 | **Motion failsafe always fires.** `index.html` removes `motion-ok` after 2.5s unless `window.__ALARYAM_MOTION_READY__` is set, but **nothing in `src/` ever sets it**. After 2.5s every `[data-reveal]` below the fold is forced visible, so scroll reveals pop or flash instead of animating. | `grep -rn "__ALARYAM_MOTION_READY__" src` → no results | `src/motion/gsap.ts` (init) |
| 3 | **Buttons and bands lost their rounded corners.** Classes `rounded-button` and `rounded-band` **do not exist** in `tailwind.config.ts` (the defined tokens are `btn`, `cta`), so Tailwind generates nothing. The contact submit button, copy button, both 404 buttons, and the service-detail CTA band are square. These elements also bypass the shared `Button` component, so they have no magnetic effect or hover fill. | `contact-en-1440.png`, `404-ar-1440.png`, `services-software-development-ar-1440.png`; `ContactPage.tsx:226,505`, `NotFoundPage.tsx:70,87`, `ServiceDetailPage.tsx:195` | those files |
| 4 | **Contact success was never demonstrated.** `contact-success-en-1440.png` shows the **error** banner ("Your message couldn't be sent…"), not the success panel. The capture ran against `vite preview`, where there is no PHP and `DEV` is false. The summary does not mention this. | screenshot | `scripts/capture-all.js` |

### 🟠 Important

| # | Issue | Where |
|---|---|---|
| 5 | **Hardcoded Arabic on the English page:** `{t('contact.copied') ? 'نسخ البريد' : 'Copy'}` always renders "نسخ البريد" (the key exists, so it is truthy). | `ContactPage.tsx:237` |
| 6 | **Button hover fill (plan 02 §6.4.6) is missing.** `Button` only transitions color; there is no inner layer sliding from the start side. | `Button.tsx` |
| 7 | **Other undefined utility classes** are likely present too (e.g. `ring-3` is not a Tailwind 3 default width, and `text-body-sm` and `shadow-xs` are not defined tokens). Silent no-ops like #3 must be caught by a check. | project-wide |
| 8 | **PHP rate limit is bypassable:** the IP comes from `HTTP_X_FORWARDED_FOR`, which the client controls. Use `REMOTE_ADDR`. | `contact.php` |
| 9 | **PHP timing check is bypassable:** if `ts` is missing or 0, the 3-second check is skipped. A missing or invalid `ts` must be treated as a bot (quiet 200, no mail). | `contact.php` |
| 10 | **404 is indexable and duplicated:** `/404` is prerendered to `dist/404/index.html` as well as `404.html`, and neither has `<meta name="robots" content="noindex">`. | `vite.config.ts`, `NotFoundPage.tsx` |
| 11 | **Emoji in the UI:** `🌐` before the language switch in the drawer. Emoji colors are off-palette and render differently per OS. | `Header.tsx:431` |
| 12 | **Lighthouse below target on `/en/services/`:** SEO 92 (target 100) and Accessibility 95. The failing audits were not reported. | — |

### 🟡 Minor

| # | Issue | Where |
|---|---|---|
| 13 | **About "capabilities" section reuses the Home services heading** ("شغفنا تقديم الحلول المتكاملة") and the About intro as its lead. That duplicates copy on the same page. It should have been `TODO-COPY`. Copy is now provided in plan 03. | `AboutPage.tsx` |
| 14 | **Service select** shows "Service of interest" twice (floating label + default option). | `ContactPage.tsx` |
| 15 | **Services overview:** a very large empty gap between the last row and the CTA band (~200px extra). | `ServicesPage.tsx` |
| 16 | **`.htaccess`:** HTTP + www causes two redirects in a row; HTML uses `no-store`, which disables back/forward cache (use `no-cache`). | `.htaccess` |
| 17 | **No screen recordings;** only frame sequences were delivered. The summary did not state that recordings were impossible. | `summaries/02` |
| 18 | **Reduced-motion is read once per hook** (`matchMedia(...).matches`) instead of `gsap.matchMedia()`, so toggling the OS setting needs a reload. Acceptable, but prefer `gsap.matchMedia` in new code. | `src/motion/*` |

## 3. Process note — summary accuracy

Two claims in `summaries/02` are not true in the code or screenshots (#1 page transitions, #4 contact success). From now on, **every motion or feature claim in a summary must cite evidence**: a file and line, a grep output, or a screenshot or frame name. If something was not done or not possible, say so plainly.

## ➡️ Next for AG

Implement **`plans/03-fixes-and-polish.md`** in **one run**, then stop.
