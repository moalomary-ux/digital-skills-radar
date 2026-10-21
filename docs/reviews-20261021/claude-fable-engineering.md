# Digital Skills Radar (رادار المهارات الرقمية) — Independent engineering review

Reviewer: Claude Fable 5.1 (senior front-end / static-deployment engineering) · Date: 2026-10-21
Scope: repo at `…/DIGITAL-SKILLS-RADAR-20261021/repo` (commit `a7cf614`, v8), handover doc, prior 8-review synthesis, live demo.
Method: full read of `store.tsx`, `App.tsx`, `main.tsx`, `index.html`, `index.css`, every file in `src/views/` and `src/components/`, the structure of every `src/data/*.ts`, and `docs/handover/*`; TypeScript-AST check of JSX nesting; served the prebuilt `dist/` with `vite preview` and drove the real UI with scripted clicks in Chromium (desktop 800 px and mobile 375 px); compared the live GitHub Pages bundle hash with the local build. No file in the repo was modified.

Measured facts used below (all measured today, not taken from the handover):

| Fact | Value |
|---|---|
| JS bundle `dist/assets/index-gLuaTt7U.js` | 1,628,179 bytes raw (1,352,043 characters — the "1,352 kB" in the build log counts characters; Arabic is 2 bytes/char in UTF-8: 272,088 Arabic code points ≈ 544 KB) · 411,210 B gzip · 313,617 B brotli |
| Live demo bundle | identical hash `index-gLuaTt7U.js`, 425,351 B transferred (gzip) → the live site has exactly the defects found locally |
| CSS | 38,124 B (7,345 B gzip) |
| Data share of bundle | `src/data/*.ts` = 1,317,762 B of source ≈ 81% of bundle bytes (`govEntities.ts` 412,002 · `careers.ts` 283,467 · `scenarios.ts` 97,512 · `learning.ts` 80,706 · `technologies.ts` 80,426 · `govEntityDetails.ts` 73,028) |
| Logos | 485 PNG, 5,527,308 B total, median 9,551 B, p90 19,678 B, max 38,781 B, all 150 px wide, opaque RGB |
| Web fonts | 9 requests ≈ 194 KB from fonts.googleapis/gstatic; `Inter` is requested in `index.html:11` but never used (not in `tailwind.config.js` `fontFamily`) |
| Navigation | `history.length` stayed at 4 across 5 in-app view changes → the browser Back button leaves the site |
| Directory first paint | 1,248 DOM nodes, 18 `<img>` in DOM, only 4 logo requests (lazy loading works) |
| Tooling | no ESLint config, no tests except `scripts/levels.selftest.mjs`, no CI, no README in repo, no favicon/manifest/robots/sitemap in `public/` (only `logos/`) |

---

## A. Verdict

- **Product concept — 8/10.** Mapping human capabilities (not technologies) onto a GovTech-radar idiom, with three evidence layers and real service records per sector, is a genuinely strong and distinctive concept for a DGA-adjacent audience.
- **User journey — 3/10.** The core journey is broken in v8: the assessment cannot be completed at all (the professional-judgment stage never renders — verified live), three entry points skip the mandatory track step and dead-end at domain 8, and there are no URLs so Back exits the site and nothing is shareable.
- **Visual / brand — 7/10.** The DGA-inspired system (green/amber, IBM Plex Sans Arabic, 4 px buttons, 16 px cards) is coherent and restrained; it is let down by RTL number rendering ("1.2+"), unreadable Arabic bar-chart labels on the Impact page, hover-only affordances, and a 19-item mobile nav strip.
- **Engineering — 4/10.** Clean TypeScript and a sensible bilingual `L {ar,en}` model, but: one 1.63 MB chunk that ships 682 entities to every visitor, no router, no code-splitting, no error boundary, unvalidated localStorage schema, no tests/lint/CI, hard-coded GitHub Pages base path, external render-blocking fonts.
- **Content / evidence — 7/10.** The provenance discipline (sources, confidence badges, declared thresholds, documented workbook discrepancy) is above the bar; credibility leaks come from internal inconsistencies (20 vs 24 roles, 30 vs 50 careers, 24 vs 40 questions, a "violet" polygon that is amber), a tautological results headline, Arabic number-agreement errors in 127 generated strings, and a footer/meta description that still describes a career-guidance site.

Bottom line: do not move v8 to omary.me as-is. One afternoon of fixes removes the blockers; a focused 1–2 day rebuild (section G) gets routing, splitting, SEO, RTL and accessibility to a flagship standard without changing the stack.

---

## B. Top 10 weaknesses (ranked by impact on a senior government audience)

