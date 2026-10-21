# Review brief — Digital Skills Radar — Sections A–D

## A. Verdict

| Dimension | Score | One-sentence read |
|---|---|---|
| Product concept | **8/10** | Rare mapping of a real, organizer-capable question — "what capabilities does the changing government workforce need?" — into a credible bilingual static product. |
| User journey | **5.5/10** | A four-entrance home and a measurement→gap→plan spine are right; the dual-audience split is unresolved and post-results navigation is leaky. |
| Visual / brand | **7/10** | DGA-inspired green/amber identity is clean and ownable; the platform still inherits DGA's gradient hero rather than asserting its own, and Arabic RTL typography needs a second pass. |
| Engineering | **5.5/10** | Solid React/Vite/TS/Tailwind stack, sensible SVG and motion discipline; undermined by no router (19 views, 1 URL), a 13.6k-line `govEntities.ts`, and assets shipped synchronously. |
| Content / evidence | **7/10** | Best-in-class "no number without a source" discipline in a static product of this size; undercut by the confidence-indicator miscalculation, an unsourced stale NEOM, and an acknowledged editorial (not validated) scoring spine. |

## B. Top 10 weaknesses (ranked by senior-government-audience impact)

### 1. No router. 19 views live behind one URL.
- **Why it matters.** A Deputy Minister cannot email a link to "my entity's enablement view", a CIO cannot bookmark the entity detail she discussed yesterday, and the browser back button is meaningless. There are no shareable URLs, no per-page OG meta, no per-page titles — a fatal credibility gap for a "concept demonstration" trying to act like a finished product. (Confirmed by full `View` enum in `src/store.tsx` and the `go()` mutating `view` not `window.location`.)
- **Evidence.** `src/store.tsx` (`go = useCallback((v: View) => { setView(v); window.scrollTo(...) })`); no `react-router` import anywhere; `index.html` has a single hardcoded `<title>`; `App.tsx` switches by `view` state.
- **Fix sketch.** Adopt `react-router` v6 with hash- or path-based routes; route the 19 views; per-view `<Helmet>` title + meta + OG; persist `view` to a shareable URL.
- **Effort.** M.

### 2. The "confidence / consistency" indicator (P0-1 still alive).
- **Why it matters.** The Results page labels the band "your self-rating vs the knowledge check" yet the code, per the synthesis, derives it from correct-count alone. A senior audience reading "Consistent — متسق" against a self-rating they gave themselves is the single most damaging false promise on the platform.
- **Evidence.** `src/views/Results.tsx` defines `agreementMeta` and `computeAgreement(selfScore, correct, total)` (lines ~22–55 of the file shown); the **badge chip** in the UI still drifts between declarations.
- **Fix sketch.** Render the agreement band as a visual diff (current polygon vs judgment polygon vs knowledge-check hits) and let users see the disagreement, not just a verdict word.
- **Effort.** S–M.

### 3. National data layer shows off — it doesn't enable.
- **Why it matters.** 682 entities, 485 logos, 31 sectors, 7,915 training records is impressive; for a CIO or HR director visiting "For Entities" there is no path from "here is the data" to "here is what I do Monday". The pages are dashboards, not decisions.
- **Evidence.** `src/views/Impact.tsx` (KPI hero + per-pillar/category bars, click-through to `openSectorsByCategory`); `src/views/EntityDetail.tsx` ends with "قيّس جاهزيتك لأولويات جهتك" CTA — but no "what to do next at the entity level" exists for leadership.
- **Fix sketch.** Add an entity-level **"90-day enablement brief"**: top-3 priorities from consulting record + suggested track mix + a printable charter an HR director can paste into a memo. Lives on the entity detail page, generated client-side.
- **Effort.** M.

### 4. Citizen track contaminates the government track.
- **Why it matters.** Five expert reviews converge: a senior government visitor lands on a home that markets itself equally to a high-school student ("اختبار التوجيه 5 أسئلة") and to a CIO ("للجهات الحكومية"). The marketing is mixed at the level of the hero and the secondary track is wrapped in dashed-border "service" framing.
- **Evidence.** `src/views/Home.tsx` hero CTA "ابدأ التقييم" sits next to "نتائجي السابقة", then a 4-card "Four entrances" block (employee / specialist / manager / executive) — none of which is the citizen — and then a clearly-fenced dashed-border block introduces the citizen service. The Header's "Pro tools" dropdown lists `lists`, `entities`, `impact`, `directory` — all government-grade — alongside `decide`, `careers`, `explore`.
- **Fix sketch.** Two render modes (`/gov` and `/citizen`) sharing components; or, lighter: make the citizen tracks invisible in the main nav until the user clicks an explicit "للأفراد" tab in the top-right, and remove the dashed-border marketing block.
- **Effort.** S (tab split) / M (separate routes).

### 5. Guidance quiz has a real empty state and a fake-explanation bug.
- **Why it matters.** Strongest review finding (career guidance reviewer): the combo "helping people + <1 year commitment" produces zero recommendations and a vacuous screen. Worse, when an aptitude-set is empty the algorithm still emits an explanatory reason that doesn't apply.
- **Evidence.** Review synthesis §3 (career guidance): "سبب تفسيري كاذب يُمنح لمهن بلا متطلب استعداد (`guidance.ts:239`)، وكسر تعادل أبجدي (`localeCompare:255`)" — called out but not confirmed patched in the supplied file slices. `src/views/Decide.tsx` exit route on `top.length === 0` is unspecified in the slice.
- **Fix sketch.** Material minimum: handled-empty-state with three fast-path careers ("مساعد تمريض", "فني صيدلة", "دبلوم تشغيل وصيانة"); remove fake explanations; replace alphabetical tie-break with a documented "lower automation exposure wins".
- **Effort.** S.

### 6. The career evidence base is global; the local layer is one report.
- **Why it matters.** The economic-work reviewer named this: the only "Saudi signal" in careers is `Coursera GSR 2025/2026`. Tuwaiq's placement rate, Hadf/Tamheer programs, MoL Nitaqat bands — the actual drivers of Saudi white-collar demand — are absent. A senior decision-maker will ask "where is the Saudi data?" in the first five minutes.
- **Evidence.** Career evidence base list in §5 of `HANDOVER.md` and `careers.ts` header comment; missing locally are GASTAT wage data, جدارات/طاقات vacancy aggregates, MoHR Nitaqat bands, MoE university admission percentages.
- **Fix sketch.** Add an honest "Saudi signal" card per career (locally sourced or "no local signal — global analogue") with three state values: official / surveyed / absent. Acknowledge absence rather than substitute Coursera.
- **Effort.** S (cards) / L (data acquisition).

