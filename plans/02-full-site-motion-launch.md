# 02 — Full Site + Motion System + Launch Package (ONE RUN)

> Read `ANTIGRAVITY.md` (updated), `reviews/001-plan-01-review.md`, and `KNOWLEDGE-content.md` first.
> **Do all of this in one run, in the order below. Do not stop between sections.** Stop only after §10.
> Everything from plan 01 stays unless this plan changes it.

---

## 0. Order of work

1. §1 Review fixes
2. §2 Mobile side drawer
3. §3 Remaining pages (Services, Service detail ×6, About, Contact, 404)
4. §4 Contact endpoint (PHP)
5. §5 SEO
6. §6 Motion system (applied to **every** page)
7. §7 Apache + deploy package
8. §8 Quality checks
9. §9 Screenshots + recordings
10. §10 Summary, commit, STOP

---

## 1. Review fixes (from review 001)

1. `index.html`: remove the static `<title>`. `SeoHead` owns all head tags.
2. `SeoHead`: accept `path` (without the language prefix, e.g. `/about/`) and emit:
   - `canonical` = `https://alaryam.ly/{lang}{path}`
   - `hreflang="ar"` → `/ar{path}`, `hreflang="en"` → `/en{path}`, `x-default` → `/ar{path}`
   - `og:url`, and `og:locale` (`ar_LY` / `en_US`) with `og:locale:alternate`
3. Hidden reveal states must never be in the prerendered HTML (see §6.2).
4. No hex values in components or CSS. Add CSS variables in `:root` generated from the Tailwind tokens (`--brand-600`, etc.). `PeakLines` takes a token name (`"brand-800"`), not hex. `check:hex` (§8) must pass.
5. `en.json`: capitalize the first letter of every sentence (Who we serve, Why AL-ARYAM, and any other `text`).
6. Delete `scripts/lighthouse-report.json`, `scripts/t1.svg`, `scripts/t2.svg`. Gitignore `scripts/*.json` and `scripts/tmp/`.
7. Hero eyebrow pill: solid `brand-700` background instead of `bg-white/10`.
8. Remove `ComingNextPage` and the `comingNext.*` locale keys once §3 replaces the stubs.

## 2. Mobile navigation — SIDE DRAWER (mandatory)

Replace the top dropdown entirely. Below 1024px:

- **Trigger:** the hamburger button, 44×44, `aria-expanded`, `aria-controls="mobile-drawer"`. Its 3 bars morph into an X (GSAP, 350ms).
- **Drawer:** `position: fixed; top: 0; bottom: 0;` on the **inline-start edge** — the **right** edge in Arabic (RTL), the **left** edge in English (LTR). Use `inset-inline-start: 0`.
  - Width `min(85vw, 360px)`, full viewport height (`100dvh`), white, with a 1px `line` border on its inner edge.
  - Closed state: translated fully off-screen toward its own edge (`translateX(100%)` in RTL, `translateX(-100%)` in LTR). **It must never move vertically.**
- **Backdrop:** fixed full-screen `ink` at 55% opacity, fading in and out. Tapping it closes the drawer.
- **Contents, top to bottom:**
  1. Drawer header (72px): Logo (full, blue, 44px high) + close button.
  2. Nav links: 22px/700, 64px rows, with a `brand-600` bar on the start edge for the active link.
  3. Language switch.
  4. Full-width primary `cta.contact` button.
  5. `Info@Alaryam.ly` mailto link, pinned at the bottom.
  6. A small `PeakLines` in `brand-50` at the bottom.
- **Motion:** the drawer slides in over 550ms with `expo.out`. The backdrop fades in over 400ms. Nav links stagger in from the drawer's own edge (x 24px → 0, opacity), 60ms apart, starting 120ms after open. Closing reverses faster (350ms).
- **Behavior:**
  - Closes on backdrop tap, Esc, link click, route change, and resize to ≥1024px.
  - Focus moves to the close button on open, is **trapped** inside while open, and returns to the hamburger on close.
  - Body scroll is locked (and Lenis is stopped) while open.
  - `role="dialog"`, `aria-modal="true"`, `aria-label` = nav label.
