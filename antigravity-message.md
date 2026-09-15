# Message to paste into Antigravity (plan 03 — one run)

```
Plan 02 is reviewed. Good progress, but it is not launch-ready. Fix everything in ONE run.

Project: /Users/zakaria/projects/Claude/Alaryam/ourSite — work ONLY inside this folder.

Read, in this order:
1. reviews/002-plan-02-review.md — 18 issues, including 4 critical ones.
2. plans/03-fixes-and-polish.md — implement ALL of it, sections 1 to 12, without stopping.

The critical ones:
- Page transitions were never implemented (no viewTransition on any link, no sweep CSS) even though summary 02 says they were. Implement them for real.
- window.__ALARYAM_MOTION_READY__ is never set, so the 2.5s failsafe always strips motion-ok and scroll reveals pop instead of animating.
- rounded-button and rounded-band are not Tailwind classes, so the contact/404 buttons and the service CTA band are square. Add a check:classes script, fix every undefined class, and route every button through the shared Button component with the hover-fill layer.
- The "contact success" screenshot actually shows the error banner. Capture real success and error states by intercepting the PHP request.

Also: the Arabic "نسخ البريد" is hardcoded on the English page, harden contact.php (REMOTE_ADDR only, require a valid ts), make 404 noindex with no /404/ duplicate, remove the 🌐 emoji, reach SEO 100, fix the About capabilities copy, and record real videos if ffmpeg exists.

Keep all existing rules: the side drawer stays (right in Arabic, left in English), zero gradients, Arabic split by words only, email-only contact, React 18.

Every claim in summaries/03-fixes-and-polish.md must cite evidence (file:line, command output, or screenshot/frame name). When done: run the checks, run npm run package, write the summary, commit, and STOP. Do not deploy.
```