| # | Weakness | Why it matters | Evidence | Fix sketch | Effort |
|---|---|---|---|---|---|
| 1 | **The assessment cannot be finished.** After domain 8 the "مرحلة مواقف الحكم المهني" step shows only the progress label «موقف حكم 1 من 8 · 100%» and a "إعادة البدء من الصفر" link. No scenario, no Next, no Finish → Results/Pathways are unreachable for every real user. | The flagship demo's main promise fails in front of anyone who tries it. | `src/views/Wizard.tsx:216` opens `{step >= 1 && domain && (…)}`; the scenario block `{step >= SCENARIO_BASE && scenario && (…)}` at `:343` sits **inside** that block (inside the calibration `<AnimatePresence>` at `:289`, see AST dump). At step ≥ 9 `domain` is `null` (`:52`), so the whole subtree, including the scenario stage, is skipped. Verified live on the built `dist/` (screenshot: blank page, single button) and the live demo serves the same bundle hash. | Move the scenario block out to be a sibling of the domain block under the outer `<AnimatePresence>` (`:121`), and close the calibration wrapper properly. Add a Playwright test that completes the journey in both languages. | S |
| 2 | **Three entry points skip the track step and strand the user at domain 8.** Home "موظف حكومي", a career card and a role card call `setRoleId(...)` then `go('wizard')`; the Wizard initializes `step = roleId ? 1 : 0`, so the track screen is never shown, `trackScenarios` is empty, and the domain-8 button is disabled with no explanation. | Second dead end on the main journey, hits the most important persona (government employee). | `Home.tsx:21-24`, `Careers.tsx:69-72`, `Roles.tsx:15-18`, `GovSectors.tsx:43-46` (sets track only), `Wizard.tsx:40`, `:473-476` (`disabled={!domainDone || trackScenarios.length === 0}`). | Initialize `step` from `(roleId && trackId) ? 1 : 0`; when a track is missing at domain 8, route to step 0 with an inline message. | S |
| 3 | **No URLs at all.** 19 views share one URL; Back exits the site; nothing (a result, an entity, a sector, a career) can be linked, bookmarked, printed with a reference, or indexed. | A Deputy Minister cannot be sent "the Ministry of Health page"; the owner cannot put a deep link in a deck; search engines see one empty page. | `store.tsx:138-141` (`go` only sets state), `App.tsx:40-58`, `pending*Id` plumbing in `store.tsx:116-120`, `EntityDetail.tsx:18` (`pendingEntityId` lost on reload → "لم تُحدَّد جهة"). `history.length` constant across navigation (measured). | React Router v7 library mode, route-per-view, params for entity/sector/career/tech/role/skill, `ScrollRestoration`, per-route titles; see E.1. | M |
| 4 | **One 1.63 MB chunk for every visitor.** A first-time employee who only wants the assessment downloads all 682 entities, 485 logo paths, 50 careers, 48 technologies and the whole consulting matrix before the first paint. | Slow first load on mobile/4G in a training room; wasteful; makes future data growth linear in page weight. | `vite.config.ts` (no `manualChunks`), `App.tsx:5-23` (static imports of all 19 views), `src/data/govEntities.ts` 13,629 lines imported by `Directory.tsx:4`, `EntityDetail.tsx:3`, `GovSectors.tsx:5`, `sectorSkills.ts:6`. Measured: 411 KB gzip, 81% data. | Route-level `lazy()`, data files as dynamic-import chunks, `LazyMotion` for framer-motion, vendor split; budget in E.2. | M |
| 5 | **Impact page bar charts are unreadable in Arabic.** Entity names and category labels render on top of the bars (only tail characters visible), because the `<svg>` inherits `direction: rtl` while the chart geometry assumes LTR `text-anchor`. | This is the page a CIO or HR director will screenshot; it currently looks broken. | `Impact.tsx:49-51` (`textAnchor="end"` at `x = labelW - 10`) and `:63-66`; measured on the built page: label box spans x = 132…204 while bars start at x = 138 (SVG width 419); screenshot of «أعلى 10 جهات استفادة» shows clipped names. | Set `direction="ltr"` on chart SVGs and lay out explicitly for RTL (labels on the right, bars growing right-to-left), or render labels as HTML beside the SVG. Shared `HBarChart` component with an `rtl` prop. | S |
| 6 | **Numbers flip in RTL text.** Gap values render as "1.2+" instead of "+1.2"; deltas likewise. The earlier UX review flagged this class (P0-7) and it is back in new code. | Senior Arabic readers notice; it undermines the "no number without discipline" message. | `Results.tsx:416` (`+${g.gap.toFixed(1)}` inside an RTL span), `:401-402` (delta), `Wizard.tsx:110` (`{progress}%` fine only because `font-mono`), verified in screenshot of Results. | A `<Num>` component (`<bdi dir="ltr">`) used for every numeric token; lint rule/grep in tests. | S |
| 7 | **Hover-only interactions.** The "أدوات متخصصة" menu opens on hover/focus-within only (no click handler, no `aria-expanded`, no Escape); radar vertex tooltips, network-map tooltips and career-card quick views are `onMouseEnter` only. On an iPad in landscape (1366 px ≥ `xl`) the desktop nav shows and Safari does not focus buttons on tap → 10 pages unreachable from the header. | Executives use iPads; keyboard/screen-reader users get no equivalent. | `Header.tsx:85-108`, `RadarChart.tsx:225-258`, `NetworkMap.tsx:339-340`, `Careers.tsx:179-195` (`group-hover` quick view), `TechRadarChart.tsx:187-188`. | Radix `DropdownMenu`/`NavigationMenu`; click + keyboard handlers on chart nodes (`tabIndex`, `onFocus`); visible "details" buttons instead of hover reveals. | M |
| 8 | **Internal inconsistencies that a careful reader catches in minutes.** "20 دورًا" vs 24 roles; "المهن الثلاثون" vs 50 careers; "24 سؤال تحقق" vs 40; "المضلع البنفسجي" (the target polygon is amber); results headline says the key skill of «التقنيات الناشئة» is «التقنيات الناشئة»; footer and `<meta description>` still say "منصة إرشاد مهني"; "جامعي إلزامي" shown for careers whose degree text says "غير مطلوبة". | Credibility is the product; each inconsistency is a reason to distrust the numbers. | `Wizard.tsx:173`, `Roles.tsx:30-31`, `Methodology.tsx:21,83,90`, `Home.tsx:30` (says 24), `Wizard.tsx:134-135`, `Results.tsx:227-228` (uses `shortName` as "المهارة الأهم"; verified rendering), `Footer.tsx:58`, `index.html:6`, `Careers.tsx:192` with `careers.ts:1233,1276`. | Content-consistency packet with data-driven counts (`libraryRoles.length`, etc.) and a data-integrity test suite (E.9). | S |
| 9 | **No SEO, metadata or install surface.** Static `<title>`, no OG/Twitter cards, no canonical/hreflang, no sitemap/robots, no favicon, no manifest/theme-color, no `<noscript>`, render-blocking Google Fonts (9 requests, 194 KB, one family unused). | On omary.me the link preview in WhatsApp/LinkedIn will be blank; Google indexes one page; the tab shows a blank favicon. | `index.html:1-20`, `public/` contains only `logos/`, `dist/` has `assets/`, `index.html`, `logos/` only. | Prerender per route, metadata per route, self-hosted subset fonts, sitemap from route table, OG image set; E.3–E.4. | S–M |
| 10 | **No safety net.** No error boundary (any runtime error blanks the whole app), localStorage records are parsed without schema/version checks, `AnimatePresence mode="wait"` remounts every view (filters and scroll lost; in background tabs the transition stalls and the page stays blank until focused — observed), no lint, one unit test, no CI, GitHub Pages base path hard-coded. | A flagship site needs to fail gracefully and be re-deployable by anyone. | `main.tsx:7-13`, `store.tsx:90-97` (`load` trusts JSON shape), `App.tsx:32-60`, `vite.config.ts:6`, `package.json` (no lint/test scripts). | Error boundary per route, versioned LS keys with guards, drop `mode="wait"` (or scope animation to content), ESLint + Vitest + Playwright + GitHub Actions, `base` from env; E.9–E.10. | M |

---

## C. Idea evolution — proposals that make this materially stronger (static, no backend)

| # | Proposal | Who it serves | Why better than today | Data/content needed | Effort | Risk | Tag |
|---|---|---|---|---|---|---|---|
| C1 | **Shareable, printable result link.** Encode a `ResultRecord` (8 self scores × 2 decimals, 8 judgment scores, 8 knowledge counts, role id, track id, date) into ~60 base64url characters in the URL (`/results?r=…`), with a QR on the print layout. Opening the link renders the radar for a manager or coach without any server. | Employee, line manager, HR | Today results live only in one browser; the "discuss it with your manager" advice has no mechanism. | None new; a compact codec + A4 print stylesheet. | S | Over-sharing of personal results → keep the disclaimer in the link page; no names in the payload. | MUST |
| C2 | **Entity brief («موجز الجهة») as a first-class page with a URL and a print layout.** One A4: logo, classification, service record, yearly training bars, derived skill-demand profile, the 3 recommended development pathways and national programs. | Deputy Minister, CIO, HR director | The entity page exists but is unreachable by link and not printable; the brief is the artefact executives actually carry into meetings. | Existing `govEntities`, `govEntityDetails`, `sectorSkills`; a mapping from top domains to `learningResources`. | S–M | Publishing entity-level service counts on a personal domain is a governance decision (see H). | MUST |
| C3 | **Team view without a backend («لوحة الفريق»).** A manager opens `/team`, pastes 3–30 result codes (from C1), and gets a team radar (median, spread), a gap heatmap per domain, and a team 90-day plan; export CSV/PDF. Nothing leaves the browser. | Team leads, HR, training planners | Turns individual self-reflection into a planning tool the DGA training team can use in a workshop. | C1 codec; aggregation rules (median, IQR) documented on the methodology page. | M | Misuse for ranking individuals → show aggregates only, hide per-person rows by default, keep the "development only" banner. | WOW |
| C4 | **Role passport («جواز الدور»).** `/roles/:id` becomes a full page: SFIA codes, target polygon, the 90-day plan template for each gap level, the matching national programs, and the scenarios of that role's track. Deep-linkable from HR job descriptions. | Specialists, HR | The role library is a modal today; a page with a URL is what an HR director will paste into a job ad or a development plan. | Existing `roleLibrary`, `learning`, `scenarios`. | S | None. | SHOULD |
| C5 | **Daily judgment drill («موقف اليوم»).** Reuse the 40 scenarios as a standalone 2-minute drill (`/drill`), deterministic by date so a whole team sees the same scenario on the same day, with the rationale and the linked skill record. | Every employee | Converts the best content in the product (scenarios) into a habit-forming surface instead of a one-time stage. | Existing scenarios; a date→scenario rule. | S | Scenario bank is only 40 items → add "already seen" tracking in LS. | SHOULD |
| C6 | **Sector benchmark («القطاع مقابل الوطن»).** On `/sectors/:id`, show the sector's consulting-category mix against the national mix (two small bars per category), the derived domains, and the top-5 entities; an "insight sentence" that is computed, not written. | CIO, sector planners, DGA consulting team | Today the sector detail shows its own profile only; the comparison is what makes the number meaningful. | `sectorCategoryTotals` + `consultingCategories` (already in the bundle). | S | Small sectors (n < 5 entities) → suppress percentages below a threshold and say so. | SHOULD |
| C7 | **Executive briefing mode.** `/brief`: one screen with 3 numbers, 3 charts and 1 call to action, arrow-key paging, full-screen toggle, no header; designed to be projected in a meeting. | Deputy Minister, GM | The product has excellent material scattered over 19 views; executives need the 90-second version. | Existing KPIs; a curated order. | S | Over-claiming → every number carries its source badge as elsewhere. | WOW |
| C8 | **Open data & methodology bundle.** `/data`: downloadable JSON/CSV of the derived datasets (sector × category, category → domain weights, skill registry, role targets, tech radar) with version, date and SHA-256, plus a changelog feed. | Analysts, academics, DGA teams | "No number without a source" becomes auditable; the owner can cite the dataset in a study. | Build-time export of existing TS data. | S | Entity-level records → export sector-level aggregates publicly, entity-level only if the owner approves (H). | SHOULD |
| C9 | **Skills passport (import/export).** Export the local history as a signed-looking JSON (no real signing; a checksum) and import it on another device; add "retake after 90 days" reminder via an `.ics` calendar file download. | Employees | Fixes the single-device limitation of localStorage without any server. | None. | S | None. | SHOULD |
| C10 | **Optional, clearly separated: anonymous counters.** If the owner ever wants usage evidence, a Cloudflare Worker endpoint receiving only `route` and `lang` (no IDs, no scores) behind an explicit opt-in toggle. Not part of the core. | Owner | Lets the owner say "N assessments completed this month" in a deck. | A 30-line worker. | S | Privacy perception → default off, documented on the privacy note. | optional |