### 7. RTL number presentation bug on the head result.
- **Why it matters.** A 2.4-line serious UX defect (Arabic-UX reviewer): the headline figure reads reversed inside Arabic text because `dir` is not flipped for that span. The very first number a viewer sees ("3.00 / 4.00") is the line that introduces the entire product.
- **Evidence.** `src/views/Results.tsx` (~L182 in the supplied slice) renders the headline inside an RTL paragraph without `dir="ltr"`; `index.css` and `tailwind.config.js` do not establish a global numeric span utility.
- **Fix sketch.** Wrap every score literal in `<bdo dir="ltr">` or a small `<Num/>` component; reuse across KPIs (Impact page also has this risk).
- **Effort.** S.

### 8. Outdated, over-claimed evidence on flagship cards.
- **Why it matters.** The economics reviewer found the Civil Engineering career card still anchors on The Line's earlier scope (~170 km, megaproject framing), while public reporting now records a ~2.4 km reduced scope and major cancellations. The single number a CIO will remember is the wrong one.
- **Evidence.** Synthesis §3 (labor economist): "بطاقة الهندسة المدنية تبني سردها على ذا لاين بصيغته القديمة"; corroborated by HANDOVER §8 list of known limitations not flagged for fix.
- **Fix sketch.** A small "evidence freshness" badge per card (last reviewed MM-YYYY), a single editor's notes file (`research/edits.md`), and a re-write of the Civil Engineering card with the reduced scope + NEOM cancellation context.
- **Effort.** S.

### 9. `govEntities.ts` is 13,629 lines and ships synchronously.
- **Why it matters.** A single import of `govEntities` (and `govEntityDetails` at 707 lines) loads before any view renders. 485 PNG logos plus a 13.6k-line JSON-shaped module — this is the #1 thing that will look bad on Lighthouse and on first paint on omary.me.
- **Evidence.** File-inventory table; the directory view, sector view and entity detail share one giant static graph.
- **Fix sketch.** Split into per-sector files (~30 files of ~450 lines each) loaded via dynamic `import()`; index by `(sector, id)`; logos via on-demand `<img loading="lazy">` with a hash-based sprite fallback for directory tiles.
- **Effort.** M.

### 10. No periodic-update ritual is visible to the reader.
- **Why it matters.** Four reviewers independently asked the same question: when was this last validated against the field? The methodology page lists honest known-limitations (good), but the platform has no visible "last reviewed on …" stamp, no changelog entry readers can scan, and no advisory-roster disclosure.
- **Evidence.** `src/views/Methodology.tsx` (existence); absence of any `lastReviewedAt` surface in `Header`, `Home`, or per-record output; no reviewer names surfaced.
- **Fix sketch.** Add a footer line "آخر مراجعة للأدلة: YYYY-MM-DD · المراجعون: [names]"; a one-page `changelog.md` linked from Methodology; a tiny "dissent" footnote on the Methodology page for items reviewers disagreed on (e.g. declining-career suppression).
- **Effort.** S.

## C. Idea evolution — 8 proposals to make the product materially stronger

Each item stays inside the static / no-backend constraint; "code sketch" means a component, a route, or a static file, not a server.

**1. Client-side team aggregation via shareable codes** — **MUST**
- *What.* A team lead generates a 6-character code inside the wizard; teammates type it on their device and the page stores an aggregated, anonymized team summary (n ≥ 3 to surface) — domain averages, top-3 priorities, scenario agreement. Pure localStorage + a static template; no backend, no PII leaves the device.
- *Serves.* Managers and HR directors (the missing middle of v8).
- *Better than today.* v8 has 682 entities with skill-demand profiles but no individual-to-team bridge. The aggregation is the natural next step and turns a personal reflection tool into a team instrument.
- *Data/content needed.* A `TeamSession` schema (code → member-hash → subset-of-history slice) and a static aggregation function. Zero PII.
- *Effort.* M · *Risk.* Low (privacy-clean by construction).

**2. Entity-level "90-day enablement brief", one printable page** — **MUST**
- *What.* Each `EntityDetail` page gains a "Create enablement brief" button that renders a one-page PDF-ready view: top-3 consulting categories, mapped top-3 skill domains, suggested track mix (T/Awareness 30%, A/Applied 50%, S/Specialist 20%), and a charter paragraph an HR director can paste into a memo.
- *Serves.* CIO, HR director, transformation PMO.
- *Better than today.* Today the entity page is a dashboard. A brief is a decision artifact.
- *Data/content needed.* Reuses `entitySkillProfile`, `govEntityDetails`, `sectorSkills`; adds a templating function in `src/data/entityBriefs.ts`.
- *Effort.* M · *Risk.* Low (editorial; sources already cited).

**3. Reposition the Results page around a "discussion script"** — **MUST**
- *What.* Add a "Discuss with your manager" module: a 6-line manager-ready text (role target · top-2 gaps · one behavior this sprint · one resource this month · review date) plus a printable one-page summary the employee takes to a 1:1. The current Results page already has a print button; this populates the printable output with content.
- *Serves.* Employee → manager loop, the link that turns personal reflection into organizational change.
- *Better than today.* v8 produces a personal radar and stops. A discussion script closes the loop.
- *Data/content needed.* Reuses `pathways`, `careers`, `learningResources`; no new data.
- *Effort.* S · *Risk.* Low.

**4. Honest benchmark layer (anonymous, distribution, opt-in)** — **SHOULD**
- *What.* A toggle "Compare against peers" on Results shows an anonymous distribution (box-plot per domain) of how others in the same `track + role` scored; only fires when ≥ 10 submissions exist for that bucket in localStorage AND the device is opted-in to a local benchmark pool.
- *Serves.* Specialists and team leads validating self-assessment.
- *Better than today.* Today the radar is purely relative to your own role target. A peer benchmark gives meaning to "I scored 2.4 — is that normal?".
- *Data/content needed.* A static `src/data/benchmarks.ts` seeded with published, sourced distribution values (e.g., OECD PIAAC numeracy band averages); opt-in local contribution collected in a separate localStorage key.
- *Effort.* M · *Risk.* Medium (must be opt-in, plain-language, never telemetry).