- **Swipe:** dragging the drawer toward its edge by more than 80px closes it (pointer events, no library).
- **Screenshot proof:** `drawer-open-ar-390.png` (drawer on the RIGHT) and `drawer-open-en-390.png` (drawer on the LEFT).

## 3. Remaining pages

All copy comes from `KNOWLEDGE-content.md`. Every page uses `Layout` + `SeoHead` + the motion system (§6). Page structure uses the same tokens and rhythm as Home.

### 3.1 Page hero (shared component `PageHero`)
- Solid `brand-600` block, 360px min-height desktop / 280px mobile.
- Breadcrumb (Home › Page), 14px, white at 80% opacity.
- H1 white, lead white.
- `PeakLines` in `brand-800` on the end side.
- Its bottom edge is straight.

### 3.2 Services overview — `/{lang}/services/`
- `PageHero` (`services.pageTitle`, `services.pageLead`).
- **Six large alternating rows** (not the Home card grid). Each row: a big icon tile (96px) plus the number `01`–`06` on one side, and title + `intro` + the first 3 `items` as a check list + a "Learn more" link on the other. Sides alternate per row and mirror correctly in RTL. Rows are divided by 1px `line`.
- Closing CTA band (reuse `CtaBand`).

### 3.3 Service detail — `/{lang}/services/{slug}/` (6 slugs × 2 languages)
- `PageHero` with the service icon (72px, white tile with `brand-600` icon), title and `intro`.
- **What we offer** (`service.whatWeOffer`): all `items` as cards in a 2-column grid, each with a check icon.
- **How we work**: reuse the Home 4-step component.
- **Other services** (`service.otherServices`): the other 5 services as compact cards, horizontally scrollable on mobile with CSS scroll-snap.
- CTA band with `service.ctaTitle` / `service.ctaLead`, button → contact page with `?service={slug}` preselected.
- Prerender all 12 routes (update `includedRoutes` from `servicesData`, not a hand-written list).

### 3.4 About — `/{lang}/about/`
- `PageHero` (`about.pageTitle`, `about.intro`).
- **Vision & Mission:** two large side-by-side blocks. Vision is on `brand-600` with white text; Mission is on `ink` with white text. Each has a big number-free label and the text at lead size.
- **Capabilities:** the two capability blocks from content, each with its bullet list, on `surface`.
- **Values:** reuse the Why AL-ARYAM 2×2 grid.
- CTA band.

### 3.5 Contact — `/{lang}/contact/`
- `PageHero` (`contact.pageTitle`, `contact.lead`).
- Two columns on desktop, stacked on mobile:
  - **Start column:** email card with the `Mail` icon tile, `contact.emailLabel`, and a large `Info@Alaryam.ly` mailto link, plus a "copy email" icon button (copies to the clipboard and shows a checkmark for 1.5s). Below it, a quiet `PeakLines`.
  - **End column:** the form card.
- **Form fields:** name*, email*, organization, service (select: the 6 services + `form.serviceOther`; preselected from `?service=`), message* (textarea, min 10 chars).
  - **Hidden fields:** honeypot `website` (visually hidden, `tabindex=-1`, `autocomplete="off"`) and `ts` (render timestamp).
- **Floating labels:** the label sits inside the field and animates up on focus or when filled (transform only).
- **Validation:** client-side on blur and on submit, with messages from `form.*` shown under the field. The invalid field shakes once (x ±6px, 300ms, disabled under reduced motion).
- **Submit:** `POST /api/contact.php` with JSON.
  - The button shows `form.sending` with a spinner while sending.
  - **Success:** the form card cross-fades to a success panel with an animated check mark (DrawSVG), `form.success`, and a "send another" link.
  - **Error:** an inline `form.error` banner.
- **Dev mode** (`import.meta.env.DEV`): no PHP locally, so simulate a 900ms delay and success, and log the payload.

### 3.6 404
- Prerender `dist/404.html` (bilingual: Arabic first, English below, both linking home).
- The big "404" with the logo triangle mark drawn in (DrawSVG), `notFound.*` copy.
- The `*` route renders the same component client-side.

## 4. Contact endpoint — `public/api/contact.php`

PHP 7.4+ compatible, no Composer, a single file.

