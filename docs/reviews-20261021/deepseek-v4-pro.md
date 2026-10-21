## A. Verdict (10 lines max)

- **Product concept — 8/10.** A rare, well-scoped “human skills radar” for the Saudi government workforce that turns global evidence and official service records into development planning, not just another tech list.
- **User journey — 5/10.** The journey is fragmented across 19 state-switched views with no URLs, no shareable results, no back-button support, and the public career-guidance path competes with the government core.
- **Visual/brand — 8/10.** The DGA-inspired theme is coherent, RTL-aware and visually credible, but it occasionally tips from “inspired by” into “could be mistaken for official.”
- **Engineering — 5/10.** Clean React/TypeScript and honest static architecture, but no router, a 13,629-line `govEntities.ts` in the bundle, 485 logos loaded eagerly, minimal testing, and no SEO/prerender.
- **Content/evidence — 7/10.** Source discipline is above average and the limitations are published, but Arabic overclaims, leftover English fields, a visible 20-vs-24 role count inconsistency, and exposed per-entity service records would still embarrass the owner in front of a senior government audience.

---

## B. Top 10 weaknesses, ranked by impact on a senior government audience

### 1. No deep-linkable routes or shareable URLs
**Why it matters:** A Deputy Minister or HR director cannot send a peer a link to an entity detail page, a result, a role gap map, or a specific sector. The browser back button exits the app rather than going to the previous view. Every page literally has the same URL.  
**Evidence:** `src/App.tsx` renders views via `const { view } = useApp()` and `view === 'home' && <Home />` etc.; `src/store.tsx` holds `view` state and `go` is only `setView(...) + window.scrollTo`, no history API.  
**Fix sketch:** Adopt `react-router-dom` with real route paths such as `/ar/entities/:entityId`, `/ar/results/:resultId`, `/ar/future-skills`; remove `view` as the navigation source of truth; use `useParams`, `useSearchParams` for cross-view pending IDs.  
**Effort:** M.

### 2. Massive government data and logos loaded upfront
**Why it matters:** `govEntities.ts` is 13,629 lines and `public/logos/` contains 485 PNGs. The current Vite setup imports the data statically, so the main JS bundle includes the full entity corpus and the page may eagerly request many logos. Senior users on mobile, government VPNs, or older devices will experience slow load.  
**Evidence:** File inventory `src/data/govEntities.ts` 13,629 lines; `src/components/EntityLogo.tsx` plus `public/logos/`; no `React.lazy` or data code-splitting in `src/App.tsx`.  
**Fix sketch:** Convert `govEntities.ts` to JSON/dynamic import, lazy-load views with `React.lazy`, add IntersectionObserver-based logo loading, generate WebP/AVIF thumbnails, and use Vite manual chunks.  
**Effort:** L.

### 3. Official per-entity service records are exposed without a data-governance frame
**Why it matters:** The Impact page and entity detail page show exact training records, consulting services, and top consulting text per entity. A senior official may read this as an implicit performance rating of government agencies, or question why internal DGA service data is public on `omary.me`.  
**Evidence:** `src/views/Impact.tsx` presents `7,915`, `2,873`, `377`, `421` as national KPIs; `src/views/EntityDetail.tsx` renders exact `svc.trainingBeneficiaries`, `svc.consultingServices`, `svc.totalBenefit`, and `svc.topConsulting`; `src/data/govEntityDetails.ts` stores per-entity records.  
**Fix sketch:** Default to sector/dashboard aggregates; gate entity-level detail behind an explicit “سجل خدمي — للاستئناس” label; show data extraction date, method link, and “لا يُستخدم لتقييم الجهة”; obtain owner permission if exact entity rows stay public.  
**Effort:** M.

### 4. Arabic overclaim words remain in core flow
**Why it matters:** The home hero says the radar “**يقيس موقعك**” even though the Methodology page correctly says the assessment is editorial, self-reported, not field-validated. The term “معايرة معرفية” or “calibration” still appears in the data/legacy naming. A senior official who reads the methodology after seeing “measurement” will see a credibility gap.  
**Evidence:** `src/views/Home.tsx` hero: “رادار المهارات الرقمية **يقيس موقعك** عبر ثمانية مجالات”; handover known limitation: scenario items and stage thresholds are editorial; `src/data/learning.ts` includes `questionsForDomain` originally framed as “calibration.”  
**Fix sketch:** Replace “يقيس” with “يقدّر/يكشف تقديرك”; replace “معايرة” with “تحقق معرفي” or “أسئلة تحقق” across code, UI, and documentation; add a one-line scope note next to every result.  
**Effort:** S.