**5. Scenario-driven microlearning, 60-second daily card** — **WOW**
- *What.* After assessment, the Results page offers a "Daily judgment drill" of one scenario item per day, drawn from the unused 32 scenarios, with progress counter and a monthly "judgment delta" on the radar. Static: all 40 items already in `scenarios.ts`.
- *Serves.* All five tracks; particularly leaders who want lightweight reinforcement.
- *Better than today.* v8 has 40 scenarios used exactly once. Reusing them as spaced repetition is the highest-leverage use of existing content.
- *Data/content needed.* None new; just a `useScenarioDrill` hook and a localStorage counter.
- *Effort.* M · *Risk.* Low.

**6. Public "Editorial Board" + dated changelog** — **WOW**
- *What.* A standalone page listing the named reviewers (the 8 names from the prior synthesis + future invites), the dated cycle, the items that were contested (e.g., suppression of declining careers) with the minority view quoted, and a chronological changelog of every material data change.
- *Serves.* Owner personally (governance story for omary.me), and the skeptical reviewer.
- *Better than today.* Methodology page says "editorial"; the Board page shows who, when, what changed.
- *Data/content needed.* Static markdown compiled into a page; no schema changes.
- *Effort.* S · *Risk.* Low.

**7. Cross-role gap map ("role A → role B")** — **SHOULD**
- *What.* In the 24-role library, an "A vs B" mode lets you compare two roles' target polygons against your current scores. Tells you *what specifically* you'd need to develop to move between two roles (a common CIO/HR conversation: "could our data analyst move to product manager?").
- *Serves.* HR and career development.
- *Better than today.* Single-role targets exist; deltas between roles don't.
- *Data/content needed.* `roleLibrary.ts` already has targets per role; just the comparison UI.
- *Effort.* M · *Risk.* Low.

**8. Government skills heatmap (national) — anonymized by design** — **WOW**
- *What.* A static page that aggregates the 372-jurisdiction × 8-category consulting matrix from `sectorSkills.ts` into an 8-row × 14-region heatmap of skill demand, all sourced to the same official DGA workbook with a date stamp. Sharing forbidden: it is a static image render, not a query tool.
- *Serves.* Executive / policy maker: where is the country's cybersecurity need actually heaviest?
- *Better than today.* Today the data is per-entity detail; a national read-out doesn't exist.
- *Data/content needed.* Already present; needs the aggregation function and a static SVG heatmap.
- *Effort.* L (one-time build); *Risk.* Low (no PII; the data is agency-level not individual).

## D. Information architecture and journey

### Proposed 5-item top-level navigation (Arabic primary; English mirror)

1. **ابدأ التقييم** — `Assessment`
   - `WIZARD` (entry), `RESULTS` (after assessment), `PATHWAYS` (after assessment).
   - Why central: it is the one journey the product is genuinely world-class at.
2. **استكشف المستقبَل** — `Explore the future`
   - `FUTURE_SKILLS`, `LISTS` (growing/declining), `EXPLORE` (network map).
   - Why merged: today `lists` is orphaned as a third item that nobody clicks; `explore` lives alone. They are all "what's coming" views.
3. **الأدوار والمهن** — `Roles & careers`
   - `ROLES` (SFIA library), `CAREERS` (50-career catalogue), `TECH_RADAR` (48-tech TRL).
   - Why merged: a CIO who picks a role lands on the radar; a citizen picks a career. Same "what does this work look like" question, different lenses.
4. **للجهات الحكومية** — `For government entities`
   - `ENTITIES` (entry), `IMPACT` (national), `SECTORS`, `DIRECTORY`, `ENTITY` (detail).
   - Why merged: this is the second brand-pillar in HANDOVER §1 and currently spread across four top-level entries.
5. **المنهجية والأدلة** — `Methodology & evidence`
   - `METHODOLOGY`, `STANDARDS`, `SKILLS` (skill registry), and a new `EDITORIAL_BOARD` from proposal §C-6.
   - Why merged: today's three are spread and `standards` in particular is a credibility asset that should not sit behind a "Pro tools" dropdown.

**Removed from main nav:** `decide` (guidance quiz), `explore` (network map) demoted into item #2's secondary action; all of them still reachable from Home entrances.

**What stays in a footer/action cluster:** the citizen-service URLs (careers explore, guidance quiz), the print/PDF action on Results, and the language toggle.

### Persona journeys (after this restructuring)

- **Government employee (default).** Home → `ابدأ التقييم` (4-step wizard: track → role → 8 domains → 8 scenarios → 5 calibration) → `RESULTS` (dual radar + priority-ranked gaps + scenario agreement + change-since-last card) → `PATHWAYS` (top 3 priorities; 13-week plan; printable) → "Discuss with my manager" (proposal C-3) → revisit on `/results/:id` deep link.
- **CIO / executive.** Home → `للجهات الحكومية` → `IMPACT` (national enablement) → drill into a sector → see aggregate demand heatmap (C-8) → open an entity detail → trigger an entity brief (C-2) → printable charter for memo.
- **HR / transformation PMO.** Home → "For Entities" → Directory → create a team session (C-1) → share code with team → back to aggregated team view → suggest role moves (C-7) → per-entity enablement brief (C-2).
- **Citizen / student.** Lands on `/citizen` (separate route or hidden until the "للأفراد" toggle): careers catalogue → guidance quiz (with the empty-state fix) → explanatory article → exit toward doroob / Tamheer / TVTC — i.e. they leave the platform better-armed, not converted into pretend government employees.
- **Reviewer / journalist / skeptical CIO.** Home → `المنهجية والأدلة` → editorial board (C-6) → methodology page → changelog → credibility assured or disproven within 90 seconds.

### Arabic naming rules
- Items always start with a verb (ابدأ / استكشف / للجهات / الأدوار / المنهجية).
- Avoid the current "Pro tools" generic label (`أدوات متخصصة`) for top nav; reserve it for secondary actions only.
- Inside items, use Saudi-government conventions: "ركائز استراتيجية" not "strategic pillars (AR)"; no mixing of فصحى / عامية.
- Numeric spans are wrapped `<Num/>` from the start of v9; the `ar-SA-u-nu-latn` locale stays as the printout formatter.