---

## D. Information architecture and journey

Current: 19 views behind 7 primary items + a 10-item "Pro tools" dropdown; on mobile a 19-chip horizontal strip. Proposed: 5 top-level sections, each with a landing page, Arabic names first.

| # | Top-level (AR / EN) | Route | Contains (merged / renamed / demoted) |
|---|---|---|---|
| 1 | **قيّم مهاراتك** / Assess | `/assess` | Wizard (`/assess`), Results (`/assess/results`, `/results?r=` for shared), Pathways (`/assess/plan`). "النتائج" and "مسارات التطوير" leave the global nav; they are steps of this section and appear in a section stepper. |
| 2 | **طوّر** / Develop | `/develop` | Future skills (`/develop/future`), Skill registry (`/develop/skills`, `/develop/skills/:id`), Role library (`/develop/roles`, `/develop/roles/:id` — the role passport), Tech radar (`/develop/tech`, `/develop/tech/:id`). Rename "الأدوار الوظيفية" → «مكتبة الأدوار»; "رادار التقنيات" stays. |
| 3 | **استكشف المهن** / Careers | `/careers` | Careers (`/careers`, `/careers/:id`), Interactive map (`/careers/map`), Guidance quiz (`/careers/quiz`), "ما يزدهر وما يندثر" merged into the careers landing as a tab («القوائم العالمية»). This is the public/citizen track — explicitly subordinate, kept whole. |
| 4 | **الجهات الحكومية** / Entities | `/entities` | Section landing = today's "للجهات الحكومية" playbook (trimmed) + the three data views: Impact (`/entities/impact`), Sectors (`/entities/sectors`, `/entities/sectors/:id`), Directory (`/entities/directory`), Entity brief (`/entities/:id`). Rename "أثر تمكين الجهات" → «أثر التمكين». |
| 5 | **المنهجية** / Method | `/method` | Methodology, Standards & reports (merged as a section of the same page group: `/method/standards`), Changelog (`/method/changelog`), Data & provenance (`/method/data`, proposal C8), Privacy note. Remove the "أدوات متخصصة" dropdown entirely. |

Header: 5 items + language switch + primary CTA «ابدأ التقييم». Mobile: a proper drawer (Radix `Dialog`/`NavigationMenu`) listing the 5 sections with their sub-pages, not a scroll strip. Footer: the same 5 columns.

Primary journey per persona (entry → 3 steps → artefact):

- **Mid-level employee (موظف):** Home → «قيّم مهاراتك» (track + role, 40 statements, 8 scenarios) → Results (3 evidence layers, 1 headline, 1 next step) → 90-day plan → print/share link (C1). Also: daily drill (C5).
- **Digital specialist (مختص):** Home → Role passport (`/develop/roles/:id`) → "قيّم نفسك مقابل هذا الدور" (role and track pre-filled, step 0 shown but pre-selected) → Results → Pathways with role-specific resources.
- **Manager / HR director (مدير / موارد بشرية):** Home → «الجهات الحكومية» → Entity brief for their entity (`/entities/:id`) → "ما تحتاجه جهتك" → Team view (C3) with pasted codes → team plan export.
- **Deputy Minister / CIO (قيادي):** Home → Executive brief (C7) or Impact → Sector benchmark (C6) → Entity brief (print). Everything on this path must have a URL and an A4 print layout.

What to demote/remove: the home "community learning" roadmap cards (unbuilt features) move to the methodology/roadmap page; the parent-framed heading «هل أنصح ابني بهذا التخصص؟» stays only inside `/careers` and never appears on government-persona paths; the "Pro tools" wording disappears.

---

## E. Engineering review for a static deployment on omary.me

### E.0 Defect register (file:line)

Severity: P0 blocks the journey or misinforms; P1 visible quality defect; P2 hygiene.