### 5. Dual product confusion: government workforce development vs public career guidance
**Why it matters:** The product’s core audience is government employees and leaders, but top-level navigation places “اكتشف التخصصات” and “اختبار التوجيه” at the same level as “تقييم المهارات,” and the home page has a large public “للأفراد والطلاب” section. A senior government visitor may see it as a generic career site rather than an institutional capability tool.  
**Evidence:** `src/components/Header.tsx` mainItems include `wizard`, `careers`, `decide` side by side; `src/views/Home.tsx` has a secondary public-service track with citizen links; `src/store.tsx` has one global `view` namespace for both audiences.  
**Fix sketch:** Demote public guidance to a separate “استكشاف مهني” path or a clearly labeled secondary area; make government journeys the dominant IA; rename and reorder top navigation accordingly.  
**Effort:** M.

### 6. Inconsistent role count and mismatched labels
**Why it matters:** The wizard says “مكتبة الأدوار (20 دورًا)” while the home page says “الأدوار الأربع والعشرين.” A government reviewer will notice this immediately and question the quality of the data and the editing.  
**Evidence:** `src/views/Wizard.tsx` heading: `أو دور وظيفي دقيق — مكتبة الأدوار (20 دورًا)`; `src/views/Home.tsx` entrance 2 says “مكتبة الأدوار الأربع والعشرين”; handover and `src/data/roleLibrary.ts` contain 24 roles.  
**Fix sketch:** Create a single `roleLibrary.length`-driven label, fix the wizard copy, and add a content-consistency test that checks all user-facing role counts.  
**Effort:** S.

### 7. Single URL means no per-page title, description, OG, or sitemap
**Why it matters:** Sharing any page shares the home page. Search engines and chat apps show the generic home title. For a flagship product on `omary.me`, this looks unfinished.  
**Evidence:** `index.html` has one global `<title>` and one `<meta name="description">`; `src/store.tsx` changes `view` without touching the URL or document title; there is no sitemap or route-based metadata.  
**Fix sketch:** Use `react-router-dom` + `react-helmet-async`; pre-render key routes with `vite-ssg`; generate `sitemap.xml`, `robots.txt`, and per-language canonical/OG tags.  
**Effort:** M.

### 8. Accessibility of custom SVG charts is incomplete
**Why it matters:** The radar and horizontal bar charts expose only generic `aria-label` values; screen-reader users cannot navigate the axes or read the underlying values. Government digital platforms are expected to be accessible by law and by audience.  
**Evidence:** `src/components/RadarChart.tsx` has `role="img" aria-label="skills radar chart"` with no data table; `src/views/Impact.tsx` bar charts use `<title>` only and generic `aria-label`; no keyboard navigation for radar vertices beyond optional `onAxisClick`.  
**Fix sketch:** Add visible or visually-hidden data tables, keyboard-focusable axes, `aria-describedby`, live region for results, and `axe-core` checks in CI.  
**Effort:** M.