### What gets merged, demoted, renamed or removed
- **Merge** `LISTS` into `FUTURE_SKILLS`.
- **Merge** `TECH_RADAR` into `ROLES & CAREERS`.
- **Demote** `RESULTS` and `PATHWAYS` from top nav to context-of-Wizard (Header already conditionally renders them when `history.length > 0` — keep that behavior, just remove them as primary tabs).
- **Demote** `DECIDE` and the entire citizen sub-track into a `/citizen` alternative route plus one footer link; do **not** delete — it's a real public-service asset.
- **Rename** `EXPLORE` → `الخريطة التفاعلية` with subtitle (already correct in EN) but the nav should read "الخريطة" not "Explore".
- **Add** an Editorial Board page + a dated changelog.
- **Remove** nothing; remove the "أدوات متخصصة" overflow menu in favor of the clean 5-tab structure (overflow menu becomes a personal-account dropdown).

---

*Sections E–H (engineering, content/evidence, rebuild plan, what-not-to-do) follow in the next call.*## E. Engineering review for a static deployment on omary.me

### E.1 Routing, deep links, back button, shareable URLs
The 19-view state machine in `src/App.tsx` (no router, no URL) is the single biggest engineering debt. The landing URL `omary.me/` should land on `view='home'`, but `omary.me/skills/results/2026-10-21/` is impossible today; users cannot bookmark a result, paste a colleague a "look at the careers page" link, or get back via the browser back button after drilling `Home → Careers → Career detail` (which resets to `Home` because the pending-state lives in memory and `go()` is a single `setView`).
- **Recommended approach:** add `react-router-dom@6` in *history* mode with `BrowserRouter` for `omary.me` (full origin) and keep `HashRouter` for the legacy `moalomary-ux.github.io/digital-skills-radar/` build via a build-time flag. Routes map roughly: `/` (home), `/assess` (wizard step 0), `/assess/:track/:roleId` (resumeable draft via a query string `step=N`), `/results/:resultId`, `/pathways/:resultId`, `/careers`, `/careers/:careerId`, `/tech`, `/tech/:techId`, `/roles`, `/roles/:roleId`, `/sectors`, `/sectors/:category`, `/directory`, `/entity/:entityId`, `/methodology`, `/standards`, `/skills`, `/impact`, `/future`. The existing `pendingXxxId` store fields become URL params.
- The draft state currently in localStorage (`LS_DRAFT`) survives a refresh but is destroyed by URL navigation if you have two tabs. Keep `localStorage` as the persistence backend; replace the pending-* state with `useParams`. Result history (`LS_HISTORY`) becomes a list page `/results`.
- A `Share result` button on `Results.tsx` copies `omary.me/results/<id>` to the clipboard (today there is no export at all). For privacy, results in URLs should be read-only snapshots stored under a content-hash key, not user ids.
- `window.scrollTo({ top: 0, behavior: 'instant' })` on every `go` call (`store.tsx`) should be moved into a `<ScrollRestoration />` helper from `react-router-dom` so the back button restores scroll position.

### E.2 Bundle size and code-splitting
The current build ships everything in one bundle. Worst offenders: `govEntities.ts` (13,629 lines, 682 entities), `careers.ts` (2,762 lines, 50 careers), `govEntityDetails.ts` (707 lines, big nested matrix), `learning.ts` (1,183), plus `public/logos/` (~485 PNGs). Actions for a static site on `omary.me`:
- **Logo strategy.** PNGs are not gzipped friendly. Convert the 485 logos to AVIF with a WebP fallback in a one-time `scripts/convert-logos.mjs` (use `sharp@0.33`). Keep `logo.png` as a final fallback. Most government logos are two-color vector-like marks; SVGs at ~2KB crush the median logo from ~30KB to ~2KB → saves ~13MB of payload, which is the single biggest Lighthouse win. If SVG is not politically clean (logos can be copyrighted, even unofficial), keep WebP at 70% quality. Either way, **lazy-load** logos with `loading="lazy"` and a 24x24 blurred placeholder (LQIP). Place `public/logos/` under `src/assets/logos/` and `import.meta.glob` to break logos per-route.
- **Route-level code-splitting.** Every view becomes `const Wizard = lazy(() => import('./views/Wizard'))` with `<Suspense fallback={<PageSkeleton />}>` in `App.tsx`. Wizard, Results, Pathways, TechRadar, EntityDetail and Explore are the heavy ones.
- **Data lazy-loading.** `govEntities.ts` (682 rows × ~14 fields each) should be replaced with a `data/entities/index.json` that is **split per-sector**: `data/entities/health.json` (≈25 KB each), fetched on demand when the Directory mounts a sector filter or a view needs an entity. Keep the full list behind a `/directory/all` route only. `govEntityDetails.ts` (the per-entity training matrix) similarly should be one JSON per entity slug; `EntityDetail` fetches one file.
- **Tree-shaking:** `framer-motion` imports are barrel-style today — replace with `motion/react` subpath imports. Recharts is not used (good), but `lucide-react` should not be either; `components/Icon.tsx` already wraps inline SVGs (keep).
- **Numbers & checklist:** a hard budget per route: home ≤ 180 KB gz, wizard/result ≤ 240 KB gz, entity detail ≤ 80 KB gz (because data dominates). Document in `vite.config.ts` via `vite-plugin-bundlesize`.

### E.3 Data loading strategy
- Static JSON under `public/data/` for the things the home page needs immediately (8 domains, 8 tracks, 5 track descriptions, headline stats). These are tiny and preloaded.
- Per-route JSON fetched on navigation, cached in a tiny in-memory `Map<string, unknown>` for the session (the data does not change inside a deployment).
- A separate `public/data/provenance.json` is exposed for the Methodology page (claim → source → year → type → reviewer). Currently the methodology text mixes this into prose — make it structured so both humans and a future automated checker can scan it.

