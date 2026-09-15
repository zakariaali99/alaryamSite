# Review 003 — Plan 03 (Fixes & Polish)

> **Reviewer:** Claude (read-only: code, `node_modules` API check, `dist/`, `release/`, screenshots + frames, `summaries/03`)
> **Commit reviewed:** `d369752 feat: complete plan 03 fixes, real page transitions, button unification, and video proofs`
> **Verdict:** 🟢 **Almost there.** 14 of 18 issues are genuinely fixed and verified. **Page transitions still do not work** (wrong prop name), and three smaller evidence/SEO gaps remain. Fixes are in **plan 04** (small, one run).

---

## 1. Verified fixed ✅

| # | Fix | How I verified |
|---|---|---|
| 2 | Motion-ready flag | `src/motion/gsap.ts:21` sets it. The `reveal-after-5s` frames show cards animating in after 5s at 4× CPU. |
| 3, 7 | Rounded buttons / undefined classes | `rounded-button`/`rounded-band` are gone; `ringWidth 3`, `shadow-xs`, `text-body-sm` are defined; `check:classes` exists. The `contact-en-1440`, `404-ar-1440` and service CTA band screenshots show rounded corners. |
| 3, 6 | Unified `Button` + hover fill | `Button.tsx` has the `button-hover-fill` layer, `loading`, `icon`; the contact and 404 pages use it. |
| 4 | Contact success / error | `contact-success-en-1440.png` shows the real success panel; `contact-error-ar-1440.png` shows the error banner (request interception in `capture-all.js`). |
| 5 | Copy email i18n | `ContactPage.tsx:220` uses `t('contact.copied')` / `t('contact.copyEmail')`; the EN screenshot shows "Copy email". |
| 8 | PHP IP | `contact.php:141` uses `REMOTE_ADDR` only. |
| 9 | PHP `ts` | `contact.php:80-90`: rejects missing/non-numeric/future/<3s/>24h. |
| 10 | 404 duplicate + noindex | No `dist/404/`; `404.html` has `noindex, follow`; not in the sitemap. |
| 11 | Emoji | Emoji grep empty; lucide `Languages` icon is in the header and drawer (screenshots). |
| 12 | Lighthouse | SEO 100 on all audited pages (per summary table). |
| 13 | About copy | "قدراتنا / Our capabilities" + new lead (`about-ar-1440.png`). |
| 14 | Select | First option is `—`. |
| 16 | `.htaccess` | Single HTTPS+www redirect; HTML `Cache-Control: no-cache`. |
| — | Side drawer | Still correct: right edge in Arabic (`drawer-open-ar-390.png`), with focus on the close button. |

## 2. Remaining issues

### 🔴 Critical

| # | Issue | Evidence |
|---|---|---|
| 1 | **Page transitions still do not fire.** `AppLink.tsx:11,24` passes `unstable_viewTransition`, but installed **react-router-dom 6.30.6 does not know that prop**: `grep -c unstable_viewTransition node_modules/react-router-dom/dist/index.js` → `0`. The supported prop is **`viewTransition`** (`index.js:810`, `index.d.ts:102`). React Router silently ignores the unknown prop, so `document.startViewTransition` is never called. The frames `page-transition-en-3.png` / `-ar-3.png` show only the heading split-reveal on the new page, with no blade sweep. The CSS in `index.css:152-214` is fine; it is just never triggered. | `node_modules` grep; frames |

### 🟠 Important

| # | Issue | Evidence |
|---|---|---|
| 2 | **Full-page screenshots are not valid evidence for reveal content.** `services-en-1440.png` shows the hero and then a **blank page**: all six service rows, the CTA band and the footer columns are missing. `capture-all.js:60,68` calls `fullPage: true` without scrolling, so scroll-triggered content was never revealed. This makes review #15 ("gap fixed") **unverifiable**. It is also a reminder that hidden-until-scrolled content must be proven to always reveal. | screenshot; `capture-all.js` |
| 3 | **`404.html` has wrong canonical/hreflang.** It was generated from the home template, so it declares `canonical = https://alaryam.ly/ar/` plus home hreflang alternates. A noindex page must not claim to be the home page. | `grep canonical dist/404.html` |

### 🟡 Minor

| # | Issue | Evidence |
|---|---|---|
| 4 | **The "videos" are not recordings.** `capture-all.js:361` builds each `.mp4` from 6 still PNG frames at `-framerate 3`, a 2-second slideshow. That cannot show easing, smoothness or the page transition. The summary calls them "screen video recordings". | `capture-all.js:361` |
| 5 | Review #18 is only partially addressed (still no `gsap.matchMedia`). Accepted as is; no action needed. | — |

## 3. Process note

The summary again marked #1 and #17 as "Resolved" without verifying behavior: a prop was renamed without checking that the library supports it, and still frames were called videos. For plan 04, **behavior must be proven in the browser**, not just that code exists.

## ➡️ Next for AG

Implement **`plans/04-final-fixes.md`** in one run, then stop.
