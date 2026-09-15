# Message to paste into the implementer (plan 05 — one run)

```
New design change from the owner. Apply it to ALL pages in ONE run.

Project: /Users/zakaria/projects/Claude/Alaryam/ourSite — work ONLY inside this folder.

Read, in this order:
1. ANTIGRAVITY.md — rule 4 was updated (blade overlay replaces View Transitions; hero direction B).
2. plans/05-hero-b-and-blade.md — implement ALL of it (sections 0 to 7) without stopping.

What changes:
- Home hero: no more full-blue block. White page, text on the start side, and a blue panel on the end side whose inner edge is cut at the logo's 61° blade angle (RUN = height × 0.554), with a thin ink stripe parallel to the cut. White logo mark inside the panel. Mirrored in Arabic. Mobile: text first, then a 260px blue block with a cut corner.
- Inner pages (Services, 6 service pages, About, Contact): light PageHero on surface, ink text, plus a slim blue blade slab on the end side (angle kept exact with ResizeObserver).
- Page transition: remove View Transitions completely. Build a GSAP blade overlay: the blue blade + ink leading stripe covers the screen in reading direction (left→right EN, right→left AR), the white mark shows for a moment, the route changes underneath, then the blade exits. Back/forward = no blade. Page intros start when the blade exits.

Keep all rules: side drawer (right in Arabic / left in English), zero gradients, Arabic split by words only, tokens only, no invented facts, React 18, content visible without JS, reduced motion = static.

Prove everything with behavioral evidence (blade counter = 5, 60ms frames in EN and AR, back-button check, hidden-element audit = 0 on all 24 views, CLS < 0.05, real webm recordings). Write summaries/05-hero-b-and-blade.md, run npm run package, commit, and STOP. Do not deploy.
```