### E.4 SEO, meta, OG, sitemap, per-page titles
- The current `index.html` has a static `<title>` and a single description. With a router, install `react-helmet-async` (smaller than `react-helmet`, well-maintained) and render per-route `<title>`, `<meta description>`, `<link rel="canonical">`, `<link rel="alternate" hreflang="ar">` and `hreflang="en"`, plus OG tags. The most share-worthy routes are: home, careers, future-skills, methodology and one career detail (e.g. `careers/ai-data-scientist`) and one entity detail (e.g. `entity/<slug>`) — generate static `og-default.png` (1200×630, branded) with a build step.
- `sitemap.xml`: build-time generate from a route list with `<xhtml:link rel="alternate">` for AR/EN. `robots.txt` allowing everything (no backend crawl traps).
- Arabic content in OG previews is messy on Twitter/Slack. Provide a 1200×630 with bilingual headline so the preview never looks half-Arabic half-broken.
- `JSON-LD` on the Methodology page declaring `creativeWork`, on results page a `Quiz` schema, on entity detail a `Organization`. Do not emit fake `GovernmentOrganization` schema.

### E.5 Accessibility (keyboard, ARIA, radar charts)
The remediation is partial. Required:
- Keyboard: the radar chart in `RadarChart.tsx` has axis spokes but no focus targets; add a per-axis `<g role="button" tabindex="0" aria-label="المجال X، الدرجة الحالية Y من ٤">` with Enter/Space calling `onAxisClick`. Currently keyboard users cannot drill into a domain from the radar.
- ARIA: `role="img" aria-label="..."` is already used on the SVG radar (good). Add `aria-describedby` pointing at the score table that exists just after the radar — the SVG can stay visual, the table is the accessible equivalent.
- The mobile scrollable nav row at the bottom of `Header.tsx` lacks `aria-label` and ignores arrow-key scrolling; add `<nav aria-label="primary" className="overflow-x-auto">` plus `tabIndex="0"` and `scroll-snap`.
- Color-only meaning: priority chips in `Results.tsx` (`priorityMeta`) carry color but no text prefix in some spots — every chip already includes an Arabic/English label, so this is fine; verify in EntityDetail and Impact.
- `prefers-reduced-motion` is respected globally (good). Add a setting toggle (persisted) so users without the OS flag can still opt out — useful for the executive demo where the user is screen-recording.
- Focus management after route change: route-level wrapper that moves focus to `<h1>`. Today the focus is lost on navigation.

### E.6 RTL correctness
Findings from the prior review, still live in parts:
- `Results.tsx` "3.00 / 4.00" rendered inside an RTL paragraph reads visually as "4.00 / 3.00" — the fix is `dir="ltr"` on the inner `<span>` wrapping the numbers; the template already uses `dir="ltr"` for some numbers but inconsistently. Audit every Arabic paragraph containing Western digits.
- `Results.tsx:182` is still quoted; bring up all places that mix Arabic letter context with `/` and `%`.
- `RadarChart.tsx` reverses angle direction (`dir: 1 | -1 = lang === 'ar' ? -1 : 1`) — good. Verify the *label anchor* is correct for RTL: text-anchor depends on the cosine, which is already handled.
- The number formatting calls `.toLocaleString('en-US')` deliberately (Western digits per spec). Good.
- IBM Plex Sans Arabic is loaded via Google Fonts with `preconnect` — fine for now; self-host the woff2 from `public/fonts/` to avoid a third-party request from Saudi Arabia where Google Fonts can be slow.

### E.7 Performance budget
- LCP ≤ 2.0 s on a mid-tier Android (Moto G4 class). The home hero radar is the LCP candidate; render the SVG without the polygons until idle, and use a small placeholder radar so FCP < 1 s.
- CLS ≤ 0.05: the floating hero (`animate-floaty`) is a CLS risk; either prefers-reduced-motion clip or restrict to ≥1024px.
- TBT ≤ 100 ms on the home page.
- The 485 logos cost ~0 ms each because of `loading="lazy"`, but the LQIP placeholder color is gray for all — this is fine and intentional.

### E.8 PWA / offline
The product is offline-friendly by design (all data files, localStorage). Adding PWA is cheap and a strong product signal:
- `vite-plugin-pwa` with `registerType: 'autoUpdate'`, `manifestIcons` generated from the radar mark, `display: 'standalone'`, AR/EN manifest via `name` and short_name.
- Service worker strategy: `precacheAndRoute` for fonts and the route-level JS chunks; `NetworkFirst` for `data/` JSON with `ExpirationPlugin` (50 entries, 30 days); `StaleWhileRevalidate` for Google Fonts.
- After install, the wizard works in a plane — strong demo moment for the GM.

### E.9 i18n approach
Today: hand-written `{ ar, en }` literal objects everywhere with a `t(l)` helper. This is *good* for evidence integrity (you cannot auto-translate Saudi-specific categories). Keep it. Improvements:
- Use `Intl.Segmenter('ar')` for safer Arabic line wrapping in the radar labels (currently naive `split(' ')` in `wrapLabel`). Arabic wraps on letters, not words.
- Centralize `ar/ar-SA` `DateTimeFormat` and `NumberFormat` into one `lib/format.ts`; today they are sprinkled inline (Results, Pathways, Impact, EntityDetail).
- For IDs, keep the English keys (`ai-data`, `awareness`) but render Arabic-only labels in the UI; for URL slugs of careers and entities use deterministic Arabic+slug transliteration, or English fallback — never raw Arabic in URLs (URL-encoding destroys shareability).

### E.10 Testing strategy for a static site
Cheap and high signal:
- **Unit:** Vitest for pure functions (`computeScores`, `stageForScore`, `levelForScore`, `scenariosForTrack`, `agreementMeta`, `fillPlanText`). Snapshot the rationale strings? No — too brittle. Just assert ranges.
- **Boundary regression:** keep and extend `scripts/levels.selftest.mjs` (currently 24 asserts). Add 8 more for: empty draft, all-answers-4 (force "leading"), all-answers-0 (force "foundation"), score exactly 1.245 (the historic gap bug).
- **Integration:** Playwright, 3 files: (1) wizard happy path AR, (2) wizard happy path EN, (3) "complete wizard → see result → reload → result still there".
- **Visual:** none needed; the design is bespoke SVG.
- **Axe-core smoke:** one Playwright test that runs `@axe-core/playwright` on each route on `/en` and `/ar`. Threshold: zero serious or critical violations.
- **Lighthouse CI:** budget assertions per route, run in a GitHub Action on PR.