- Accept `POST` only (405 otherwise) and `Content-Type: application/json`. Max body 10KB.
- Decode JSON, trim all fields, and enforce max lengths (name 100, email 254, organization 150, service 60, message 5000). Validate the email with `filter_var(FILTER_VALIDATE_EMAIL)`. The service must be one of the 6 slugs or `other`.
- **Spam:**
  - If the honeypot is non-empty → respond `200 {ok:true}` and send nothing.
  - If `ts` is less than 3 seconds ago → same.
  - **Rate limit:** 5 requests per IP per hour, stored as small JSON files in `sys_get_temp_dir() . '/alaryam_rl/'`.
- **Header injection:** strip `\r` and `\n` from name, email and service before using them in headers.
- **Mail:** `mail()` to `Info@Alaryam.ly`.
  - `From: AL-ARYAM Website <no-reply@alaryam.ly>`, `Reply-To:` the visitor's email.
  - `Content-Type: text/plain; charset=UTF-8`, and the subject encoded with `mb_encode_mimeheader` (`رسالة جديدة من الموقع — {name}`).
  - The body lists all fields plus the language, date/time (Africa/Tripoli), IP and user agent.
- **Response:** JSON `{ok: true}` or `{ok: false, error: "validation" | "rate_limit" | "server"}` with the matching HTTP code. Never echo PHP errors (`display_errors=0`).
- **Same-origin only:** no CORS headers.
- If `php` is available locally, run `php -l public/api/contact.php`. If not, say so in the summary.

## 5. SEO

- **Every page:** unique title and description (from `KNOWLEDGE-content.md` → SEO), canonical, hreflang (§1.2), OG/Twitter tags, and `og:image`.
- **`public/sitemap.xml`:** generated at build time from the route list. All 20 localized URLs, each with `xhtml:link` alternates for ar/en/x-default. Keep the existing `robots.txt`.
- **JSON-LD on Home:** `Organization` with name (both languages via `alternateName`), url, logo (`https://alaryam.ly/brand/logo-full-blue.svg`), email, `areaServed: "LY"`. **No phone, address or social links.**
- **Service detail pages:** `Service` JSON-LD with `provider` = the Organization, plus `BreadcrumbList`.
- **One `h1` per page,** logical heading order, and descriptive link text.

## 6. Motion system

