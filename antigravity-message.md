# Message to paste into Antigravity (plan 02 — one run)

```
Plan 01 is reviewed and approved as the base. The scope has changed: finish the whole site in ONE run.

Project: /Users/zakaria/projects/Claude/Alaryam/ourSite — work ONLY inside this folder.

Read, in this order:
1. ANTIGRAVITY.md — it has been UPDATED (new motion rules, mobile side-drawer rule, one-run rule). Read it fully again.
2. reviews/001-plan-01-review.md — the issues to fix.
3. plans/00-overall.md — updated roadmap.
4. plans/02-full-site-motion-launch.md — implement ALL of it, end to end, in the order of its section 0. Do not stop between sections.

Critical points:
- Mobile menu is a SIDE DRAWER: it slides in from the RIGHT in Arabic and from the LEFT in English, full height, with a backdrop. It must never drop down from the top. Your current Header.tsx dropdown must be replaced.
- Motion must be premium on every page (GSAP + ScrollTrigger + SplitText + DrawSVG + Lenis + View Transitions), exactly as specified in plan 02 section 6 — but content must stay visible without JS, everything must turn off under prefers-reduced-motion, and Arabic text is split by WORDS only, never characters.
- Still zero gradients, no glassmorphism/glow/particles, no invented facts, email-only contact (Info@Alaryam.ly), copy verbatim from KNOWLEDGE-content.md, keep React 18.

When everything is done: run every check in section 8, save the screenshots and recordings in section 9, write summaries/02-full-site-motion-launch.md, commit, and STOP. Do not deploy.
```