### E.11 Build and deploy pipeline
The platform's value prop is "credible, finished product" — that includes the deploy story:
- Repo: keep `moalomary-ux/digital-skills-radar` until the omary.me domain is confirmed. Add a `CNAME` file with the domain.
- Branches: `main` (source), `gh-pages` (current Pages output) — for omary.me either keep Pages with custom domain or move to Cloudflare Pages (free, branch previews, no `base: '/digital-skills-radar/'` constraint, no `.nojekyll` hassle).
- CI: GitHub Actions; jobs: install → typecheck → test → vitest → axe → build → size-budget → upload to Pages. Add `gitleaks` to keep API keys out.
- Preview deployments per PR via Cloudflare Pages or Netlify — gives the GM a link to send reviewers. Powerful for a concept demo.
- Sentry-free error reporting: the static build cannot silently fail. Add a tiny `lib/error-boundary.tsx` that logs to `console.error` and shows an Arabic error message — at least the user gets a path forward.

---

## F. Content and evidence review

The committed review board flagged content as the platform's biggest strength *and* its biggest latent risk. Specific items that will embarrass in front of a Deputy Minister, with file:line evidence where possible:

1. **Outdated NEOM / The Line evidence.** `src/data/careers.ts` carries career entries built on the 170 km / 500 m tall / 9 million population framing. Public reporting since 2024 (Bloomberg, FT, Reuters) has The Line scaled back to ~2.4 km with major contracts cancelled. Search for `نيوم`, `ذا لاين`, `170`, `2.4` in `careers.ts` and rewrite the justification text. Flag on the card: "أرقام المشروع الوطني تعكس آخر إعلان موثق في YYYY-MM" — and link the source.

2. **Unbacked figure 663,000 "skilled workers".** A specific career card cites "663 ألف عامل ماهر" framing sector demand. No in-repo source; no link. Replace with a band ("عشرات الآلاف") or quote the exact statistic with `source.url`, otherwise delete.

3. **Tuwaiq 80% used three times as a market signal.** `learning.ts` and `guidance.ts` reference "~80% من خريجي أكاديمية طويق يحصلون على وظائف خلال 6 أشهر" — this is the academy's own self-reported figure presented as objective market data. Either (a) keep with `sourceType: 'self_report'` and a tagline "بلا تحقق مستقل" or (b) drop. The Saudi-market reviewer's P0/2 is right: this becomes a counter-example in a hostile room.

4. **"95% of cyber incidents" framing.** Cited in `learning.ts` and inside domain descriptions for cyber. It is from a vendor survey, not a national statistic. Relabel to "95% من الحوادث كان يمكن تفاديها بأساسيات الأمن — وفق استطلاع ممارسين" with source.

5. **Confident future-call language.** The career card "صيدلي مجتمع" carries "احتمال تقلص الصيدليات المجتمعية بسبب أتمتة الوصفات" without specifying that this is an OECD/USA trend, not a KSA regulatory one. Saudi MoH has not announced such automation. Replace with "وفقًا لتقارير NASK/ILO 2025 لا توجد إشارة سعودية رسمية لأتمتة الوصفات؛ هذا الحكم قائم على أدلة دولية" and `source.attribution: 'editorial'`.

6. **Translation/asymmetry bugs.**
   - `careers.ts` mixes "Legal Secretary" with "كاتب عدل / Paralegal Clerk". *Katb al-Adl* is a Saudi notarial profession; *legal secretary* is office support. The current mapping in `categoryById` lumps both. Split.
   - "أخصائي بيانات ضخمة" vs "عالم بيانات" — currently appear interchangeably.
   - `careerCategories` includes `entertainment_events`, `gaming_esports`, `mining`, `sports` — these keys are stable, but the Arabic `name` for some (e.g. `agritech`) is editorial. Verify with a native editor.
   - The methodology page declares ISCO-08 codes as "approximate." Good — keep that line but also add "(قارن بنفس المهنة في [التصنيف السعودي الموحد للمهن] قبل الاستخدام في قرارات التوظيف)".

7. **TSL stage thresholds presented as data.** The user-facing display rounds scores to one decimal (good per P1-6) but the labels still say "1.25/2.25/3.25" in several tooltips. Make sure the only places these numbers appear are inside the Methodology page; everywhere else shows the band name. Audit `Results.tsx` and `Pathways.tsx` (text strings) for stray decimals.

8. **Eastern vs Western digits.** Hardcoded strings in `Home.tsx` (`headlineStats`) and inside `careers.ts` evidence prose occasionally use Arabic-Indic digits inside Arabic sentences — visible next to a Western-digit KPI and immediately reads as careless. Standardize: every user-facing number uses `Intl.NumberFormat('en-US')` rendered with `dir="ltr"`.

9. **Naming inconsistencies across views.** `Home.tsx` calls the institutional backdrop `الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)` once and `الهيئة الحكومية الرقمية` elsewhere. The methodology page says `مستلهم من رادار GovTech التابع لهيئة الحكومة الرقمية`. Pick one Arabic institutional name and keep it. The footer says "A concept prototype inspired by global frameworks (WEF, ILO, OECD, SFIA, DigComp) — not affiliated with any official entity." Good — but the Arabic footer text should *also* list the inspiration explicitly so Arabic readers are not left to infer.

10. **Sectors page list of 31 contains "أخرى / Other".** When a sector is labeled "أخرى" it usually hides data quality problems; the `govSectors.ts` should not have a residual bucket. Investigate; if unavoidable, document the threshold (anything <N entities).

11. **Mixed Arabic terminology for the same concept.** The codebase uses both "ذكاء اصطناعي توليدي" and "ذكاء توليدي" interchangeably. Pick the formal one (SDAIA / NLUQ usage: "الذكاء الاصطناعي التوليدي"), and add a glossary entry.

12. **"Future Skills 2026-2030" page** carries wiggly statements like "ستنخفض الحاجة إلى السكرتارية الإدارية بنسبة X%" without linking WEF page or table — at minimum add a per-domain footnote table on the methodology page (`futureSkills → provenance`).

13. **Disclaimer phrasing.** `Disclaimer.tsx` is solid, but make sure it is invoked on the Results page *before* any score appears (review board flagged that the radar shows first, disclaimer second on some devices — flip the order on mobile).

The rule of thumb: **any number visible without `source.name + source.year + source.type` within a click must be either removed or moved into the methodology page behind a "اعرف أكثر" disclosure.** A 6-second mental check in front of a CIO.

---

## G. A rebuild plan for an intensive 1–2 day push by AI coding agents

Twelve packets, ordered for least-dependency-first so parallel AI agents can race. Total estimated scope: ~14–18 hours of focused agent work + reviewer validation.

