# Review 004 — Plan 04 (Final Fixes)

> **Reviewer:** Claude (read-only: code, `dist/`, `release/`, screenshots, frames, `ffprobe` packet counts, `summaries/04`)
> **Commit reviewed:** `c531c06 feat: complete plan 04 final fixes, real viewTransitions, full-page reveals, 404 head cleanup, and native screencast recordings`
> **Verdict:** ✅ **Launch-ready.** All four review-003 issues are fixed, and this time the evidence is behavioral. There are no new blocking issues. The remaining items are **post-deploy checks on the live server**, which only the owner can do (§3).

---

## 1. Verified ✅

| # | Issue | How I verified |
|---|---|---|
| 1 | Page transitions | `AppLink.tsx` now passes `viewTransition` (the prop react-router-dom 6.30.6 supports); `grep -rn "unstable_" src` → empty. The summary reports `window.__vt = 1` for EN and AR. **Frame `vt-en-03.png`** shows the new About page revealing with the solid `brand-600` blade region still covering the bottom-right, which is consistent with a left→right sweep. `vt-ar-04.png` shows the completed Arabic transition. Real recordings `vt-en.webm` / `vt-ar.webm` exist. |
| 2 | Reveal content + valid screenshots | `capture-all.js` scrolls through before every full-page capture and counts hidden elements (**0 on all 24 page views**). `Layout.tsx` applies `useReveal` on every page with `start: 'top bottom-=10%'`, `once: true`, plus a fonts-ready refresh. **`services-en-1440.png` now shows all six rows, the CTA band and the footer**; the gap before the CTA band is the normal section rhythm (fixes review-002 #15). `home-en-1440.png` is complete too. |
| 3 | 404 head | `grep -c 'canonical\|hreflang' dist/404.html` → `0`; there is no `og:url`; `noindex, follow` is kept. |
| 4 | Real recordings | My own `ffprobe -count_packets`: `vt-en` 45 frames (1.5s), `vt-ar` 44 (1.5s), `hero-intro-ar` 190 (6.3s), `drawer-ar-390` 67 (2.2s), `contact-success-en` 68 (2.3s), all 30fps VP9. The old slideshow `.mp4` files are deleted. |
| — | Regression checks | The drawer is still correct (`drawer-open-en-390.png` on the left). Build and all checks pass; the release zip was rebuilt at 05:33 (437 KB). |

## 2. Non-blocking notes 🟡

1. **Lighthouse was not re-run after plan 04.** Making `useReveal` global in `Layout` is unlikely to hurt, but run Lighthouse once on the **live HTTPS site** (see §3) to confirm Performance ≥ 90 and Best Practices = 100.
2. **The transition blade is subtle** because every destination page starts with a blue `PageHero`, so the sweep mostly shows at the lower part of the screen. That is acceptable. If the owner wants it more visible, a later polish could add a short solid `ink` band on the blade's leading edge. Not required.
3. `scripts/test-transitions.js` was committed. That is fine as a dev tool.

## 3. Owner launch checklist (manual — cPanel)

Follow `DEPLOY.md`. Key items:

1. **Mailbox:** confirm or create `Info@Alaryam.ly`.
2. **Email Deliverability:** make SPF and DKIM valid for `alaryam.ly`, so form mail isn't marked as spam.
3. **SSL:** AutoSSL active for `alaryam.ly` and `www.alaryam.ly`.
4. **PHP:** 7.4 or newer.
5. **Upload:** put `release/alaryam-site-20260915.zip` into `public_html/` and extract it (with *Show Hidden Files* on, so `.htaccess` is visible).
6. **Live tests:**
   - `http://alaryam.ly` and `https://www.alaryam.ly` both → `https://alaryam.ly/ar/`
   - an unknown URL → the bilingual 404 page
   - `/sitemap.xml` loads
   - send one real message from `/ar/contact/`, and confirm it arrives in `Info@Alaryam.ly` and is **not** in spam
7. **Checks on the live site:** Lighthouse on `https://alaryam.ly/ar/`, and view it on a real phone (drawer + motion).
8. **Search:** submit the sitemap in Google Search Console.

## ➡️ Next for AG

**No further plan.** Stop here unless the owner reports an issue from the live site.