| Sev | Location | Defect |
|---|---|---|
| P0 | `src/views/Wizard.tsx:216` vs `:343` | Scenario stage rendered inside the domain-step conditional; never mounts for `step ≥ 9` (`domain === null` at `:52`). Journey cannot complete. Verified live. |
| P0 | `src/views/Wizard.tsx:40` + `Home.tsx:21-24`, `Careers.tsx:69-72`, `Roles.tsx:15-18` | Entry points set `roleId` without `trackId`; Wizard starts at step 1; domain-8 continue button disabled (`:475`) with no message. |
| P0 | `src/store.tsx:138-141`, `App.tsx:40-58` | No router: no URLs, Back exits site, no deep links, reload loses `pending*Id` (`EntityDetail.tsx:18` → empty state). |
| P0 | `src/views/Impact.tsx:49-51, 63-66` | Horizontal bar chart labels/values overlap bars in RTL (SVG inherits `direction: rtl`; `textAnchor="end"` mirrored). Measured and screenshotted. |
| P1 | `src/views/Results.tsx:416`, `:401-402` | `+1.2` renders as `1.2+` (no `dir="ltr"`/`bdi` around signed numbers). |
| P1 | `src/views/Results.tsx:227-228` | Headline uses `headlineDomain.shortName` as "المهارة الأهم" → tautology («التقنيات الناشئة» … «التقنيات الناشئة»). Should use the weakest statement's skill (`domain.skills[statement.skillIndex]`). |
| P1 | `src/views/Results.tsx:128` | Domains without scenario evidence are drawn at 0 on the judgment polygon (collapses to centre) instead of being omitted. |
| P1 | `src/views/Results.tsx:329` | Clickable `<div onClick>` cards without `role="button"`/keyboard handling. |
| P1 | `src/components/Header.tsx:85-108` | Dropdown is hover/focus-within only: no `onClick`, no `aria-expanded`/`aria-controls`, no Escape; unreachable on iPad desktop layout. `aria-haspopup` without menu semantics. |
| P1 | `src/components/Header.tsx:126-138` | Mobile nav = 19 buttons in a horizontal strip, active item not scrolled into view, no overflow affordance, "Pro tools" grouping lost. |
| P1 | `src/components/Header.tsx:78-82`, `Footer.tsx:80` | Navigation uses `<button>` not `<a href>`: no middle-click/new-tab, no crawlability, no `aria-current`. |
| P1 | `src/components/RadarChart.tsx:110` | `aria-label="skills radar chart"` English-only; no text alternative (table) for the 8 values; tooltips mouse-only (`:232-233`, `:256-257`); axis labels are clickable `<text>` without keyboard access (`:258`). |
| P1 | `src/components/NetworkMap.tsx:288`, `:339-345` | Same: English `aria-label`, mouse-only hover, nodes not focusable; `onSpotlightChange` prop accepted but never used (`:74`). On 375 px the SVG is forced to 560 px inside a 343 px card (`Explore.tsx:196` `min-w-[560px]`) → horizontal scroll and overlapping labels (33 `<text>` nodes). |
| P1 | `src/components/TechRadarChart.tsx:187-188`, `:163` | Mouse-only hover; cluster labels clickable `<text>` without keyboard. |
| P1 | `src/views/Roles.tsx:84-97` | Modal without `role="dialog"`, `aria-modal`, focus trap, Escape handling or body scroll lock. |
| P1 | `src/views/Careers.tsx:192` | Arabic chip logic inverted: `degree.ar.startsWith('غير') … ? 'جامعي إلزامي'` labels "degree mandatory" for careers whose degree text says "غير مطلوبة" (`careers.ts:1233`, `:1276`, `:850`). |
| P1 | `src/views/Careers.tsx:160, 266`, `Roles.tsx:62, 103`, `TechRadar.tsx:222` | Secondary-language names use `dir` flipping plus physical `textAlign: right/left` — works by accident; should be `dir` + `text-start` + `lang` attribute. |
| P1 | `src/views/Wizard.tsx:115` vs `:44` | Progress bar width uses `step / (8 + scenarios)` while the percentage text uses answered statements → bar at 56% while text says 100% at the scenario stage; 2% bar vs "0%" text at step 0. |
| P1 | `src/views/Wizard.tsx:17-28` | Deterministic per-item shuffle → the "most mature" option sits in the same position for every user of the same item (fine for a concept; document it, or seed per device). |
| P1 | `src/views/Pathways.tsx:231-233` | Checkpoint weeks detected by regex on display text (`/تحقق|التقييم|نقطة|…/`) → false positives; should be a data flag on `PlanWeek`. |
| P1 | `src/views/Decide.tsx:61-65` | `pickSingle` advances via un-cancelled `setTimeout`; two quick taps skip a question. |
| P1 | `src/views/Directory.tsx:120-131` | `motion.article role="button"` containing an `<a>` (nested interactive); Enter handled but not Space; `aria-label="sector"` etc. English-only (`:82-100`). |
| P1 | `src/components/EntityLogo.tsx:29-35` | `<img loading="lazy">` without `width`/`height` → layout shift as logos arrive; no `decoding="async"`. |
| P1 | `src/App.tsx:32-60` | `AnimatePresence mode="wait"` remounts every view: filter state and scroll lost on every navigation; in hidden/background tabs rAF throttling leaves the page blank until focused (observed). No error boundary (`main.tsx`). |
| P1 | `src/store.tsx:90-97`, `:26-39` | `load()` trusts localStorage JSON (no version, no shape check). A record missing `scores` crashes `Results.tsx:51` → blank app. `history` unbounded. |
| P1 | `src/store.tsx:199-235` | One context object recreated every render; every `setAnswer` re-renders all 24 `useApp()` consumers (Header, Footer, …). |
| P1 | `index.html:5-13` | Static title/description (career-guidance wording), no OG/Twitter/canonical/hreflang/favicon/manifest/theme-color/noscript; Google Fonts render-blocking; `Inter` loaded but unused. |
| P1 | `vite.config.ts:6` | `base: '/digital-skills-radar/'` hard-coded (wrong for omary.me root); no env switch; `EntityLogo.tsx:7-10` correctly derives from `BASE_URL`, but nothing else needs to. |
| P2 | `src/views/Results.tsx:118` | `toLocaleDateString('ar-SA-u-nu-latn')` — specify `ca-gregory` explicitly; older WebKit defaulted `ar-SA` to the Umm al-Qura calendar. |
| P2 | `src/views/Explore.tsx:82-94` | Two effects both set the spotlight for `storyStep` (duplicate). |
| P2 | `src/views/GovSectors.tsx:36-41` | `catRanking` recomputed every render (cheap, but inside a 31-card list). |
| P2 | `src/components/RadarChart.tsx:86-97` | `useMemo` keyed on a `labels` array recreated each render → memo never hits. |
| P2 | `src/store.tsx:35` | Stale comment "correct answers 0-3 per domain" — bank is 5 per domain (`learning.ts:1133`). |
| P2 | `tsconfig.json` | `noUnusedLocals: false`; no ESLint, so the `eslint-disable` comments are decorative. |
| P2 | `package.json` | No `lint`, `test`, `e2e` scripts; `vitest` present only transitively. |

### E.1 Routing, deep links, Back button, shareable URLs

Recommendation: **React Router v7 in library mode** (`react-router` package, `createBrowserRouter` + `RouterProvider`, route modules with `lazy`), not TanStack Router and not a hash router.

- Why React Router: largest ecosystem and the one AI coding agents get right most often; `lazy` route modules give code-splitting for free; `ScrollRestoration` fixes the lost-scroll problem; `useSearchParams` keeps directory filters in the URL; `errorElement` gives per-route error boundaries. TanStack Router's typed search params are attractive for the directory filters but add a learning curve for a 1–2 day push. A hash router (`#/entities/ent-0001`) would avoid server config but is visibly second-class on a flagship domain and hurts SEO; avoid.
- Route table (Arabic at root, English under `/en`): `/`, `/assess`, `/assess/results`, `/assess/plan`, `/results` (shared code), `/develop/future`, `/develop/skills/:id?`, `/develop/roles/:id?`, `/develop/tech/:id?`, `/careers/:id?`, `/careers/map`, `/careers/quiz`, `/entities`, `/entities/impact`, `/entities/sectors/:id?`, `/entities/directory`, `/entities/:id`, `/method`, `/method/standards`, `/method/changelog`, `/method/data`. Entity ids stay `ent-0001` (stable, from the workbook number); add an optional slug for readability (`/entities/ent-0001-markaz-daam-alqarar` is unnecessary — Arabic slugs in URLs encode badly; keep ids).
- Replace all `pending*Id` state with route params; replace `go()` with `<Link>`/`navigate()`; `Header` items become `<NavLink>` with `aria-current="page"`.
- Static-host fallback: on Nginx `location / { try_files $uri $uri/ /index.html; }` (prerendered HTML files win when they exist); on Cloudflare Pages a `_redirects` line `/* /index.html 200`; on GitHub Pages (staging only) copy `index.html` to `404.html`.
- Shareable results: `/results?r=<base64url>` decoded client-side (proposal C1). Keep the payload under 100 characters: 8 × 2 digits self, 8 × 1 digit judgment, 8 × 1 digit knowledge, role index, track index, date as days since 2026-01-01.
- `document.title` per route in the language of the route; prerendered HTML carries `lang` and `dir`.

### E.2 Bundle size, code-splitting, data loading

Budget (gzip over the wire, measured against the current 411 KB single chunk):

| Asset | Budget | How |
|---|---|---|
| Initial JS (shell + Home) | ≤ 180 KB gzip (target ~140) | React 18 ≈ 45 KB, router ≈ 15 KB, framer-motion via `LazyMotion` + `domAnimation` ≈ 18 KB (full import today ≈ 40 KB), app shell + Home data ≈ 30 KB |
| Route chunk (any) | ≤ 120 KB gzip | lazy route modules |
| Entities data chunk | ≈ 90 KB gzip (412 KB raw; Arabic compresses ~4.5×) | dynamic import, loaded only under `/entities/*` |
| Careers data chunk | ≈ 60 KB gzip | loaded under `/careers/*` and lazily on Results for the "careers that fit" block |
| CSS | ≤ 12 KB gzip | already 7.3 KB |
| Fonts | ≤ 90 KB, 2–3 files | self-hosted subset, see E.4 |
| Logos | lazy, never precached | see E.3 |