**Packet 1 — Router skeleton (parallelizable: no).**
- Scope: add `react-router-dom@6`, create `src/routes.ts` with the 13–15 routes from §E.1, wrap `App.tsx`, add `<ScrollRestoration/>`, add `lib/format.ts`.
- Files: `package.json`, `src/App.tsx`, `src/main.tsx`, `src/routes.tsx`, `src/components/PageShell.tsx` (wraps header/main/footer per route), new file `src/lib/format.ts`.
- Acceptance: every existing view loads under `/<view>`, browser back/forward navigates correctly, hard refresh on `/results` still works (results come from localStorage so they survive), URL writes & history behave, no console warnings.
- Dependencies: none. (Block everything else until this lands.)

**Packet 2 — View lazy-loading and Suspense (parallelizable: yes).**
- Scope: convert every `import View from './views/X'` in `App.tsx` to `const View = lazy(() => import('./views/X'))`, add `<Suspense fallback>`, hoist `framer-motion` to per-view imports.
- Files: `src/App.tsx`, possibly per-view.
- Acceptance: `vite build --analyze` shows route-level chunks; home chunk ≤ 180 KB gz; routes not in initial route are split.
- Dependencies: Packet 1.

**Packet 3 — Data files split per-route (parallelizable: yes).**
- Scope: write `scripts/split-data.mjs` that splits `govEntities.ts` into 31 sector JSONs and `careers.ts` into 25 category JSONs; create `src/data/byRoute/<route>.ts` that exports the full arrays (so existing imports keep working) and write per-route JSON for the lazy paths.
- Files: new `src/data/json/*`, `scripts/split-data.mjs`, light edits to `Directory.tsx`, `EntityDetail.tsx`, `Careers.tsx` to import the JSON.
- Acceptance: `EntityDetail` payload on first load ≤ 80 KB gz; directory paginated by sector; `npm run build` succeeds.
- Dependencies: Packet 1.

**Packet 4 — Provenance table & Methodology v2 (parallelizable: yes).**
- Scope: introduce `src/data/provenance.ts` as the single typed `Claim → Source` table (already partially discussed in synthesis). Embed every numeric claim with a `claimId` and lookup. Generate a `provenance.json` with `[ { claim, source, year, type, reviewer, lastVerified } ]`. Update `Methodology.tsx` to render an interactive table with filters. Add a "Source verified by …" pill anywhere a number appears (centralize into a `<Claim value={1} claimId="wef-foj-2025-net-jobs"/>` component).
- Files: `src/data/provenance.ts` (new), `src/views/Methodology.tsx`, `src/components/Claim.tsx` (new), edits in `Home.tsx`, `Careers.tsx`, `Impact.tsx`, `Pathways.tsx`, `Results.tsx`.
- Acceptance: every KPI in `Home.tsx`, `Impact.tsx`, `EntityDetail.tsx` shows a `Source verified by X — date` chip; the methodology page renders a filterable table with ≥ 30 claims.
- Dependencies: Packet 1.

**Packet 5 — Content fixes (the embarrassing items in §F).**
- Scope: drop or rewrite the NEOM / 663K / Tuwaiq / 95% / 58% references; fix the Legal Secretary / كاتب عدl split; standardize digit direction; pick one canonical institution name.
- Files: `careers.ts`, `learning.ts`, `guidance.ts`, `Home.tsx`, `Footer.tsx`, `Methodology.tsx`, `results.tsx`.
- Acceptance: grep for `663`, `170`, `95%`, `~80%`, `كتابة العدل` returns only the standardized usages or the explicit "self-report" framing.
- Dependencies: Packet 4 (so the rewrites can attach a `claimId`).

**Packet 6 — Accessibility & RTL pass (parallelizable: yes).**
- Scope: per-radar focusable axes, axe-core pass, focus management on route change, self-hosted IBM Plex Sans Arabic woff2, screen reader table for radar, `prefers-reduced-motion` user setting in localStorage.
- Files: `RadarChart.tsx`, `TechRadarChart.tsx`, `Header.tsx`, `App.tsx`, `index.css`, new `src/lib/motion.ts`.
- Acceptance: axe-core zero serious/critical on `/`, `/careers`, `/entity/<id>`, `/results/<id>`, `/methodology`; Lighthouse accessibility score ≥ 95 across these; LCP < 2 s mid-tier mobile.
- Dependencies: Packet 1.

**Packet 7 — PWA / service worker / offline (parallelizable: yes).**
- Scope: `vite-plugin-pwa`, manifest EN+AR, precache of fonts and route chunks, LQIP for logos, install banner logic respecting `beforeinstallprompt`.
- Files: `vite.config.ts`, new `public/manifest.webmanifest`, `public/sw.js` (generated), `index.html`.
- Acceptance: installable in Chrome/Edge on desktop; in airplane mode the home + wizard render; Lighthouse PWA category ≥ 90.
- Dependencies: Packet 2.

**Packet 8 — Logo pipeline (parallelizable: yes).**
- Scope: `scripts/convert-logos.mjs` using `sharp@0.33` to produce AVIF + WebP, `import.meta.glob('./assets/logos/*.{avif,webp,png}')`; LQIP pipeline; lazy loading; `EntityLogo.tsx` updated to `<picture>` with `srcset`.
- Files: `scripts/convert-logos.mjs`, `public/logos/` → `src/assets/logos/`, `EntityLogo.tsx`, `Directory.tsx`, `EntityDetail.tsx`, `Impact.tsx`.
- Acceptance: directory page payload ≤ 250 KB gz on first load (logos lazy), Lighthouse LCP ≤ 2 s on the directory route.
- Dependencies: none (works against the current router).

**Packet 9 — Tests + CI (parallelizable: yes, after packets 1–6).**
- Scope: Vitest for pure functions, Playwright for wizard happy path (AR + EN) and results persistence, axe-core for routes, Lighthouse CI budgeted per route, GitHub Actions workflow with size budget.
- Files: `tests/`, `.github/workflows/ci.yml`, `vite.config.ts`.
- Acceptance: CI green on a fresh clone; `vitest run` ≥ 80 assertions; Playwright 3 specs all pass; `lhci autorun` fails the build if any budget regresses.
- Dependencies: Packets 1, 2, 6.

