# Message to paste into the implementer (plan 04 — one run)

```
Plan 03 is reviewed: 14 of 18 issues are verified fixed — good work. A few things remain. Finish them in ONE run.

Project: /Users/zakaria/projects/Claude/Alaryam/ourSite — work ONLY inside this folder.

Read, in this order:
1. reviews/003-plan-03-review.md
2. plans/04-final-fixes.md — implement ALL of it (sections 1 to 6) without stopping.

The key points:
- Page transitions STILL don't fire: AppLink passes `unstable_viewTransition`, but react-router-dom 6.30.6 only supports `viewTransition` (grep shows 0 occurrences of unstable_viewTransition in node_modules). Use the real prop, then PROVE it in the browser with the startViewTransition counter and 80ms frames showing the blue blade.
- services-en-1440.png is blank below the hero because full-page screenshots were taken without scrolling. Scroll through before every capture, and add the hidden-element count check — every page must report 0.
- 404.html still has canonical/hreflang pointing to the home page — remove them.
- The .mp4 files are 3fps slideshows of still frames, not recordings. Record real video with Puppeteer screencast, or say plainly that it failed.

Keep all existing rules (side drawer right in Arabic / left in English, zero gradients, Arabic split by words only, email-only contact, React 18).

Every item in summaries/04-final-fixes.md needs behavioral evidence (browser values, frame names, counts, grep outputs, video durations). Then run the checks, npm run package, commit, and STOP. Do not deploy.
```