How:
1. `App.tsx`: every view becomes `lazy(() => import('./views/X'))` inside the route table; `Suspense` fallback = a 1-line skeleton (not a spinner).
2. Heavy data: keep the TS types but move the big arrays behind dynamic imports with a tiny loader module (`src/data/load.ts`: `export const loadEntities = () => import('./govEntities').then(m => m.govEntities)`), consumed via a route `loader` (React Router) so the view renders with data ready and no waterfalls. Vite emits each as its own hashed chunk. `sectorSkills.ts` must stop importing `govEntities` eagerly (it builds `sectorCategoryTotals` at module load) — compute lazily inside the loader.
3. `manualChunks`: `react` + `react-dom` → `vendor-react`; `framer-motion` → `vendor-motion`; router → `vendor-router`. Set `build.target: 'es2022'`, `build.reportCompressedSize: true`, add `rollup-plugin-visualizer` as a dev dependency to verify.
4. framer-motion: wrap the tree in `<LazyMotion features={domAnimation} strict>` and use `m.div` instead of `motion.div`; add `<MotionConfig reducedMotion="user">` so JS animations respect the OS setting (the CSS rule in `index.css:101-116` does not affect framer's inline-style animations).
5. Drop `AnimatePresence mode="wait"` at the app level; animate only the content container's entrance (`initial`/`animate`), which keeps state and avoids the blank-page stall.
6. State: split the context into `LangContext`, `AssessmentContext`, `HistoryContext` (or use `zustand`, 1 KB) so answering a statement does not re-render the header and footer.

### E.3 Logo delivery

Current: 485 opaque 150 px PNGs, 5.5 MB total, lazy-loaded correctly (4 requests on first directory paint). Improvements, in order of value:
1. Add `width`/`height` (48×48 CSS size is fixed per usage) and `decoding="async"` to `EntityLogo` → zero layout shift.
2. Convert to WebP (and AVIF optional) with a `scripts/logos.mjs` using `sharp`: expected 40–60% smaller at 150 px; keep PNG as `<picture>` fallback only if Safari < 14 matters (it does not for this audience) — simplest: WebP only.
3. Versioned path `/logos/v1/ent-0005.webp` + `Cache-Control: public, max-age=31536000, immutable` on the host; the directory then costs ~5 KB per visible card.
4. Do not sprite, inline or precache them; do not generate a 682-image OG set.
5. Keep the monogram fallback; make it a real `<span role="img" aria-label={nameAr}>` only when no logo exists (today it is `aria-hidden`, which is fine because the name is adjacent).

### E.4 SEO, metadata, OG, sitemap, per-page titles, fonts

- **Prerender** every route to static HTML at build time. Simplest robust path for an agent push: a post-build Node script that uses Playwright (needed anyway for E2E) to open each route from the route table on a local preview server, wait for `main h1`, and write `document.documentElement.outerHTML` to `dist/<route>/index.html`; switch `main.tsx` to `hydrateRoot` when `#root` has children. Prerender all section routes + 31 sectors + 50 careers + 48 technologies + 24 roles + 40 skills (~200 pages) and all 682 entity pages if build time allows (≈ 0.3 s/page). Alternative if a framework-level solution is preferred: `vite-react-ssg` (works with React Router route records, emits per-route HTML and head tags). Avoid moving to Next/Astro for this push.
- **Head management:** with React 18 use `react-helmet-async` (`<Helmet>` per route: `title`, `description`, `canonical`, `og:*`, `twitter:card`, `hreflang` alternates `ar`/`en`/`x-default`). If the team upgrades to React 19, native `<title>`/`<meta>` hoisting removes the dependency.
- **Titles:** `رادار المهارات الرقمية — <page>` in Arabic routes, `Digital Skills Radar — <page>` under `/en`; entity pages: `<entity name> — موجز الجهة`.
- **OG images:** one 1200×630 per section (6 images, static PNG/WebP in `public/og/`), not per entity. Generate with a small script (`satori` + `@resvg/resvg-js`) or by hand.
- **sitemap.xml + robots.txt:** generated at build from the same route table (≈ 900 URLs with entities); `robots.txt` allows all, points to the sitemap. Add `<link rel="canonical">`; `noindex` the shared-results route (`/results?r=`) to avoid indexing personal payloads.
- **Structured data:** `WebSite` + `BreadcrumbList` JSON-LD; `Dataset` JSON-LD on `/method/data` (C8). No `Organization` claiming DGA.
- **Fonts:** self-host IBM Plex Sans Arabic in 3 weights (400/500/700) as subset woff2 (Arabic + Latin + digits) with `font-display: swap` and `<link rel="preload" as="font">` for the 400 weight; delete `Inter`. Expected ≈ 80–90 KB in 3 requests instead of 194 KB in 9 third-party requests; also removes the only third-party connection (privacy claim "no external calls" becomes true).
- **Favicon/manifest/theme-color:** SVG favicon (the `RadarMark`), `apple-touch-icon` 180 px, `manifest.webmanifest` (`lang: ar`, `dir: rtl`, `theme_color: #1B8354`, icons 192/512, `display: standalone`).

### E.5 Accessibility (keyboard, ARIA, charts)

- **Navigation:** Radix UI `NavigationMenu` for the header (or `@headlessui/react` `Menu`) → keyboard arrows, Escape, `aria-expanded`, typeahead; mobile drawer = Radix `Dialog` with focus trap. Skip link to `main`. On route change move focus to the page `h1` (`tabIndex=-1`) and announce via an `aria-live="polite"` region ("انتقلت إلى: دليل الجهات").
- **Dialogs:** `Roles.tsx` modal → Radix `Dialog` (`role="dialog"`, `aria-modal`, focus trap, Escape, scroll lock).
- **Charts:** every `<svg role="img">` gets an Arabic/English `aria-label` from `t()` and an `aria-describedby` pointing to a visually-hidden `<table>` with the plotted values (8 rows for the radar; one row per bar). Vertices and nodes become focusable `<g tabIndex={0} role="button">` with `onFocus`/`onBlur` driving the same tooltip as hover and `onKeyDown` Enter for click; tooltips rendered as HTML (not SVG `<text>`) with `role="tooltip"`. Network map on mobile: offer a list view (as the Tech radar already does via `mode`) instead of a 560 px forced width.
- **Forms:** the 40 statements as `fieldset`/`legend` + `role="radiogroup"` with `aria-checked` on the 5 options; scenario options likewise. Calibration and scenario "locked" states announced.
- **Contrast and motion:** keep the `#8A6A00` amber for text; check the amber CTA on green (`Results.tsx:528`: `#DBA102` on `#1B8354` ≈ 2.4:1 for the surrounding — the button text is black on amber, fine; the white text on green around it is fine). Respect reduced motion in framer via `MotionConfig`.
- **Automated gate:** `@axe-core/playwright` on every prerendered route in CI with zero serious/critical violations; `eslint-plugin-jsx-a11y` in lint.

### E.6 RTL correctness

- Keep the logical-property discipline (`ms-/me-/ps-/pe-/text-start` are used consistently; grep found no physical `ml-/mr-/left-/right-` classes). Fix the two remaining classes of error:
  1. **Numbers and signs:** introduce `<Num>` (`<bdi dir="ltr" className="tabular-nums">`) and use it for every numeric token with a sign, slash, range or unit (`+1.2`, `1.4 / 1.3 / 2`, `2021–2026`, `3/5`). Add a test that greps rendered DOM for `\d\+` patterns.
  2. **SVG charts:** set `direction="ltr"` on every chart `<svg>`, lay out explicitly for RTL by mirroring x-coordinates when `lang === 'ar'` (labels column on the right, bars growing leftwards), and set `direction: rtl; unicode-bidi: isolate` only on Arabic `<text>` nodes. Radar/tech radar already mirror angles with `dir`, which is correct; only the bar charts (`Impact.tsx`, `EntityDetail.tsx:109-124`) are wrong today — the vertical bars happen to be fine because labels are centred.
- Secondary-language lines (`Careers.tsx:160`, `Roles.tsx:62`): `<p lang="en" dir="ltr" className="text-start">` (no physical `textAlign`).
- Dates: `new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', …)`; numbers: a single `fmt()` in `src/lib/format.ts` (`en-US` grouping) — today `fmt` is duplicated in 4 files.
- Prerendered HTML must carry `dir="rtl" lang="ar"` for Arabic routes and `dir="ltr" lang="en"` under `/en`; the runtime toggle navigates between the two trees instead of mutating `documentElement` in place.
- Mixed-script strings (framework names like SFIA, WEF inside Arabic sentences) are acceptable; wrap Latin tokens in `<span lang="en">` where they carry punctuation (e.g., "SFIA 9") to avoid bracket mirroring.

### E.7 Performance budget (numbers)

Targets on a mid-range Android over 4G (Lighthouse mobile preset), enforced by Lighthouse CI budgets:

| Metric | Today (estimated from measurements) | Target |
|---|---|---|
| Initial JS transfer | 411–425 KB gzip | ≤ 180 KB gzip |
| Total first-view transfer (Home) | ≈ 650 KB (JS + CSS + 194 KB fonts + hero) | ≤ 350 KB |
| LCP (Home) | likely 3.5–4.5 s (single 1.6 MB script must parse before any paint; fonts block) | ≤ 2.5 s |
| CLS | > 0.1 on directory (logos without dimensions) | ≤ 0.05 |
| INP | fine (directory filter over 682 rows is cheap) | ≤ 200 ms |
| Time to interactive, entity page from a deep link | n/a (no deep link) | ≤ 3 s |
| Lighthouse Performance / A11y / SEO | not measurable without URLs | ≥ 90 / ≥ 95 / ≥ 95 on 10 sampled routes |

`budget.json`: `script ≤ 200 KB`, `font ≤ 100 KB`, `image ≤ 150 KB` per route, `third-party requests = 0`.

### E.8 PWA / offline

`vite-plugin-pwa` (Workbox, `registerType: 'autoUpdate'`): precache the app shell + route chunks + fonts + the small data chunks (domains, statements, scenarios, learning — the assessment then works fully offline, which is realistic for a training room with weak Wi-Fi); runtime `CacheFirst` for `/logos/**` (max 600 entries, 30 days) and for the entities/careers data chunks; `NetworkFirst` for HTML. Offline fallback page in Arabic. Manifest as in E.4. Do not precache the 5.5 MB logo set. Keep the plugin out of `vite preview` runs and add an "update available" toast via `useRegisterSW`.

### E.9 i18n approach

Keep the inline `L {ar, en}` model — it is the right size for two languages and keeps Arabic next to English for reviewers. Changes:
- Language is part of the URL (`/` vs `/en`), persisted preference only redirects on first visit.
- Extract UI strings (not data) from views into `src/i18n/ui.ts` keyed objects so a content reviewer can proofread Arabic in one file; views call `t(ui.results.headline)`.
- One `fmt` number helper and one date helper (`src/lib/format.ts`); ban `toLocaleString()` without an explicit locale via lint rule (`no-restricted-syntax`).
- Add `lang` attributes on secondary-language text; Arabic `aria-label`s everywhere (today 13 English-only).
- Data-integrity tests (E.10) assert: no Eastern digits in `ar` strings, every `L` has both keys non-empty, no `undefined` reaching `t()`.
- Arabic grammar for generated strings: a `pluralize(n, forms)` helper for 1 / 2 / 3–10 / 11+ (`خدمة / خدمتان / خدمات / خدمة`) applied to `topConsulting` at build time and to KPI labels (`برنامجًا` vs `برامج`).

### E.10 Testing strategy

- **Unit (Vitest):** `computeScores`, `stageForScore`/`levelForScore` (port the existing self-test), `computeAgreement`, the priority rules in Results (extract to `src/lib/priority.ts`), `profileFromCategoryCounts` (weights sum to 1, top-3 renormalization), `resolveTargets` for the three id prefixes, `shuffledIndices` (is a permutation), the share-code codec round trip (C1), `transitionForScore`/`pathwayForDomain` agreement.
- **Data integrity (Vitest, runs in CI):** 40 statements = 8 × 5 with unique ids; 40 scenarios = 5 tracks × 8 domains, each with exactly one `score: 3` option and 4 options; 40 calibration questions with a valid `answer` key; 50 careers with 5 `keySkills` each present in `skillVocab`; 24 library roles with targets for all 8 domains; every `logo` path exists in `public/logos`; every `url` parses; every `L` has both languages; no Eastern digits; category→domain weights sum to 1.0; `govServiceKpis` totals equal recomputed sums from `govEntities` (7,915 / 2,873 / 421); the UI counts shown in text are derived from data, not literals.
- **E2E (Playwright, Chromium + WebKit):** complete the assessment in AR and EN → results → plan → print preview; deep link to `/entities/ent-0001` and `/careers/<id>` renders with the right title; Back/Forward behave; language switch keeps the route; mobile 375 px flows (nav drawer, wizard, directory); shared-results link round trip; axe scan per route.
- **Visual regression (optional, cheap):** Playwright screenshots of the radar, tech radar, network map and Impact bars in AR and EN at 2 widths — the exact places where RTL regressions happened before.
- **Performance:** Lighthouse CI (`@lhci/cli`) against the built `dist/` with the budgets in E.7.
- **Lint/type:** ESLint flat config with `typescript-eslint`, `react-hooks`, `jsx-a11y`; `tsc --noEmit` already in `build`.

### E.11 Build and deploy pipeline

- `package.json` scripts: `lint`, `typecheck`, `test`, `test:data`, `e2e`, `build` (`vite build` + `prerender` + `sitemap`), `preview`, `lhci`.
- `vite.config.ts`: `base: process.env.VITE_BASE ?? '/'` (GitHub Pages staging sets `/digital-skills-radar/`), `manualChunks`, PWA plugin, visualizer in `--mode analyze`.
- GitHub Actions: on PR → lint, typecheck, unit + data tests, build, Playwright (with `npx playwright install --with-deps chromium webkit`), axe, LHCI; on `main` → deploy to staging (GitHub Pages) and, on a tag, to production.
- Production host for omary.me — two sound options:
  1. **Cloudflare Pages** (free, global CDN, brotli, `_redirects` SPA fallback, `_headers` for `Cache-Control`/CSP, custom domain with automatic TLS). Lowest operational burden; recommended if the owner is fine with the domain's DNS on Cloudflare.
  2. **Nginx on the owner's existing VPS** behind the current gateway: `root /var/www/omary.me; try_files $uri $uri/ /index.html;`, `gzip_static on; brotli_static on;` (pre-compress in CI), `location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }`, same for `/logos/`, `add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self'"` (no inline scripts once fonts are self-hosted), HSTS. Deploy = rsync of `dist/` from CI via a deploy key.
- Release checklist: bundle budget report attached to the PR, Lighthouse scores, `sitemap.xml` URL count, prerender count, a smoke run of the full journey on the production URL (Playwright against prod, read-only).

---

## F. Content and evidence review — what would embarrass the owner

Specific, with locations:

1. **Positioning leak.** `Footer.tsx:58` «منصة إرشاد مهني ومهاري مبنية على أدلة عالمية» and `index.html:6` ("career guidance") contradict the v6 organizing question (government workforce). Fix both; the meta description is what Google shows.
2. **Counts that disagree with the data.** `Wizard.tsx:173` «مكتبة الأدوار (20 دورًا)», `Roles.tsx:30-31` «عشرون دوراً», `Methodology.tsx:83` «20 دورًا» — the library has 24 (`roleLibrary.ts`, and `Home.tsx:30` says 24). `Methodology.tsx:21` «كيف صُنّفت المهن الثلاثون؟» — there are 50. `Methodology.tsx:83` «24 سؤال تحقق» — bank is 40. `SkillRegistry.tsx:73` hard-codes "40". Derive every count from `array.length`.
3. **Wrong colour word.** `Wizard.tsx:134-135` and `Roles.tsx:30-31` call the target polygon «البنفسجي»/"violet"; it is amber (`RadarChart.tsx:116-119`). A reader will look for a violet shape and not find it.
4. **Tautological headline.** `Results.tsx:227-228` «المهارة الأهم لها هي «التقنيات الناشئة»» repeats the domain name (verified rendering). Pick the lowest-scored statement's skill from `domain.skills[s.skillIndex]`.
5. **Inverted label.** `Careers.tsx:192` prints «جامعي إلزامي» when the degree text begins with «غير» (= not required) — `careers.ts:1233` «غير مطلوبة.» and `:1276`.
6. **Arabic number agreement in 127 generated strings.** `govEntities.ts` `topConsulting` values such as «و4 خدمة أخرى», «و6 خدمة أخرى» (3–10 take the plural: «و4 خدمات أخرى»); counts: 3→33, 4→25, 5→19, 6→18, 7→14, 8→11, 9→7 occurrences. Also `EntityDetail.tsx:90` shows «5 برنامجًا تدريبيًا» (should be «5 برامج تدريبية»). Fix in the build script and with a `pluralize` helper.
7. **Units summed.** «إجمالي الاستفادة 10,788» (`Impact.tsx:98-102`, `EntityDetail.tsx:92`) adds training participation records to consulting services. A senior reader will ask what a "benefit" is. Either rename («إجمالي السجلات») or show the two numbers side by side and drop the sum.
8. **"Official" wording on a personal domain.** `Impact.tsx:319-320` «سجلات خدمات هيئة الحكومة الرقمية الرسمية» and `Methodology.tsx:59,134` "485 official PNGs" — on omary.me this reads as DGA publishing. Reword to «مستخرجة من ملفي عمل زُوِّد بهما المؤلف (أكتوبر 2026)» and add a provenance line «الشعارات ملك لجهاتها وتُعرض للتعريف فقط». See H for the decision this requires.
9. **English-first learning.** `learning.ts`: 45 of 49 resources are `language: 'en'`; the Arabic-first employee gets English Coursera/AWS links on the 90-day plan (`Pathways.tsx:170-198`). Add Arabic options per transition (Doroob, SDAIA Academy, Tuwaiq tracks, Saudi Digital Academy courses) or label the plan honestly «معظم الموارد بالإنجليزية».
10. **Blanket reimbursement claim.** `Pathways.tsx:189` «قد تعوَّض رسومها عبر دعم هدف» is printed next to every certification regardless of whether it is on the HRDF list; keep the hedge but link to the list and mark per resource (`hadafEligible?: boolean`).
11. **Parent framing on a government page.** `Careers.tsx:273` «هل أنصح ابني بهذا التخصص؟» is the verdict heading for every career, including those reached from the government "careers that fit your strengths" block on Results (`Results.tsx:538-590`). Use «الحكم الصريح» on government paths.
12. **Overclaim in the map story.** `Explore.tsx:60` «أكثر المهارات تشابكًا مع سوق العمل» is computed from an editorial sample of 50 careers; say «على هذه الخريطة».
13. **Changelog dates.** Every version v1…v8 is «أكتوبر 2026» (`Methodology.tsx:71-147`); technically true, but a reviewer reads a one-month history. Show day-level dates (2026-10-18 … 2026-10-21) and the review rounds.
14. **English-only accessibility labels.** 13 `aria-label` literals ("toggle language", "close", "sector", "skills radar chart", "interactive skills-careers map", "entity yearly training", …) — screen-reader users in Arabic hear English. `Header.tsx:115`, `Explore.tsx:248`, `TechRadar.tsx:217`, `Roles.tsx:107`, `Directory.tsx:82-100`, `RadarChart.tsx:110`, `NetworkMap.tsx:288`, `TechRadarChart.tsx:90`, `EntityDetail.tsx:109`, `Impact.tsx:165,211,235,261,287`.
15. **Digits and dates.** No Eastern digits anywhere in `src` (good). Dates rely on `ar-SA-u-nu-latn` (`Results.tsx:118`) — add `ca-gregory` to be safe across engines.
16. **Terminology drift (minor).** «سجل تدريبي» (Home/Impact) vs «سجلات تدريبية» vs «تدريب» in chips (`Directory.tsx:164`); «أخصائي رقمي» (`roles.ts:28`) vs «مختص رقمي» (`Home.tsx:29`); «موظف حكومي عام» vs «موظف حكومي». Pick one glossary (`src/i18n/glossary.md`) and enforce it in the content pass.
17. **Unbuilt features on the home page.** `Home.tsx:293-324` community cards are correctly badged «خارطة طريق — غير منفذة بعد», but five unbuilt features on the home page of a "finished product" still dilute it; move to `/method/roadmap`.

What is good and should be kept verbatim: the documented 7,935/2,918 vs 7,915/2,873 discrepancy note; the declared thresholds and editorial-scenario caveats; the source badges; the "development planning only" disclaimers; the sector→domain weight table in the methodology page.

---

## G. Rebuild plan — 1–2 day push by AI coding agents (12 work packets)

Rules for the lead: one writer per file set; packets list the files they own; "parallel" means it can run concurrently with the packets named, with no shared files. Acceptance criteria are things a reviewer can run or see.

| WP | Name | Scope (owned files) | Acceptance criteria | Depends on | Parallel with |
|---|---|---|---|---|---|
| **WP0** | Unblock the journey (hours) | `src/views/Wizard.tsx`, `src/views/Home.tsx:21-24`, `src/views/Careers.tsx:69-72`, `src/views/Roles.tsx:15-18`, `src/views/GovSectors.tsx:43-46`, `src/views/EntityDetail.tsx:36-39` | Playwright: a new user completes track → role → 8 domains → 8 scenarios → Results → Pathways in AR and EN; entering from Home "موظف حكومي", a career card and a role card always shows step 0 with the role pre-selected; progress bar and percentage agree; AST check that the scenario block is a sibling of the domain block. | — | WP4, WP6, WP8 (disjoint files) |
| **WP1** | Router, URLs, titles | `src/main.tsx`, `src/App.tsx`, `src/router/*` (new), `src/store.tsx` (remove `view`, `go`, `pending*`), `src/components/Header.tsx`, `src/components/Footer.tsx`, every view's navigation calls (`go(` → `navigate`/`Link`; `pending*` → params) | All routes in E.1 resolve; `history.length` grows on each navigation; Back returns to the previous view; reload on `/entities/ent-0001` renders the entity; `document.title` per route in the route language; `ScrollRestoration` works; `errorElement` renders an Arabic error page when a loader throws; staging `404.html` fallback works. | WP0 merged | WP2 (data part), WP3 (assets part), WP6 |
| **WP2** | Code-splitting and budgets | `vite.config.ts`, `src/data/load.ts` (new), `src/data/sectorSkills.ts` (lazy totals), `src/App.tsx` route `lazy()` (coordinated with WP1), `package.json` (visualizer, LazyMotion) | `vite build` emits ≥ 6 chunks; initial JS ≤ 180 KB gzip; `govEntities` and `careers` are separate chunks not loaded on `/assess`; `LazyMotion` + `MotionConfig reducedMotion="user"` in place; `AnimatePresence mode="wait"` removed at app level; visualizer report committed as `docs/bundle.html`. | WP1 routes | WP3, WP4, WP5 |
| **WP3** | SEO, metadata, fonts, PWA | `index.html`, `public/` (favicons, manifest, og/, fonts/), `scripts/prerender.mjs`, `scripts/sitemap.mjs`, `src/seo/*` (Helmet per route), `src/index.css` (`@font-face`) | `curl` of `/entities/ent-0001/index.html` returns HTML with the Arabic title and `dir="rtl"`; `sitemap.xml` lists every route (count asserted); `robots.txt` present; OG tags validated with an OG debugger screenshot; 0 third-party requests (fonts self-hosted, `Inter` removed); Lighthouse SEO ≥ 95 and "installable" PWA on Home; offline reload of a visited route works. | WP1 | WP2, WP4, WP5, WP6 |
| **WP4** | RTL numbers and charts | `src/components/Num.tsx` (new), `src/lib/format.ts` (new), `src/components/charts/HBarChart.tsx` (extracted from `Impact.tsx`), `src/views/Impact.tsx`, `src/views/EntityDetail.tsx` (bars), `src/views/Results.tsx` (numbers only), `src/views/GovSectors.tsx` (numbers only) | Screenshot tests in AR/EN of Impact and Results: no label overlaps bars (bounding boxes asserted), `+1.2` renders with the sign first; one `fmt` used everywhere (grep: no `toLocaleString(` outside `format.ts`); dates use `ca-gregory`. | WP0 | WP1, WP2, WP3, WP5, WP6 |
| **WP5** | Accessibility | `src/components/Header.tsx` (after WP1), `src/components/nav/*` (Radix), `src/views/Roles.tsx` (dialog), `src/components/RadarChart.tsx`, `TechRadarChart.tsx`, `NetworkMap.tsx` (a11y + keyboard + HTML tooltips + mobile list), `src/views/Directory.tsx` (cards), `src/views/Results.tsx` (clickable divs) | axe: 0 serious/critical on all routes; keyboard-only run of the full journey; menu opens on click/Enter/Space, closes on Escape, has `aria-expanded`; every chart has an Arabic label and a hidden data table; mobile map offers a list mode; iPad landscape (1366 px) reaches all pages. | WP1 | WP2, WP3, WP4, WP6 |
| **WP6** | Content consistency and glossary | `src/i18n/glossary.md` (new), view text literals (`Wizard.tsx` text after WP0, `Roles.tsx`, `Methodology.tsx`, `Footer.tsx`, `index.html` description via WP3 handoff, `Careers.tsx:192`, `Results.tsx:227` headline logic), `src/data/govEntities.ts` plural fix via `scripts/` regeneration or a one-off transform, `src/data/learning.ts` Arabic resources | All counts in UI derived from data; grep finds no «20 دورًا», «الثلاثون», «24 سؤال», «البنفسجي», «إرشاد مهني» in the footer; headline names a skill different from the domain; «جامعي إلزامي» only when `licenseRequired`; 0 occurrences of `و[3-9] خدمة`; glossary applied to the 3 drifting terms; at least one Arabic resource per domain transition. | WP0 | WP1, WP2, WP3, WP4, WP5 |
| **WP7** | Share link and print | `src/lib/share.ts` (codec + tests), `src/views/Results.tsx` (share button, `/results?r=` route via WP1), `src/views/Pathways.tsx` (print), `src/print.css` | Codec round-trips 1,000 random records; link ≤ 120 chars; `/results?r=…` renders the radar with the disclaimer and `noindex`; print preview of Results and Pathways fits 2 A4 pages with the radar and the 3 plans; QR present on print. | WP1, WP4 | WP8, WP9 |
| **WP8** | Entity brief, directory and logos | `src/views/EntityDetail.tsx`, `src/views/Directory.tsx` (filters in URL search params), `src/components/EntityLogo.tsx`, `scripts/logos.mjs` (WebP + dimensions), `public/logos/v1/*` | Entity page has URL, print layout (1 A4), recommended pathways from its top domains; directory filters survive reload (in URL); logos served as WebP with `width`/`height`; CLS ≤ 0.05 on the directory; total logo bytes reduced ≥ 40%. | WP1 | WP7, WP9 |
| **WP9** | Sector benchmark and role passport | `src/views/GovSectors.tsx` (sector page with national comparison), `src/views/Roles.tsx` → `src/views/RolePage.tsx` (new route), `src/data/sectorSkills.ts` (benchmark helper + tests) | `/entities/sectors/:id` shows sector vs national category mix with suppression rule for n < 5; `/develop/roles/:id` shows targets, plan templates, scenarios and programs; both prerendered and in the sitemap. | WP1, WP2 | WP7, WP8 |
| **WP10** | Tests, lint, CI | `eslint.config.js`, `vitest.config.ts`, `tests/unit/*`, `tests/data/*`, `tests/e2e/*`, `playwright.config.ts`, `lighthouserc.json`, `.github/workflows/ci.yml`, `package.json` scripts | CI green on a PR: lint, typecheck, unit + data integrity (all assertions in E.10), Playwright journey AR/EN + deep links + mobile, axe, LHCI budgets; `scripts/levels.selftest.mjs` ported to Vitest. | starts immediately (scaffolding), gates on WP0–WP6 to pass | everything (test files only) |
| **WP11** | IA restructure and deploy to omary.me | `src/views/Home.tsx` (4 entrances → 5 sections), section landings (`src/views/sections/*`), `src/components/Header.tsx`/`Footer.tsx` menus (after WP5), `vite.config.ts` base from env, `deploy/nginx.conf` or `_redirects` + `_headers`, `.github/workflows/deploy.yml`, `docs/RELEASE.md` | Header shows 5 sections + CTA; mobile drawer; every old view reachable within 2 clicks; staging on GitHub Pages with `VITE_BASE`; production build with `base: '/'`; production smoke test passes on https://omary.me (journey, deep link, Back, 0 third-party requests, cache headers immutable on `/assets` and `/logos`). | WP1, WP3, WP5 | WP7, WP8, WP9 |

Suggested sequencing for 2 days with 4–6 agents: Day 1 morning: WP0 (one agent, ~2 h) while WP10 scaffolds and WP4/WP6 run; Day 1 afternoon: WP1 (one strong agent, the only one touching `store.tsx`/`App.tsx`/`Header.tsx`), WP2 data part, WP3 assets part; Day 2 morning: WP2 routes, WP3 prerender, WP5, WP7, WP8, WP9 in parallel; Day 2 afternoon: WP11, full CI, production smoke test. An independent reviewer (not the implementers) runs the E2E and axe suites and reads the diff of WP1 and WP4 before release.

---

## H. What NOT to do

1. **Do not add a backend, login, analytics or cookies.** The "no data collection" claim is a feature for this audience; even Google Fonts is a third-party request today — remove it rather than add more. If usage numbers are wanted, only the opt-in counter in C10, clearly separated.
2. **Do not publish entity-level service records without an explicit owner decision.** The workbooks are internal DGA working files; showing which ministry received how many consulting services, on a personal domain, is a data-governance question before it is a UX one. Options to decide now: (a) sector-level aggregates public, entity-level behind a "demo data" switch; (b) entity-level with the owner's written authorization statement on the methodology page; (c) synthetic entity-level demo values clearly labelled. The reviewer's recommendation is (a) for omary.me.
3. **Do not use DGA word marks or logos, and do not call the data "official DGA records" on omary.me.** Keep the DGA-inspired theme and say "DGA-inspired concept by …".
4. **Do not migrate frameworks (Next.js/Remix/Astro) in this push.** The stack is right for a static site; the gaps are routing, splitting, prerendering and discipline, all achievable inside Vite + React.
5. **Do not replace the hand-built SVG charts with a charting library.** They are small, RTL-mirrored and on-brand; fix their a11y and RTL. ECharts/Recharts would add 150–400 KB and new RTL problems. At most `d3-shape`/`d3-scale` if a new chart type is needed.
6. **Do not add an LLM "assistant" or AI-generated advice.** It would require a backend or an API key in the client, break the privacy claim, and put unverifiable sentences next to sourced numbers.
7. **Do not add rankings, leaderboards, badges or social sharing of scores.** The product's own rule is "development only, never selection"; shareable links (C1) should carry the disclaimer and no names.
8. **Do not prerender per-entity OG images or precache the logo set in the service worker** (682 images, 5.5 MB; cost without benefit).
9. **Do not use a hash router or keep the GitHub Pages base path in production.** Clean paths with a server fallback; GitHub Pages stays as staging only.
10. **Do not expand content (more careers, more technologies) before the consistency pass (WP6) and the data-integrity tests exist** — the previous synthesis already warned about this and v7/v8 added 700+ entities on top of unresolved inconsistencies.
11. **Do not machine-translate the Arabic or switch to Eastern digits/Hijri dates for "authenticity".** Western digits and Gregorian dates are the owner's rule and the government web convention.
12. **Do not claim psychometric validity, SFIA equivalence or "measurement".** Keep "self-reflection and development planning"; the thresholds remain editorial until a validation program exists.