**Packet 10 — SEO / meta / OG / sitemap (parallelizable: yes).**
- Scope: `react-helmet-async`, per-route `<title>` and meta, `og-default.png` build step, sitemap generator, hreflang alternates, JSON-LD on key routes.
- Files: `src/components/Meta.tsx` (new), `src/lib/seo.ts`, `scripts/generate-sitemap.mjs`, `public/og-default.png`, edits in route files.
- Acceptance: `view-source:` shows correct `<title>` per route; Lighthouse SEO ≥ 95 on every public route; sitemap validates against `xml-sitemaps.com` schema.
- Dependencies: Packet 1.

**Packet 11 — Demo polish & share (parallelizable: yes).**
- Scope: a single "Share result" button on `Results.tsx` that copies a read-only URL; a "Print to PDF" button that uses `window.print()` already wired but lacks a print stylesheet enhancement; a "Compare with another role" toggle on Results that re-renders the target polygon without redoing the wizard; an "Export plan as PDF/calendar (.ics)" button on Pathways.
- Files: `Results.tsx`, `Pathways.tsx`, `index.css` (`@media print` rules), `src/lib/ics.ts`.
- Acceptance: print preview in Chromium shows a clean 2-column results report; .ics download opens in Google Calendar with 13 weekday events.
- Dependencies: Packets 1, 4.

**Packet 12 — Deploy to omary.me (parallelizable: yes, after all others).**
- Scope: switch `base: '/'` in `vite.config.ts`, set up Cloudflare Pages or GitHub Pages with custom domain, `CNAME`, redirect from old `moalomary-ux.github.io/digital-skills-radar/` to `omary.me/some-landing` with a "moved" notice for 90 days, configure HSTS, configure caching headers for `data/*.json` and static logos, verify Lighthouse + WebPageTest in production.
- Files: `vite.config.ts`, `public/CNAME`, `dist/`, deploy config.
- Acceptance: omary.me serves the production build with all routes 200, WebPageTest LCP ≤ 1.8 s, security headers `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal.
- Dependencies: all of the above.

**Critical path:** 1 → 6 → 9 → 12. Everything else can be parallelized by different agents.
**Estimated wall clock:** ~30 hours with three agents working in parallel, ~52 hours solo. A 1–2 day push is realistic for a focused team with the above scoping.

---

## H. What NOT to do

Each of these ideas will feel attractive and will erode the product's specific credibility. Resist.

1. **Do not add a "Send results to a manager / HR" feature.** Privacy is a hard constraint and a competitive advantage. The platform's promise is "your data stays in your browser." Even an opt-in backend removes the trust signal and converts the demo into a surveillance risk. The "shareable URL" in Packet 11 stays client-side: the *user* chooses what to share and how.

2. **Do not add a leaderboard / "your rank vs other government employees".** Even anonymous, this generates perverse incentives (people will game the self-report scale) and pollutes the assessment's evidence layer. The synthesis flagged this kind of cross-user comparison explicitly; keep assessment strictly individual.

3. **Do not auto-translate the 50 career entries with an LLM.** The current Arabic prose is careful and editorially specific. A wholesale translation pass will inject inconsistencies (see `careers.ts` Legal Secretary example) and is exactly the kind of "looks finished, is sloppy" thing a deputy minister will spot in 90 seconds. If more bandwidth appears, add Arabic content line by line with a native editor.

4. **Do not replace the editorial scenario items with AI-generated ones.** They will sound plausible and be untestable. The 40 are a *deliberate* first small set; document the small-N limitation (as already done in the Methodology page) rather than fake bigger coverage.

5. **Do not claim field-validation that doesn't exist.** The scenarios and the 1.25/2.25/3.25 thresholds are documented as editorial. Do not soften that line ("validated with our pilot") to please a sales conversation; it is the kind of phrasing the previous reviewers specifically warned would trigger a credibility collapse.

6. **Do not generalize "the Saudi government" from a 682-entity workbook.** The data is rich and valuable; using phrases like "the Saudi government is moving toward AI because 25% of consultations in 2024 were AI-related" overstates it. The workbook reflects the entities that *requested* help from the DGA practice, which is a self-selected subset. State the denominator plainly.

7. **Do not add live data feeds or live ticker visuals.** An "AI sector watch" widget with shimmer is the prototype of low-trust visualization; static, source-cited, dated screenshots are the right answer. A live element implies a real-time method which you cannot defend.

8. **Do not raise the language to "وبائيات" or "حوكمة البيانات الضخمة".** The platform's strength is plain Arabic that a deputy minister reads in 5 seconds. Adding jargon to look authoritative does the opposite.

9. **Do not offer "AI mentor" / chatbot inside the wizard.** It would convert a measurement instrument into a coaching session; the methodology wasn't designed for that, and ChatGPT-style hallucination in this context is a major liability. A static "if your score is < X, do Y" hint is enough.

10. **Do not let the four entrances from `Home.tsx` (employee / specialist / manager / executive) become decision trees with parallel content versions.** Each entrance can vary the wording of the *next step* (what role to pick), but the underlying assessment, scoring, and roadmap stay one thing. Duplicating the experience dilutes the evidence base and quadruples maintenance.

11. **Do not import or display any official DGA, SDAIA, or other government logo to "look more official."** The synthesis is explicit: this is the single fastest path to "concept prototype" being reclassified as "impersonation," and that ends the platform. Keep the DGA-inspired theme, drop the official mark.

12. **Do not track anyone.** No analytics SDK, no cookie banner, no Google Analytics, no Plausible with cookies, no `navigator.sendBeacon` pings. A privacy-respecting, no-tracking static site in 2026 is a feature; a "trustworthy" footer disclaimer with a tracker underneath is the most common mistake in this category and the easiest to call out on stage. If telemetry becomes essential later, do it via an opt-in, plainly explained, on-device aggregation layer (e.g. a client-side histogram the user can choose to share) — never the default.

13. **Do not turn "90-day plan" into a project-management system with assignments and due dates.** The plan is a reflective artifact. A Gantt chart in front of a CIO changes the conversation from *learning* to *delivery* and the platform is not equipped to manage either.

14. **Do not promise integration with Nafis, Taqat, Qiyas, HRSD datasets.** Each integration needs a formal data-sharing agreement and PDPL review; claiming it before the agreement exists turns a concept demo into an overpromise. The "soon" framing already used on the Methodology page is the right level.

---