The goal is a site that feels premium and alive, where the motion has meaning (the logo's triangle, drawing, rising, precision), yet it stays fast and accessible. **All effects below are required.**

### 6.1 Libraries & structure
- Install: `gsap` (includes ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase — all free), `@gsap/react` (`useGSAP`), `lenis`.
- Keep React 18 and react-router 6.30 (it supports the `viewTransition` prop). **Do not upgrade React.**
- Folder `src/motion/`:
  - `gsap.ts` — registers plugins once and defines custom eases.
  - `tokens.ts` — durations and eases.
  - `useReveal.ts`, `useSplitHeading.ts`, `useMagnetic.ts`, `useTilt.ts`, `useCountUp.ts`, `useParallax.ts`
  - `SmoothScroll.tsx` — Lenis provider.
  - `PageTransition.css`
- All GSAP code runs only on the client, inside `useGSAP` with a `scope` ref so everything is reverted on unmount. **Never touch `window`/`document` during SSG render.**
- Load motion code after first paint: HTML and CSS must not wait for GSAP.

### 6.2 No-JS safety (fixes review issue #4)
- An inline script in the head (before CSS paint) adds `class="js"` to `<html>`, plus `motion-ok` when `matchMedia('(prefers-reduced-motion: no-preference)')` matches.
- Initial hidden states exist **only** under `html.motion-ok [data-reveal] { … }`.
- **Failsafe:** if the motion bundle has not initialised within 2.5s, remove `motion-ok` so all content shows.
- Prerendered HTML must show every piece of content with JS disabled. Verify by opening a page with JS disabled and screenshotting it.

### 6.3 Tokens
| Token | Value |
|---|---|
| ease `brand` | `CustomEase.create("brand", "0.16, 1, 0.3, 1")` (expo-out feel) |
| ease `brandInOut` | `"0.76, 0, 0.24, 1"` |
| durations | `xs 0.2` · `sm 0.35` · `md 0.6` · `lg 0.9` · `xl 1.2` (seconds) |
| stagger | `0.06` words · `0.08` cards · `0.12` sections |
| reveal distance | `40px` desktop, `24px` mobile |

### 6.4 Global effects

1. **Smooth scroll (Lenis).**
   - **When:** desktop only (`(pointer: fine) and (min-width: 1024px)`). Off for touch devices and reduced motion.
   - **Setup:** `lerp: 0.1`, synced to `gsap.ticker`, with `ScrollTrigger.update` on scroll.
   - **Behavior:** scroll to top on route change, respect `data-lenis-prevent` on horizontal scrollers, and stop while the drawer is open.
2. **Page transitions (View Transitions API).**
   - All internal `Link`/`NavLink` get `viewTransition`.
   - **Effect:** a solid `brand-600` panel sweeps across the screen in the **reading direction** (right→left in Arabic, left→right in English). Its leading edge is slanted at the logo's blade angle (~61°, via `clip-path: polygon`). The old page fades and shifts 40px against the sweep; the new page's hero rises in.
   - **Timing:** total ≤ 900ms.
   - **Header:** has `view-transition-name: site-header` so it stays put.
   - **Fallback:** browsers without support just navigate. No JS fallback needed.
3. **Header.**
   - Hides (`yPercent: -100`) when scrolling down past 120px and reappears on scroll up.
   - Its shadow fades in after 8px.
   - The active nav underline slides between links (one shared underline element that animates `x`/`width`).
4. **Scroll progress bar:** a 2px `brand-600` bar at the very top of the header, scaled on X with scroll progress (`transform-origin` = start side).
5. **Link hover:** text links get an underline that grows from the start side (scaleX, 350ms).
6. **Buttons.**
   - **Magnetic** (desktop, fine pointer): the button translates up to 8px toward the cursor, the label 4px, and both spring back on leave (`gsap.quickTo`, 0.4s, `elastic.out(1, 0.4)`).
   - **Hover fill:** a solid inner layer slides in from the start side (primary: `brand-700`; on-blue secondary: white with text turning `brand-600`).
   - **Press:** scale 0.97.
7. **Cursor-aware card tilt** (desktop, fine pointer): cards rotate up to **5°** on X/Y toward the pointer with `transformPerspective: 900`. The icon tile lifts 8px (translateZ illusion via `y`), and the "Learn more" arrow slides 6px in the reading direction. Everything resets on leave. No glow and no shine overlay.
8. **Section reveal:** `ScrollTrigger.batch` on `[data-reveal]` — elements rise from 40px with opacity 0→1 over `md`, staggered `0.08`, starting at `top 85%`, once.
9. **Headings:** every H1 and H2 uses SplitText with a line mask; words rise from 100% inside their line mask, staggered `0.06`, over `lg`.
   - **ARABIC: split by `words` ONLY — never `chars`** (splitting characters breaks Arabic letter joining). English uses `words` too, for consistency.
   - Use `autoSplit: true` + `onSplit` so it re-splits after font load and resize. Revert the split on unmount.
   - Screen readers must get the unsplit text (SplitText's built-in aria handling).
10. **Images and icon tiles:** a clip-path reveal from the start side (`inset(0 100% 0 0)` → `inset(0)`, mirrored in RTL) over `lg`.
11. **`PeakLines` everywhere:** strokes draw in with DrawSVG (`0%` → `100%`), staggered `0.1`, when they enter the viewport. Where the plan calls it "background", add slow scroll parallax (`yPercent` −15 → 15, scrub).
12. **Reduced motion** (`gsap.matchMedia`): all of the above is disabled. Content is visible at once, page transitions become a 150ms fade (or none), the drawer opens with a plain fade, and Lenis is off.
13. **Touch devices:** no tilt, no magnetic, no Lenis, no pointer parallax. Reveals, headings, DrawSVG and page transitions stay on, with a shorter reveal distance (24px).

### 6.5 Home-specific choreography
1. **Hero intro** (on first load and on each visit to Home):
   - 0.0s — the blue hero block is already painted (no preloader, no blank screen).
   - 0.1s — the logo triangle mark (`mark-white.svg`, **inlined as SVG** for this effect) draws its outline (stroke = white, DrawSVG 0→100%, `xl`), then the fill fades in (`md`) and the stroke fades out.
   - 0.3s — the horizontal rule under the mark grows from the center outward (scaleX, `lg`).
   - 0.35s — eyebrow fades up, H1 words rise (split, §6.4.9), then the lead fades up, then the buttons pop in (y 16 → 0, stagger `0.1`).
   - Throughout: `PeakLines` behind the mark draw in, staggered.
   - Everything is finished by **1.8s**. The H1 must be readable by 0.9s (LCP).
2. **Hero pointer parallax** (desktop): the mark follows the pointer by up to 12px, `PeakLines` by −20px (the opposite direction, for depth), using `quickTo` with 0.8s smoothing.
3. **Hero scroll-out:** as the user scrolls past the hero, the mark moves up 60px and scales to 0.92, and the text block moves up 30px with opacity 1 → 0.4 (scrub).
4. **Services grid:** cards reveal in a diagonal stagger (by row and column index) and have tilt (§6.4.7).
5. **How we work:**
   - The connector line **draws with scroll** (scaleX 0→1 from the start side, scrub, pinned-free).
   - Each number counts up from `00` to its value when reached (`useCountUp`, `md`). Its step content reveals as the line passes it.
   - On mobile the connector is vertical along the start edge and draws top→bottom.
6. **Who we serve:** cards slide in from the end side toward the start, staggered.
7. **Why AL-ARYAM:**
   - Desktop: the H2 column is **pinned** (ScrollTrigger pin, not CSS sticky, so it works with Lenis) while the 4 items scroll past. Each item's icon tile rotates in from −12° and settles.
   - Mobile: no pin, just reveals.
8. **CTA band:** the band scales from 0.94 → 1 and its corner radius eases from 48px → 24px as it enters (scrub). `PeakLines` draw in, and the button is magnetic.
9. **Footer:** `PeakLines` draw in, and the columns reveal staggered.

### 6.6 Other pages
- **`PageHero`:** breadcrumb fades in, H1 words rise, lead fades up, `PeakLines` draw in (≤1.2s).
- **Services overview rows:** icon tile clip-reveals from its side, the number counts up, and the text block slides 40px from the opposite side. Rows alternate direction.
- **Service detail:** item cards reveal staggered with tilt. The Other services strip gets drag-to-scroll on desktop (pointer drag with momentum, `data-lenis-prevent`).
- **About:**
  - Vision and Mission blocks enter from opposite sides and meet (scrub).
  - Capability list items check in one by one: the check icon draws with DrawSVG, then the text fades in.
- **Contact:** the form card rises in, and fields reveal staggered. Floating labels, the invalid shake and the success check draw are as in §3.5. The copy-email button morphs its icon from copy → check.
- **404:** the triangle mark draws in and "404" digits rise.

### 6.7 Performance rules (non-negotiable)
- Animate **only** `transform`, `opacity`, `clip-path`, and SVG `stroke-dashoffset` (through DrawSVG). Never width/height/top/left/margin.
- `will-change` only during an animation (let GSAP handle it). No permanent `will-change`.
- Call `ScrollTrigger.refresh()` after fonts load (`document.fonts.ready`), after language switch, and after route change.
- Kill and revert all triggers and splits on unmount (`useGSAP` scope). No duplicated triggers after navigating back and forth (verify: navigate Home → About → Home 5 times, then log `ScrollTrigger.getAll().length` — it must be stable).
- **Targets:** Lighthouse desktop on `/ar/` — Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100. Mobile Performance ≥ 80. CLS < 0.05 (animations must not shift layout). INP good.

### 6.8 Hard bans (still)
Gradients of any kind, glassmorphism/backdrop blur, glow or neon, particles, confetti, typing/typewriter effects, 3D WebGL scenes, custom cursor replacements, autoplaying video, scroll-jacking that changes scroll speed beyond Lenis, and preloaders that hide the page.

## 7. Apache + deploy package

1. `public/.htaccess` (copied into `dist/`):
   - Force HTTPS and non-www → `https://alaryam.ly` (301).
   - `DirectoryIndex index.html`.
   - Exact `/` → `/ar/` (301).
   - Add a trailing slash to extensionless paths that match a directory.
   - `ErrorDocument 404 /404.html`.
   - Caching: `assets/*` (hashed) `Cache-Control: public, max-age=31536000, immutable`; HTML `no-cache`; images/fonts 30 days.
   - `mod_deflate` compression for html/css/js/svg/json/xml.
   - Security headers: `X-Content-Type-Options nosniff`, `Referrer-Policy strict-origin-when-cross-origin`, `X-Frame-Options SAMEORIGIN`, `Permissions-Policy camera=(), microphone=(), geolocation=()`.
   - Deny direct access to dotfiles except `.well-known`.
2. `npm run package`: runs build + all checks, then zips `dist/` contents (including `.htaccess` and `api/contact.php`) to `release/alaryam-site-YYYYMMDD.zip`. Gitignore `release/`.
3. `DEPLOY.md` (English, short, step by step for cPanel):
   - Create or confirm the mailbox `Info@Alaryam.ly`.
   - Enable AutoSSL.
   - Upload the zip to `public_html/` and extract.
   - Confirm PHP ≥ 7.4 and that `mail()` works.
   - Test the form (valid, invalid, honeypot).
   - Check `https://alaryam.ly/` → `/ar/` redirect, 404 page, and `sitemap.xml`.
   - Submit the sitemap to Google Search Console.
   - Add SPF/DKIM for `alaryam.ly` in cPanel Email Deliverability so the form's mail is not marked as spam.

## 8. Quality checks (all must pass — paste outputs in the summary)

- `npm run build` — zero TS errors. `dist/` contains all 20 localized pages + `/index.html` + `404.html` + `sitemap.xml` + `.htaccess` + `api/contact.php`.
- Every page's HTML contains its full copy (grep one unique string per page per language).
- `npm run check:gradients` — clean. Also extend it to catch `backdrop-blur`, `blur-`, `drop-shadow-` glow utilities, and `filter: blur`.
- `npm run check:i18n` — passes.
- New `npm run check:hex` — no `#[0-9a-f]{3,8}` in `src/**/*.tsx` or `src/**/*.ts` (tokens live only in `tailwind.config.ts` and the generated CSS variables).
- New `npm run check:links` — crawl `dist/` HTML and verify every internal `href` resolves to a file.
- `hreflang` on `/en/services/iot/` points to `/ar/services/iot/` (paste the tags).
- JS disabled: every page shows all content (screenshot `nojs-home-ar-1440.png`).
- Reduced motion (emulate `prefers-reduced-motion: reduce`): no movement, content visible (screenshot `reduced-motion-home-en-1440.png`).
- Drawer: opens from the RIGHT in Arabic and the LEFT in English, traps focus, closes on Esc, backdrop tap and swipe.
- ScrollTrigger count stable after 5 round-trip navigations (paste the numbers).
- No horizontal scroll at 360px on every page, in both languages.
- Lighthouse scores per §6.7 for `/ar/`, `/en/services/`, `/ar/contact/` (desktop + mobile).
- `php -l` result, or a note that PHP is unavailable locally.

## 9. Screenshots + recordings → `summaries/screenshots/02/`

- **Full-page at 1440 and 390, both languages:** home, services, `services/software-development`, about, contact, 404 → 24 files (`{page}-{lang}-{width}.png`).
- `drawer-open-ar-390.png`, `drawer-open-en-390.png`
- `contact-validation-ar-390.png`, `contact-success-en-1440.png`
- `nojs-home-ar-1440.png`, `reduced-motion-home-en-1440.png`
- **Screen recordings** (`.mp4` or `.webm`, 8–15s each, 1440 wide) of:
  - Home hero intro + scroll down through all sections (ar)
  - Page transition Home → Services → Service detail (en)
  - Mobile drawer open/close (ar, 390)
  - Card tilt + magnetic button hover (en)
  - Contact form submit → success (ar)

  If recording is not possible, capture a 6-frame sequence per item instead and say so.

## 10. Summary, commit, STOP

`summaries/02-full-site-motion-launch.md` must cover:
- Each section of this plan: done / deviations and why.
- File tree of `src/`.
- All §8 outputs and scores.
- Package versions (gsap, lenis, @gsap/react).
- The zip filename and size.
- Any `TODO-COPY`.
- Known limitations.

Commit in logical commits (fixes → drawer → pages → contact → SEO → motion → deploy), or one commit if you prefer, with a clear message.

## 🛑 STOP
The site is complete. Wait for the owner's review. Do not deploy to the server.
