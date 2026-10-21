# Review brief — Digital Skills Radar (رادار المهارات الرقمية) — redevelopment round, 2026-10-21

You are one of several independent senior reviewers (different models, different providers). Your review feeds a lead architect who will decide the redevelopment plan. Be concrete, evidence-based and opinionated. Do NOT write code. Do NOT modify files.

## 1. What the product is
A bilingual (Arabic RTL first, English second) static web platform, React 18 + Vite 5 + TypeScript + Tailwind 3.4 + framer-motion, no backend, all data in local TypeScript files, state in React context + localStorage. It is inspired by the Saudi Digital Government Authority (DGA) GovTech Radar, but maps **human skills** instead of technologies. Organizing question: "How is government work changing, what capabilities do employees and leaders need, and how do we develop them?"

Current scope (v8, built by Kimi over 8 rounds, 2026-10-18 → 10-21):
- Skills self-assessment: 5 audience tracks × 8 skill domains, 40 "I can…" statements (0–4 autonomy scale), 40 professional-judgment scenarios, 40 calibration (knowledge-check) questions; results with a dual radar (current vs role target), gaps ranked by priority, 3 evidence layers (self-report / judgment / knowledge check), 90-day plans (13 weeks), 48 learning resources.
- Explore: 50 careers with WEF/ILO/McKinsey-grounded futures signals, guidance quiz (5 questions), growing/declining lists, "skills vs degree" article, interactive network map (83 nodes, 120 links), 48 govtech technologies on a TRL 1–9 radar, 24 government roles with SFIA 9 codes, 40 versioned skill records, standards/reports page, methodology page, future-skills 2026–2030 trajectories.
- Government data layer (from two official workbooks): 682 Saudi government entities, 485 official logos, 31 sectors, a national enablement-impact dashboard (7,915 training records · 2,873 consulting services · 377 programs · 421 entities, 2021–2026), per-sector skill-demand profiles computed from consulting records, and an entity detail page.
- 19 routed "views" switched by React state (there are NO URLs / no router — every page is the same URL).

Live demo (v8): https://moalomary-ux.github.io/digital-skills-radar/  (GitHub Pages).

## 2. Who owns it and what "best" means here
The owner is a General Manager at the Saudi DGA who leads two teams: Digital Skills (training) and Consulting & Studies. The platform will move to his own domain **omary.me** as his flagship concept demonstration: it must look and behave like a world-class, credible, finished product that a senior government audience can use and trust, while staying explicitly a concept (no official impersonation: DGA-inspired visual theme only, no official logos; "no number without a source"; results are for development planning only, never for selection or promotion).

Hard constraints to respect in every proposal:
- Static hosting, no backend, no data collection (privacy by default). A proposal MAY include an optional, clearly separated backend idea, but the core must stay static.
- Arabic is the primary language with Western digits (1, 2, 3) everywhere; English must stay complete.
- Keep the evidence discipline: every quantitative claim carries a `source` and a confidence badge.
- Keep the DGA-inspired theme family (green #1B8354 / amber #DBA102 / IBM Plex Sans Arabic) but the product may get its own stronger identity within it.

## 3. What has already been reviewed (do not repeat it blindly)
A committee of 8 reviews (career guidance, labor economist, Arabic UX, psychometrics, Saudi labor market, GovTech, Claude, ChatGPT) plus an 18-page external report produced 39 recommendations (P0/P1/P2). All P0 items and most P1 items were applied in v6–v8: confidence indicator fixed, empty-state handling, amber contrast #8A6A00 for text, focus-visible, reduced-motion, government positioning, 5 tracks, judgment scenarios, methodology page, skill registry. Known remaining limitations (documented honestly in the methodology page): scenario items and stage thresholds (1.25/2.25/3.25) are editorial, not field-validated; ISCO-08 codes approximate; Saudi wage/vacancy data absent; tech-radar Arabic translations editorial.

## 4. Your task — produce ONE Markdown document with exactly these sections
### A. Verdict (10 lines max)
Overall score /10 for: product concept · user journey · visual/brand · engineering · content/evidence. One sentence each.

### B. Top 10 weaknesses, ranked by impact on a senior government audience
Each: title · why it matters · evidence (file path + line where possible, or the page/behavior) · fix sketch · effort (S/M/L).

### C. Idea evolution — 6 to 10 proposals that make this a materially stronger product
Think beyond fixes: what would make a Deputy Minister, a CIO, an HR director, and a mid-level employee each say "this is useful to me today"? For each proposal: what it is · who it serves · why it is better than what exists · what data/content it needs · effort (S/M/L) · risk · tag it MUST / SHOULD / WOW. Stay inside the static/no-backend constraint (be creative: client-side team aggregation via shareable codes, printable/PDF reports, entity-level "skills demand" briefs, scenario-based learning, benchmarks, role gap maps, etc. — but propose what YOU think is strongest, not this list).

### D. Information architecture and journey
Propose the navigation structure (max 5–6 top-level items) and the primary journey per persona. Say what to merge, demote, rename or remove from the current 19 views. Be explicit about the Arabic naming.

### E. Engineering review for a static deployment on omary.me
Cover: routing/deep links/back-button/shareable URLs; bundle size and code-splitting (govEntities.ts is ~13,600 lines; 485 PNG logos); data loading strategy; SEO/meta/OG/sitemap/per-page titles; accessibility (keyboard, ARIA, radar charts); RTL correctness; performance budget; PWA/offline; i18n approach; testing strategy for a static site; build/deploy pipeline. Name concrete libraries/approaches and justify.

### F. Content and evidence review
What in the content would embarrass the owner in front of a government audience (wrong, outdated, overclaimed, badly translated, inconsistent Arabic terminology, Eastern vs Western digits, mixed naming)? Give specific examples with locations.

### G. A rebuild plan for an intensive 1–2 day push by AI coding agents
Ordered work packets (max 12). Each: name · scope (files/areas) · acceptance criteria that a reviewer can verify · dependencies · parallelizable? (yes/no).

### H. What NOT to do
Attractive ideas that would hurt credibility, scope or privacy.

Write in English or Arabic, whichever lets you be most precise; Arabic quotes from the product are welcome. Use Western digits. Be specific — file:line references beat generalities. Length: as long as needed, but no padding.