### 9. No visible data-governance cadence or “last updated” framing for official numbers
**Why it matters:** The official workbook data will change. A senior audience will ask “when was this extracted? Who approved these numbers?” The current Impact page says “2021 to 2026” but does not show an extraction date, version, or link to the data pipeline report prominently.  
**Evidence:** `src/## C. Idea evolution — six to ten proposals

### C1 — Entity Skills Demand Brief (one-page printable)
**What:** Compose the existing per-entity `entitySkillProfile` into a single A4 “skills demand brief”: top 3 demanded domains, sector benchmark, mapped target roles from `roleLibrary.ts`, and a readiness CTA for the entity’s staff.
**Who it serves:** HR directors, entity leaders, consulting teams.
**Why it is better than what exists:** `EntityDetail.tsx` currently shows raw bar charts and chips but no synthesised, exportable artifact a manager can take to a meeting.
**Data/content needed:** Existing `govEntities.ts`, `govEntityDetails.ts`, `sectorSkills.ts`, `roleLibrary.ts`, `domains.ts`.
**Effort:** M.
**Risk:** May be misread as an official evaluation of the entity; mitigate with a permanent “مؤشرات خدمية للاستئناس فقط — لا تُستخدم لتقييم الجهة” disclaimer.
**Tag:** MUST.

### C2 — Team aggregation via local export/import
**What:** Add an “تجميع الفريق” view where a coordinator imports anonymous CSV/JSON exports from employees’ assessments, then sees a team radar, aggregated gaps, and suggested learning themes. No backend: every participant uses the existing print/export, and the coordinator loads the files into their browser.
**Who it serves:** Managers and enablement leads who need a quick team-level digital skills picture.
**Why it is better:** Today the product is strictly individual; managers must reason one-by-one. This gives static-only team insight without a server.
**Data/content needed:** Result schema from `store.tsx`; anonymised export/import functions; aggregate functions over `answers`, `scores`, `scenario`.
**Effort:** L.
**Risk:** Privacy/HR risk even when anonymous; keep exports explicitly local, no cloud, no automatic submission, and show the anonymity guarantee.
**Tag:** SHOULD.

### C3 — Printable/PDF Development Report
**What:** Upgrade current print CSS into a structured development report: radar, priority table, evidence layer summary, 90-day plan, resource links, disclaimer.
**Who it serves:** Employees, managers, reviewers.
**Why it is better:** Current `window.print()` prints the on-screen page but does not produce a clean storable artifact.
**Data/content needed:** `Results.tsx`, `Pathways.tsx`, `conclusions`.
**Effort:** S.
**Risk:** Very low.
**Tag:** MUST.

### C4 — Scenario Practice Mode
**What:** After the assessment, open the weakest two domains as a weekly scenario practice sequence: user reads the Saudi workplace situation, chooses a response, sees the rationale and score, then gets a 10-minute real-world challenge.
**Who it serves:** Employees who want development, not just a diagnosis.
**Why it is better:** The 40 scenarios in `scenarios.ts` are already authored and evidence-layered, but only used inside the wizard. Reusing them closes the loop from measurement to practice.
**Data/content needed:** Existing `scenarios.ts`, `ScenarioItem`, `Pathways.tsx`.
**Effort:** M.
**Risk:** Scenarios are editorial and unvalidated; label them as “تمارين مواقف مهنية — غير معايرة” and never as scored selection tests.
**Tag:** SHOULD.

### C5 — Editorial Benchmarks Against Published Norms
**What:** Add static benchmark bands for common roles/tracks based on published skill-proficiency surveys, labelled as editorial comparators, not live measurement.
**Who it serves:** Individual employees, managers interpreting a result.
**Why it is better:** Users currently only see their own number and a role target; a “كيف يبدو الممارس في جهات أخرى؟” anchor adds meaning without back-end.
**Data/content needed:** New `benchmarks.ts` with WEF/Coursera/SFIA-derived editorial bands; displayed in `Results.tsx`.
**Effort:** S/M.
**Risk:** Danger of false precision; use qualitative bands only, no percentiles.
**Tag:** SHOULD.

### C6 — Role Gap Maps per Entity/Sector
**What:** Extend entity/sector pages with “ما الأدوار الأكثر فجوة؟” mapping: each sector’s top demanded domain mapped to the 24 roles from `roleLibrary.ts`, with target vs generic current profile.
**Who it serves:** HR directors and sector-level planners.
**Why it is better:** `EntityDetail.tsx` currently maps skill domains only; decision-makers plan roles, not abstract domains.
**Data/content needed:** `sectorSkills.ts`, `roleLibrary.ts`, `tracks.ts`.
**Effort:** M.
**Risk:** Editorial mapping may look authoritative; document method and mark as indicative.
**Tag:** MUST.

### C7 — Executive “Invest/Ignore” Briefs
**What:** For each family in `technologies.ts`, add a short governance sheet: decision criteria, success/stop conditions, fit to five tracks, source confidence, and a sample 90-day executive action.
**Who it serves:** Executive and strategic track users.
**Why it is better:** `TechRadar.tsx` currently presents TRL rings and justifications but not the executive’s judgment template.
**Data/content needed:** `technologies.ts`, `tracks.ts` executive `proves`, methodology definitions.
**Effort:** M.
**Risk:** Could imbue editorial judgments with false formal authority; anchor to published framework and mark as decision support.
**Tag:** WOW.

### C8 — National Skills Demand Explorer
**What:** Rework `GovSectors.tsx` and `Impact.tsx` into one filterable explorer: sector, region, year range, consulting category, and top demanded domains; export CSV or print summary.
**Who it serves:** Policy leads, HR planners, consulting teams.
**Why it is better:** Current dashboards are static and separate; a filterable view turns official records into a planning tool without backend.
**Data/content needed:** `govServices.ts`, `sectorSkills.ts`, `govEntities.ts`.
**Effort:** M.
**Risk:** Regional or small-sample cuts may be statistically misleading; show counts and suppress very small cells.
**Tag:** SHOULD.

---

## D. Information architecture and journey

### Top-level navigation — 5 items

1. **الرئيسية** (Home)
2. **التقييم والتطوير** (Assessment & Development)
3. **الجهات والقطاعات** (Entities & Sectors)
4. **الاستشراف والأدوات** (Foresight & Tools)
5. **التوجيه المهني** (Career Guidance)

### What to merge, demote, rename, remove

- Merge `wizard`, `results`, `pathways`, `roles` into **التقييم والتطوير**; show `results` and `pathways` only after an assessment exists.
- Merge `entities`, `impact`, `sectors`, `directory`, `entity` into **الجهات والقطاعات**.
- Merge `future-skills`, `tech-radar`, `skills`, `explore`, `lists` into **الاستشراف والأدوات**.
- Merge `careers` and `decide` into **التوجيه المهني**.
- Demote `standards` and `methodology` to a footer or secondary menu called **المراجع والحوكمة**.
- Rename `اختبار التوجيه` to **مستكشف التخصصات** so it is not advertised as a psychometric test.
- Remove `lists` as a separate route; keep the lists as tabs inside `careers`.
- Remove `skills` as a user-facing top-level item and expose it as **سجل المهارات** inside Foresight & Tools.

### Primary journey per persona

- **Employee / موظف حكومي:** الرئيسية ← التقييم والتطوير ← اختيار المسار والدور ← answers/scenarios ← النتائج ← خطة 90 يومًا ← طباعة/تصدير تقرير التطوير.
- **Manager / مدير فريق:** الجهات والقطاعات ← اختيار جهة ← عرض brief المهارات → تنزيل brief → جمّع نتائج الفريق (import) ← مشاركة التقرير.
- **HR director / مدير موارد بشرية:** الجهات والقطاعات ← القطاعات ← role gap map ← عرض demand explorer ← export CSV.
- **Executive / قيادي:** الاستشراف والأدوات ← رادار التقنيات ← فتح invest/ignore brief ← أداة القرار.
- **Citizen/student:** التوجيه المهني ← مستكشف التخصصات ← 5 أسئلة ← ترشيح استرشادي ← رابط الخريطة التفاعلية والمهن.

---

## E. Engineering review for static deployment on `omary.me`

### Routing, deep links, back button, shareable URLs
Replace the `view` state in `App.tsx`/`store.tsx` with `react-router-dom` v7 BrowserRouter. Use browser history for cleaner URLs; if the static host cannot rewrite all paths to `index.html`, fall back to `createHashRouter` and document the limitation. Define routes such as `/assessment`, `/results/:id`, `/entities/:entityId`, `/sectors`, `/future-skills`, `/tech-radar`. Use `useParams` for entity/result IDs and `useSearchParams` for pending tech/career/domain selections. This restores browser back/forward and makes every page shareable.

### Bundle size and code-splitting
`govEntities.ts` is ~13,629 lines and is currently imported into views, which loads the full dataset and possibly many logos at startup. Split it into a lazy JSON chunk: copy to `src/data/govEntities.json` at build time and `import()` it only in entity/directory/sector views. Convert view imports to `React.lazy` with `Suspense`. Replace direct entity data imports in unrelated views. For 485 logos, generate WebP/AVIF thumbnails, use `<img loading="lazy">`, and implement an IntersectionObserver-based logo loader. Configure Vite `build.rollupOptions.output.manualChunks` for React/vendor/framer-motion/data.

### Data loading strategy
Load only what the current route needs. Use dynamic imports for `govEntities`, `careers`, `technologies`, `learning`, and `scenarios`. Keep small config files (`domains.ts`, `levels.ts`, `tracks.ts`) in the main bundle because every journey needs them. Keep user data in localStorage as now; do not put raw entity data into localStorage.

### SEO, meta, OG, sitemap, per-page titles
Use `react-helmet-async` for per-route `<title>`, `<meta name="description">`, canonical, `og:title`, `og:description`, and `og:image`. Pre-render the main public pages with `vite-ssg` or `react-snap`; leave user-specific `/results/*` as client-only with `noindex`. Generate `sitemap.xml` and `robots.txt` via a small Node script in CI. Add Arabic/English hreflang using separate canonical pages if language is URL-based, or keep one page and use meta.

### Accessibility
Add visible or visually hidden data tables adjacent to `RadarChart.tsx` and bar charts so screen readers can access the underlying numbers. Make radar axis labels keyboard-focusable and trigger the same tooltip/panel interaction. Add `aria-live="polite"` around results and progress announcements in `Wizard.tsx`. Use `role="img"` with descriptive `aria-label` plus the fallback table. Run `axe-core` in CI on key routes; add `jest-axe` in unit tests. Current `:focus-visible` styles are good; extend focus management for route changes.

### RTL correctness
Keep `document.documentElement.dir` from the language state. Use `Intl.NumberFormat(lang === 'ar' ? 'ar-SA-u-nu-latn' : 'en-GB')` for all displayed numbers and dates; never embed Eastern Arabic-Indic digits. Force `dir="ltr"` on numeric KPI elements and English code/labels to avoid bidi inversion. Audit all inline strings for mixed numerals.

### Performance budget
Adopt and enforce: initial HTML/JS gzip < 300 KB excluding logos/data, entity-data chunk < 150 KB gzip, lazily loaded images, LCP < 2.5s on mid-range mobile, TTI < 4s, no render-blocking Google Fonts beyond the essential Plex family. Use Lighthouse CI as a blocking check.

### PWA/offline
Add `vite-plugin-pwa` with auto-update. Pre-cache the app shell, core data files, and the assessment flow. Do not pre-cache all 485 logos by default; let them cache on demand. Ensure offline still shows the assessment and methodology views.

### i18n approach
Keep the current `L` object pattern for small, typed strings; add a compile-time completeness check that every `L` has non-empty `ar` and `en`. For larger content, consider moving to JSON locale files with typed keys, but do not introduce a heavy framework unless needed. Arabic remains primary, Western digits everywhere.

### Testing strategy
Unit-test `computeScores`, `stageForScore`, `levelForScore`, and guidance algorithm edge cases with Vitest. Component-test `Wizard`, `Results`, `EntityDetail` with Testing Library. E2E test critical journeys (assessment, entity detail, print) with Playwright. Add content consistency tests for role counts, career counts, digit style, and bilingual completeness. Run these in GitHub Actions.

### Build/deploy pipeline
Use GitHub Actions: checkout, install, lint, run unit/e2e, build, generate sitemap, deploy to `omary.me` via rsync or Pages. Set `base` in Vite to `'/'` for omary.me. Include `vite-plugin-pwa`, compression, and `lighthouse-ci` checks. Version the build and include a visible “آخر تحديث” from the commit hash.

---

## F. Content and evidence review

### Specific points that would embarrass the owner

1. **Role count inconsistency.** `src/views/Wizard.tsx` says “مكتبة الأدوار (20 دورًا)” while `src/views/Home.tsx` says “الأدوار الأربع والعشرين.” `src/data/roleLibrary.ts` contains 24 roles. Any careful reviewer will see this as sloppy editing.

2. **Career count contradiction.** `src/data/careers.ts` opens with “Future Careers dataset — 30 careers,” but the Home page and handover say 50 careers. The comment is stale and would make the data team look careless.

3. **Measurement overclaim.** `src/views/Home.tsx` hero states “رادار المهارات الرقمية **يقيس موقعك**.” The Methodology page correctly says the tool is editorial, self-reported, and not field-validated. Replace “يقيس” with “يقدّر موضعك” or “يكشف تقديرك.”

4. **“اختبار التوجيه” misrepresented as a test.** `src/components/Header.tsx` and `Home.tsx` call the 5-question guidance tool “اختبار.” This implies psychometric validity. Rename to “مستكشف التخصصات” or “توجيه استرشادي.”

5. **“يندثر” is too absolute.** `src/data/careers.ts` `signalMeta` Arabic for `DECLINING` is “يندثر.” Use “يتراجع” or “تقل الحاجة إليه” with a visible “توقعات استطلاعية.”

6. **Unlocalized English fields in tech radar.** `src/data/technologies.ts` includes fields such as `trlRationale`, `employeeSkills`, and `learningFocus` that may still appear in Arabic mode. A senior user flipping to Arabic expects full localization.

7. **Exact per-entity service records without governance frame.** `src/views/EntityDetail.tsx` shows exact `trainingBeneficiaries`, `consultingServices`, `totalBenefit`, and `topConsulting`. This could be read as public performance ranking. Add a visible “سجل خدمي — للاستئناس” label, extraction date, and a link to methodology.

8. **National totals need source/update date in context.** `src/views/Impact.tsx` shows 7,915 / 2,873 / 377 / 421 as KPIs, but the date/source is less prominent than the numbers. Add a fixed line under each KPI: “المصدر: سجلات الخدمة الرسمية، حتى 30-09-2026، انظر المنهجية.”

9. **Inconsistent terminology.** `معايرة معرفية` still appears in code/legacy naming and may leak into the UI. The Home journey now says “أسئلة تحقق,” but `src/data/learning.ts` function is `questionsForDomain` originally from calibration. Unify to “أسئلة تحقق معرفي.”

10. **Eastern/Western digits.** Current `toLocaleString('en-US')` for KPI numbers and `ar-SA-u-nu-latn` for dates are okay, but inspect all string templates and inline numbers in `Results.tsx`, `Impact.tsx`, `Wizard.tsx` for accidental Eastern Arabic-Indic characters. The rule is Western digits everywhere, no exceptions.

---

## G. Rebuild plan for a 1–2 day AI coding push

### Packet 1 — Router migration
**Scope:** `App.tsx`, `store.tsx`, all `go()` calls, `Header`, `Footer`, view conditionals.  
**Acceptance:** Every view has a real route; browser back/forward works; deep links open correct state; no `view` enum remains in navigation.  
**Dependencies:** None.  
**Parallelizable:** No — foundational.

### Packet 2 — Code splitting and data loading
**Scope:** Convert `govEntities.ts` to lazy JSON/dynamic import; lazy-load all views; IntersectionObserver logo loader; Vite manual chunks.  
**Acceptance:** Initial gzip JS < 300 KB; entity data absent from home bundle; entity/logos load only on entity routes; Lighthouse bundle check passes.  
**Dependencies:** Packet 1.  
**Parallelizable:** Yes after Packet 1.

### Packet 3 — SEO/meta/prerender
**Scope:** Add `react-helmet-async`, per-route head, prerender key public routes, generate `sitemap.xml`/`robots.txt`.  
**Acceptance:** Each route has unique title/description/canonical/OG; social share preview shows relevant text; sitemap lists main routes.  
**Dependencies:** Packet 1.  
**Parallelizable:** Yes.

### Packet 4 — Accessibility/RTL audit
**Scope:** `RadarChart.tsx`, bar charts, result tables, focus management, digit audit, `axe-core` CI.  
**Acceptance:** axe-core zero critical issues on key routes; radar has keyboard-accessible axes and screen-reader fallback; all Arabic UI uses Western digits.  
**Dependencies:** Packet 1.  
**Parallelizable:** Yes.

### Packet 5 — Content consistency pass
**Scope:** `Wizard.tsx`, `Home.tsx`, `careers.ts` comment, `Header.tsx`, `technologies.ts` Arabic fields, terminology unification.  
**Acceptance:** No inconsistent role/career counts; no “يقيس”, “اختبار”, “يندثر” overclaims; all visible `L` fields bilingual; no East Arabic digits.  
**Dependencies:** None.  
**Parallelizable:** Yes.

### Packet 6 — Entity Skills Demand Brief
**Scope:** `EntityDetail.tsx`, `sectorSkills.ts`, print CSS.  
**Acceptance:** One-page A4 printable brief shows top 3 domains, sector benchmark, mapped roles, and readiness CTA; disclaimer visible.  
**Dependencies:** Packet 1, 5.  
**Parallelizable:** Yes after 5.

### Packet 7 — Team aggregation export/import
**Scope:** New team view; export/import functions; aggregate radar/dashboard.  
**Acceptance:** Coordinator can import local CSV/JSON, see team-level gaps and radar; no network calls; exports do not contain personal identifiers.  
**Dependencies:** Packet 1.  
**Parallelizable:** Yes after 1.

### Packet 8 — Scenario practice mode
**Scope:** `Pathways.tsx` or new `ScenarioPractice` view; reuse `scenarios.ts`.  
**Acceptance:** After results, user can practice scenarios for weakest two domains; each response shows rationale; mode labelled “غير معاير”.  
**Dependencies:** Packet 1, 5.  
**Parallelizable:** Yes.

### Packet 9 — Benchmarks and executive briefs
**Scope:** `FutureSkills.tsx`, `TechRadar.tsx`, new decision templates.  
**Acceptance:** Each tech/domain has decision criteria and source confidence; executive track links to relevant briefs.  
**Dependencies:** None.  
**Parallelizable:** Yes.

### Packet 10 — Testing suite
**Scope:** Vitest unit tests, Testing Library component tests, Playwright e2e, content consistency tests.  
**Acceptance:** CI runs all tests and must pass; critical journeys covered; stage boundary selftest still green.  
**Dependencies:** Packets 1–5.  
**Parallelizable:** Partially — unit tests can start earlier.

### Packet 11 — PWA/performance budget
**Scope:** `vite-plugin-pwa`, image compression, offline cache, Lighthouse CI.  
**Acceptance:** Lighthouse mobile perf ≥ 80, a11y ≥ 90; offline core pages work; no regression to LCP/TTI budgets.  
**Dependencies:** Packets 1, 2, 4.  
**Parallelizable:** Yes after those.

### Packet 12 — Build/deploy pipeline and docs
**Scope:** GitHub Actions workflow, deploy to omary.me, `base:'/'`, changelog/methodology update.  
**Acceptance:** Push to main builds and deploys; manual rollback documented; methodology reflects new IA and static-only privacy.  
**Dependencies:** All previous.  
**Parallelizable:** No.

---

## H. What NOT to do

1. **Do not add a backend, login, or user database to the core.** Optional backend ideas must remain clearly separated. The static/privacy promise is a differentiator.

2. **Do not expose exact per-entity service records in a way that becomes a public ranking.** Avoid sorting entities by “utilization” or naming best/worst. Aggregate first, label clearly, and obtain owner sign-off if exact rows remain public.

3. **Do not turn the assessment into a selection, promotion, or hiring tool.** No cutoff scores, no “eligible/no eligible” labels, no integration with HR systems. Keep development-only wording.

4. **Do not add an AI chatbot or automatic career counsellor that produces definitive advice.** It would overclaim capability and expose the owner to ethical risk.

5. **Do not present editorial TRL or automation bands as measured percentages.** `careers.ts` already removed percentage automation but the temptation may return. Keep qualitative bands and sources.

6. **Do not use the Saudi DGA logo, seal, or claim official affiliation.** The theme may be “inspired by” only. The current concept disclaimer is correct; strengthening the brand should not edge toward impersonation.

7. **Do not add real-time team collaboration, shared dashboards, or cloud sync.** Static client-side aggregation only. Any network sync must be an explicitly optional, separate proposal.

8. **Do not add gamification such as badges, streaks, or public leaderboards.** These imply objective competence and undermine the honest self-assessment positioning.

9. **Do not display estimated Saudi wages/vacancy data unless officially sourced and dated.** Better to omit than to publish a plausible but unsourced number.

10. **Do not introduce a perfect overall “score” as a standalone headline.** The current stage label plus radar plus evidence layers is enough. A single “4.00/4.00” headline would invite false precision.