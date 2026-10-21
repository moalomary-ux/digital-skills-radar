### A. Verdict (10 lines max)

- **Product concept — 8/10:** A strong government workforce concept whose greatest opportunity is connecting changing work to practical development decisions.
- **User journey — 4/10:** Substantial content is undermined by fragmented navigation, a blocking assessment entry path, and inconsistent results-to-plan logic.
- **Visual/brand — 6/10, provisional:** The theme and custom radar mark provide a coherent foundation, but official entity logos violate the brief and dense navigation weakens the intended executive experience.
- **Engineering — 4/10:** Appropriate static foundations, but state-only navigation, eager loading, weak persistence contracts, and limited verification leave significant release risks.
- **Content/evidence — 5/10:** Methodological disclosures are valuable, but several prominent claims imply stronger measurement, causality, and institutional authority than their evidence supports.
- **Recommendation:** Redevelop around one promise: **understand a government work challenge, identify relevant capabilities, and leave with a defensible development action.**
- **Review basis:** Read-only source, existing build artifacts, handover, and prior-review synthesis; no files modified, dependencies installed, or builds run.
- **Limit:** Live access was blocked by the review environment; visual judgments are source-based, not a rendered-browser audit, and workbook totals were not independently recomputed.

### B. Top 10 weaknesses, ranked by impact on a senior government audience

Effort: **S** = localized correction; **M** = coordinated changes across several areas; **L** = substantial content or architectural work.

| Rank | Weakness | Why it matters | Evidence | Fix sketch | Effort |
|---|---|---|---|---|---|
| **1** | **Recorded consulting activity is presented as measured skill demand** | A Deputy Minister could interpret the percentages as an assessment of workforce needs. They actually reflect historical services, editorial mappings, and a restricted denominator. | `src/data/sectorSkills.ts:29` defines editorial weights; `:86–89` selects 3 domains and renormalizes them. `src/views/EntityDetail.tsx:148–152` says “ما الذي تحتاجه جهتك؟” and “وليس افتراضًا.” | Rename to **“مجالات تطوير مقترحة من سجل الاستشارات”**. Display record period, coverage, mapping version, and an editorial-inference badge. Prefer ranked suggestions without percentages; if retaining shares, use all mapped domains as the denominator and explain it. | M |
| **2** | **The main employee entrance can strand the assessment** | An executive demonstration can fail after the user has answered 40 statements. | `src/views/Home.tsx:21–23` sets `generalist` but no track. `src/views/Wizard.tsx:40` starts at step 1 whenever a role exists; `:47` yields no scenarios without a track; `:474–475` disables continuation when the scenario list is empty. | All entrances must resolve both role and track before questions. Preserve an explicit review/edit step. Validate prerequisites at every transition and before saving. | M |
| **3** | **Official logos contradict the independent-concept positioning** | Government branding, named entities, and service records together can imply official endorsement, regardless of a disclaimer elsewhere. | `src/components/EntityLogo.tsx:28–35` renders supplied logos; `src/views/EntityDetail.tsx:51` uses them prominently. `src/views/Methodology.tsx:134` explicitly describes 485 official PNGs. | Use the product’s own mark and neutral entity initials. Exclude official-logo assets from the published artifact, not merely from visible components. Put **“مفهوم مستقل لتخطيط التطوير — غير تابع لجهة حكومية”** near the product identity. | S |
| **4** | **Results and plans disagree about what needs development** | The platform can flag weak judgment, then assure the same person that no development gaps exist. That breaks its core promise. | `src/views/Results.tsx:146–155` considers self-report and scenario results. `src/views/Pathways.tsx:54–63` uses only target minus self-report; `:86` announces no gaps. A user with self-ratings of 4 and scenario scores of 0 can encounter this contradiction. | Create one versioned recommendation function consumed by results, plans, and reports. Keep evidence layers separate, but turn disagreement into an explicit verification activity. Require user selection of the final priorities. | M |
| **5** | **Partial knowledge checks produce misleading agreement labels** | Someone who answers 1 question correctly and skips 4 is treated differently from what “optional knowledge check” reasonably implies. | `src/views/Wizard.tsx:62–68` saves only correct-answer counts whenever any question is attempted. `src/views/Results.tsx:325–327` divides by the full domain question count. Attempted counts are absent from `ResultRecord` at `src/store.tsx:26–38`. | Store attempted, correct, item IDs, and instrument version. Show “1 correct of 1 attempted; 4 unanswered.” Suppress agreement judgments when evidence is incomplete. Do not imply statistical calibration. | M |
| **6** | **Activity counts are branded as impact and combined across unlike units** | Training participation and consulting delivery are useful operational measures; neither demonstrates improved capability or government performance. | `src/views/Impact.tsx:114` calls the page “أثر تمكين الجهات الحكومية.” `src/data/govServices.ts:59–65` combines 7,915 training records and 2,873 consulting services into 10,788 “total benefit.” `src/views/Impact.tsx:99–101` promotes that sum. | Rename to **“سجل خدمات التمكين”**. Separate training participation, consulting services, programs, and covered entities. Remove the composite benefit KPI. Reserve “impact” for measured outcomes with a defined method. | S |
| **7** | **The navigation serves the inventory rather than the audience’s task** | A senior visitor must discover how assessment, careers, technology, entity history, and institutional guidance relate. Sharing a useful finding is impossible at page level. | `src/components/Header.tsx:38–50` has 6 main items before assessment and 8 afterward, plus 10 secondary items at `:20–30`; `:125–137` places them in one mobile scrolling row. `src/store.tsx:101,138–140` stores navigation only in memory. | Five stable top-level destinations, real URLs, contextual subnavigation, and one clear next action per page. Keep government journeys primary; move public career guidance into an optional exploration branch. | L |
| **8** | **Evidence discipline is prose-based rather than enforceable** | “No number without a source” cannot be guaranteed by a generic report attribution or a methodology page. | `src/data/futureSkills.ts:18–23` models evidence as bilingual text only. `src/data/govServices.ts:6–18` lacks source/confidence fields. `src/data/careers.ts:2315` has card-level provenance, rather than claim-level locators. | Introduce typed claim/source records with units, population, geography, period, source locator, confidence rationale, review date, and derivation. Render the same source component everywhere; fail checks for unsupported quantitative claims. | L |
| **9** | **Bilingual and accessible operation is incomplete in the new data views** | A polished Arabic landing page cannot compensate for English pages that retain untranslated categories or charts that require a pointer. | `src/views/EntityDetail.tsx:54–65,133` renders Arabic names, taxonomy, and consulting text irrespective of language. `src/views/Impact.tsx:43–46` makes SVG groups clickable without keyboard controls. Similar pointer handlers appear in `TechRadarChart.tsx:163,186` and `NetworkMap.tsx:341`. | Translate taxonomies once, preserve original proper names with clear language markup, and provide equivalent HTML tables/lists with real links. Test complete journeys with keyboard and screen reader. | L |
| **10** | **The release architecture is fragile for a flagship domain** | Slow initial delivery, lost drafts, and inconsistent refresh behavior undermine trust before the substantive content is considered. | `src/App.tsx:5–23` eagerly imports all views. Existing `dist/assets/index-gLuaTt7U.js` is **1,628,179 bytes**, approximately **415,790 bytes gzipped**. `src/store.tsx:90–95` casts parsed storage without validation; `:125,129,133` writes without handling storage failure. `vite.config.ts:6` retains the GitHub project base. | Route-level loading, separately fetched data, versioned storage with recovery, explicit deployment paths, and a tested release artifact. Add integration tests for the actual journeys, not just threshold functions. | L |

The previous repairs should be retained. Visible focus styling exists, the threshold functions now use contiguous boundaries, scenario answers lock after reveal, directory pagination exists, and the methodology acknowledges editorial limitations. The problem is that these protections do not consistently extend to newer features or all entry paths.

### C. Idea evolution — 6 to 10 proposals that make this a materially stronger product

**1. Government decision briefs — “موجز القرار” — MUST**

- **What:** A concise brief for a work challenge: what is changing, which decisions arise, relevant capabilities, evidence strength, and a practical next step.
- **Serves:** Deputy Ministers and executive leaders.
- **Better than today:** The executive entrance currently leads to institutional-adoption guidance (`Home.tsx:42–46`). A brief answers a current leadership question before asking the visitor to adopt the platform.
- **Needs:** A small curated set of challenges, such as responsible AI adoption, improving a digital service, data sharing, and managing technology suppliers; each mapped to existing skills and sources.
- **Effort:** M for a narrow first release.
- **Risk:** Becoming generic consulting prose. Each brief must name a concrete decision and a usable output, with uncertainty visible.

**2. Work-to-capability maps — “من المهمة إلى المهارة” — MUST**

- **What:** Start with a government task, then show required capabilities, relevant roles, a sample work product, and development activities.
- **Serves:** CIOs, managers, and employees.
- **Better than today:** The current structure starts largely from domains and roles. Tasks explain why those skills matter: “evaluate an AI supplier” is easier to act on than “improve emerging-technology literacy.”
- **Needs:** Task records with skill IDs, role IDs, expected artifacts, prerequisites, and editorial rationale.
- **Effort:** M.
- **Risk:** Implying comprehensive role requirements. Label each map as an illustrative development reference.

**3. A development agreement, not just a generated plan — “اتفاق تطوير” — MUST**

- **What:** Let the user choose up to 3 priorities, available time, a work-based deliverable, and a review date. Produce a concise printable agreement.
- **Serves:** Mid-level employees and their managers.
- **Better than today:** Existing plans are driven by self-report gaps and generic transition templates. This makes the plan feasible and gives the user ownership.
- **Needs:** Existing learning resources, task templates, time estimates labeled as editorial, and one consistent priority model.
- **Effort:** M.
- **Risk:** Appearing to certify ability. The output must say what the person plans to demonstrate, not that competence has been established.
- **Static implementation:** Local state and browser printing. Results already have a print button at `Results.tsx:195`; improve its report structure rather than presenting printing as a new capability.

**4. Contextual sector briefs — “سياق القطاع وأولويات التطوير المقترحة” — SHOULD**

- **What:** Combine historical service activity with curated government work challenges, while showing them as separate evidence layers.
- **Serves:** HR directors, sector leaders, and consulting teams.
- **Better than today:** Replaces unjustified “this entity needs X% of skill Y” with a defensible discussion aid.
- **Needs:** Existing aggregates, coverage periods, missing-data flags, source metadata, and reviewed sector-to-task mappings.
- **Effort:** M.
- **Risk:** Historical service provision is selected by budgets, access, and provider offerings. It must never become an entity capability ranking.

**5. A scenario practice studio — “مختبر المواقف المهنية” — SHOULD**

- **What:** Use existing scenarios as learning cases with reasoning, consequences, and a suggested workplace exercise.
- **Serves:** Employees, managers, and training facilitators.
- **Better than today:** The platform already explains answers immediately. Making practice explicit gives that content a useful purpose without overstating assessment precision.
- **Needs:** Existing scenarios plus stronger explanations, alternative defensible responses, and facilitation notes.
- **Effort:** M.
- **Risk:** Memorized answers inflating retest scores. Separate practice history from assessment attempts and label repeat exposure.

**6. A local capability-planning workshop — “ورشة تخطيط القدرات” — SHOULD**

- **What:** An HR director selects roles and organizational priorities, then produces a workshop worksheet and a capability-coverage matrix.
- **Serves:** HR directors and CIOs.
- **Better than today:** Offers immediate organizational usefulness without requiring employee uploads, accounts, or a backend.
- **Needs:** Role-to-task-to-skill mappings and explicit editorial target profiles.
- **Effort:** M.
- **Risk:** Confusing intended coverage with measured team capability. Title the output “planning assumptions,” not “team readiness.”

**7. A personal evidence notebook — “شواهد تطوري” — SHOULD**

- **What:** A local checklist records whether a planned work artifact was completed, what was learned, and what to try next.
- **Serves:** Employees and managers.
- **Better than today:** Reassessment becomes a review of practice, rather than another self-rating alone.
- **Needs:** Stable task IDs, plan versions, completion dates, and short reflection prompts.
- **Effort:** M.
- **Risk:** Users entering confidential work details. Default to structured checkboxes; do not request names, files, or operational evidence. Provide explicit local export/delete controls.

**8. Transparent priority exploration — “لماذا هذه الأولوية؟” — WOW**

- **What:** A user can inspect how a recommendation follows from role expectations, self-report, scenario evidence, and their chosen work objective.
- **Serves:** All personas, especially skeptical senior reviewers.
- **Better than today:** Replaces an opaque ranking with a traceable decision. It also exposes when there is insufficient evidence.
- **Needs:** A shared recommendation function and readable explanations for each rule.
- **Effort:** M.
- **Risk:** Adjustable weights creating false scientific precision. Use a few clearly labeled planning choices; do not expose arbitrary percentage sliders.

For the intensive redevelopment, implement the first 3 narrowly. The remaining proposals should guide architecture and subsequent releases, not become simultaneous feature commitments.

### D. Information architecture and journey

Use **5 top-level items**. The brand mark links to the home page; “Home” does not need another permanent navigation slot.

| Top-level item | Arabic label | Contents |
|---|---|---|
| Understand changing work | **تحولات العمل الحكومي** | Decision briefs, future skills, work challenges, supporting technology context |
| Explore capabilities | **المهارات والأدوار** | Skill registry, government roles, task maps, optional career exploration |
| Develop my capabilities | **تطويري** | Assessment, saved results, development agreement, practice, local progress |
| Plan organizational development | **تطوير قدرات الجهات** | Planning workshop, sector context, service records, entity directory |
| Understand the evidence | **المنهجية والمصادر** | Claim register, methods, limitations, version history, privacy and independent ownership |

Use **“ابدأ خطة تطويرك”** as the primary action. Offer **“استأنف خطتك”** when a valid local draft exists. Navigation must remain stable after assessment; saved results belong inside “تطويري.”

**Primary persona journeys**

| Persona | Primary journey | Useful endpoint |
|---|---|---|
| Deputy Minister | Home → select a government work challenge → read decision brief → inspect evidence → print brief | A discussion-ready decision brief with uncertainties and next actions |
| CIO | Select an initiative → inspect task/capability map → compare relevant roles → choose development actions | A capability plan tied to delivery responsibilities |
| HR director | Organizational development → select role mix and priorities → review proposed coverage → prepare workshop | A development-planning worksheet without collecting individual scores |
| Mid-level employee | Select work objective → confirm role/track → assess → inspect evidence differences → select priorities → create agreement | A feasible plan with a first work-based task |

**Disposition of the current 19 views**

| Current view | Proposed treatment |
|---|---|
| `Home` | Retain as a concise gateway with persona/task entrances and a visible independent-concept statement. |
| `Wizard` | Rename **“استكشاف احتياجاتي التطويرية”** within “تطويري.” Preserve “تقييم ذاتي” as the method description. |
| `Results` | Rename **“ملفي التطويري”**; make it a saved result route, not a global navigation item. |
| `Pathways` | Integrate with results as **“خطة تطويري”**; preserve a dedicated printable view. |
| `FutureSkills` | Place under “تحولات العمل الحكومي”; distinguish global signals from Saudi evidence and editorial interpretation. |
| `Careers` | Demote to **“استكشاف المهن”** under “المهارات والأدوار.” “اكتشف التخصصات” incorrectly suggests educational majors. |
| `Decide` | Nest under career exploration as **“استكشاف اتجاهات مهنية”**; avoid implying a validated aptitude test. |
| `Lists` | Merge into career exploration; rename **“مهن ومهام تتغير”**. Remove extinction language. |
| `Explore` | Offer the network map as an optional view of relationships, alongside a searchable list. |
| `TechRadar` | Demote to supporting context under changing work: **“تقنيات تغيّر العمل”**. Keep TRL detail secondary. |
| `Roles` | Retain under capabilities as **“الأدوار الحكومية”**. |
| `SkillRegistry` | Retain as **“دليل المهارات”**; version details remain available within records. |
| `Standards` | Merge into “المنهجية والمصادر.” |
| `Methodology` | Become the landing page for methods and sources; put long changelogs on a child page. |
| `Entities` | Replace the adoption brochure with the organizational development workspace. |
| `Impact` | Rename **“سجل خدمات التمكين”** and nest under organizational development. |
| `GovSectors` | Retain as **“سياق القطاعات”** with carefully labeled inferred suggestions. |
| `Directory` | Retain as a utility, **“دليل الجهات”**, not a product pillar. |
| `EntityDetail` | Give each entity a permanent route; separate recorded activity, missing information, and editorial suggestions. |

### E. Engineering review for a static deployment on omary.me

**Routing and shareable state**

Use React Router with real path-based routes. A suitable route structure is:

- `/ar/work/`
- `/ar/skills/`
- `/ar/roles/:roleId/`
- `/ar/develop/assessment/`
- `/ar/organizations/sectors/:sectorId/`
- `/ar/organizations/entities/:entityId/`
- `/ar/methodology/`

Provide equivalent `/en/` routes. Public filters and selected tabs belong in query parameters. Assessment answers, personal results, and reflections do not.

For static hosting, prerender public routes into actual HTML files. Configure the assessment workspace with an explicit client-side fallback if the host supports it. Direct requests, refreshes, and unknown paths must be tested against the deployed host. React Router documents static prerendering as a supported rendering strategy; adopting it does not require a runtime backend. Pin a version compatible with the chosen React/Vite setup rather than installing the newest version indiscriminately. [React Router rendering strategies](https://reactrouter.com/start/framework/rendering)

Add route-change focus management and scroll restoration. A copied URL must reconstruct a public entity, role, or filtered listing without relying on `pendingEntityId` or other memory-only state.

**Bundle size and code splitting**

The existing local build contains one JavaScript asset:

| Measurement | Observed value | Qualification |
|---|---:|---|
| JavaScript | 1,628,179 bytes | Existing artifact; not a new build |
| Gzipped JavaScript | Approximately 415,790 bytes | Local compression measurement |
| CSS | 38,124 bytes | Existing artifact |
| TypeScript data sources | 1,317,762 bytes | Source size, not transfer size |
| `govEntities.ts` | 412,002 bytes | Source size |

The eager import graph in `App.tsx` explains the architectural problem. Use route-level dynamic imports, with separate chunks for assessment, careers, government records, and interactive maps.

Be careful with shared helpers: `sectorSkills.ts` imports the full entity directory and detail dataset. Importing one helper can pull the entire government-data graph into a route.

The logos are lazy-loaded images, so **485 files does not mean 485 initial requests**. Nevertheless, the brief requires removing them from the release artifact.

**Data loading**

- Generate a compact entity search index containing IDs, bilingual names, sector IDs, and necessary filter fields.
- Fetch entity details on demand; partition by sector or bounded groups rather than creating hundreds of tiny requests.
- Precompute sector aggregates during the data-generation step.
- Give datasets a version, source manifest, reporting period, and checksum.
- Preserve missingness: unavailable data must not silently become zero.
- Keep the existing 48-item directory pagination (`Directory.tsx:9,48–50`). Virtualization is unnecessary unless measurements show a problem.
- Show a useful retry state for failed data downloads.

Do not ship source workbooks merely to make claims verifiable. Publish appropriately scoped source descriptions or approved extracts.

**SEO, metadata, and previews**

`index.html:6–7` supplies one description and title; the root is empty until JavaScript executes.

Prerender public editorial pages with:

- Unique localized titles and descriptions.
- Canonical links and Arabic/English alternate links.
- Per-page Open Graph metadata and static preview images.
- A sitemap containing public routes.
- Meaningful HTML headings and content.
- Correct 404 behavior.

Do not index personal-result routes. Do not generate personalized social previews from assessment content. Build metadata from the same route/content registry used by navigation.

**Accessibility and RTL**

The source has visible focus styling, but focus styling cannot make a clickable SVG group keyboard-operable.

Required changes:

- Use links for navigation, buttons for actions, and proper form groups for assessment responses.
- Add a skip link and a focusable main heading on navigation.
- Replace the CSS-only “Pro tools” interaction with an explicit disclosure state, `aria-expanded`, and predictable dismissal.
- Give charts equivalent HTML tables or lists with values, units, and links.
- Give each radar a localized title and description; use line styles or markers as well as color.
- Ensure selected responses are programmatically exposed.
- Make knowledge-check expansion state accessible; `Wizard.tsx:269–287` currently lacks the relevant expanded-state attributes.
- Implement motion preferences in JavaScript using the motion library’s reduced-motion support. The CSS override at `index.css:101` does not establish that JavaScript-driven motion respects the preference.
- Use logical spacing and alignment, isolate Latin identifiers with `bdi` or explicit direction, and keep chronological chart direction consistent.
- Test Arabic and English at narrow widths and enlarged text.

These recommendations align with the retrieved interface guidelines, especially semantic controls, chart alternatives, visible focus, URL state, and reduced motion. [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)

**Internationalization**

Retain bilingual content records, but centralize interface strings and taxonomies. `t({ar,en})` scattered throughout JSX makes terminology review and completeness checks difficult.

Use `react-i18next` with typed resource keys if undertaking the broader restructuring; otherwise, a typed central dictionary is sufficient for the first push. The important requirement is enforceable completeness, not the library itself. i18next supports typed keys and namespace-based resources. [i18next TypeScript guidance](https://www.i18next.com/overview/typescript)

Centralize number and date formatting:

- Arabic numbers: `ar-SA-u-nu-latn`.
- Explicitly choose the calendar for dates; Western digits alone do not specify Gregorian versus Hijri.
- Use stable IDs rather than Arabic labels as data keys.
- Distinguish a verified official English entity name from an editorial translation.
- Where translation is unavailable, label the original Arabic name honestly rather than silently presenting an incomplete English page.

**Persistence and privacy**

`localStorage` is a reasonable choice for this scope, but needs a contract:

- Validate stored values with a small runtime schema, such as Zod, or explicit validators.
- Version drafts, results, instruments, role targets, and recommendation rules.
- Catch read and write failures; offer an in-memory session when persistence is unavailable.
- Provide “delete all my local data,” not just history deletion.
- Explain that data remains in this browser and does not automatically move between devices or domains.
- Support optional user-initiated local JSON export/import for migration from GitHub Pages to omary.me.
- Never place raw results in share URLs.

Self-host fonts. `index.html:8–12` currently requests Google Fonts; this creates third-party network traffic despite the otherwise local architecture. Phrase privacy precisely: no assessment transmission or product analytics; hosting requests may still be logged by the hosting provider.

**Performance budget**

These are proposed acceptance targets, not observed results:

| Area | Initial target |
|---|---|
| Public landing-route JavaScript | ≤200 KB gzip |
| Initial CSS | ≤50 KB gzip |
| Initial total transfer | ≤500 KB compressed, including required fonts |
| Government datasets on landing page | No full directory or detail payload |
| Mobile lab LCP | ≤2.5 seconds on an agreed test profile |
| Layout shift | CLS ≤0.1 |
| Interaction responsiveness | Investigate interaction latency above 200 ms |

Use a fixed browser/device/network profile for comparison. With no analytics collection, report lab measurements as lab measurements rather than claiming field percentiles.

**PWA and offline**

Defer PWA installation during the first push. The immediate priority is reliable routes and data versioning.

Later, use Workbox or `vite-plugin-pwa` for an explicitly scoped offline workspace. Cache the shell and selected reference data, display the content version and offline state, and provide an update prompt. Do not precache every entity or leave old evidence silently active.

**Testing and deployment**

Use:

- **Vitest:** Scoring, missing answers, priority rules, mappings, version migrations, data invariants.
- **React Testing Library:** Form semantics, resume behavior, and result/plan agreement.
- **Playwright:** Complete bilingual journeys, browser history, direct URLs, storage failures, mobile layouts, print output, and keyboard operation.
- **axe-core:** Automated accessibility checks, supplemented by manual keyboard and screen-reader review.

Vitest fits the existing Vite tooling; Playwright supports cross-browser testing and mobile emulation. [Vitest](https://vitest.dev/guide/) · [Playwright](https://playwright.dev/docs/intro)

The existing threshold self-test is useful but insufficient. Its shell command interpolates unquoted paths (`scripts/levels.selftest.mjs:17`), which is also fragile in this workspace’s path containing spaces.

For deployment:

1. Preserve the existing repository and remote.
2. Pin the runtime and use the lockfile.
3. Validate content, types, and tests.
4. Build once and test that exact artifact.
5. Publish a preview for review.
6. Deploy the same artifact with a retained rollback version.

Choose the domain mount point explicitly. Do not assume omary.me is otherwise empty. Update Vite’s `base` to match the approved root or subpath; Vite documents how this setting rewrites production asset paths. [Vite production build guidance](https://vite.dev/guide/build.html)

### F. Content and evidence review

The most embarrassing failures would be **claims whose wording outruns the underlying data**, followed by contradictory labels during a live demonstration.

| Location | Specific issue | Recommended treatment |
|---|---|---|
| `src/views/Home.tsx:72–73` | “يقيس موقعك… بأدلة موثقة لا بانطباعات” suggests objective measurement despite self-report and editorial instruments. | “يساعدك على استكشاف احتياجاتك التطويرية عبر تقييم ذاتي ومواقف مهنية وأسئلة معرفة.” |
| `src/views/EntityDetail.tsx:148–152` | “ما الذي تحتاجه جهتك؟” and “وليس افتراضًا” deny the inferential nature of the mapping. | “مجالات تطوير مقترحة من سجل الاستشارات” with a visible editorial-inference badge. |
| `src/data/sectorSkills.ts:1–3,29–60` | “No number…hand-invented” is misleading because the weights are authored judgments. | State that counts are recorded and weights are editorial. Computation does not remove assumptions. |
| `src/data/sectorSkills.ts:86–89` | Percentages describe the selected top 3 only. Independent rounding also does not guarantee a displayed sum of exactly 100. | Remove the percentages or state the denominator clearly and use consistent rounding. |
| `src/views/Impact.tsx:114`; `src/data/govServices.ts:65` | “Impact” and “total benefit” overstate what service counts show. | Separate activity measures; reserve impact language for outcomes. |
| `src/views/EntityDetail.tsx:140` | Arabic says the entity **did not benefit**; English says **no recorded utilization**. Absence in these files does not establish absence of service. | Arabic: “لا تتوافر في البيانات المستخدمة سجلات لهذه الجهة خلال الفترة المحددة.” |
| `src/views/EntityDetail.tsx:167–168` and `:36–38` | “Measure readiness for your entity’s priorities” actually sets the generic awareness track and navigates to the wizard. No entity-specific assessment context is passed. | Pass explicit context and explain its limited role, or change the CTA to “ابدأ استكشاف احتياجاتك التطويرية.” |
| `src/views/Wizard.tsx:173` | Says the library has 20 roles, while the updated home page says 24 at `Home.tsx:30`. | Derive displayed counts from the dataset. |
| `src/views/Wizard.tsx:134–135` | Describes the target polygon as violet; the home legend uses amber at `Home.tsx:113–114`. | Use semantic wording and one shared legend definition. |
| `src/views/Results.tsx:320,324,346` | The “knowledge check” panel displays a level and numeric score derived from **self-report**. | Label every value by its evidence layer. Show actual knowledge-check counts separately. |
| `src/data/learning.ts:430–433`; `src/data/levels.ts:94–96` | Learning transitions use rounding boundaries, while displayed levels use 1.25/2.25/3.25. At score 1.4, the displayed level is 2 while the transition remains 1→2. | Use a common progression definition or explicitly explain a different pedagogical rule. |
| `src/views/Pathways.tsx:73` | “تسعون يومك القادمة” is awkward Arabic. | “خطتك للأيام الـ90 المقبلة.” |
| `src/components/Header.tsx:25` | “ما يزدهر وما يندثر” implies extinction where the English says decline. | “المهن والمهام بين النمو والتراجع.” |
| `src/data/futureSkills.ts:84–85` | Calls digital-legislation awareness the platform’s “least automatable skill” without a visible comparative method. | Remove the superlative or supply a task-based comparison and explicit editorial status. |
| `src/data/futureSkills.ts:35–36` | Combines vendor-platform enrollment growth, employer responses, and global enrollment rates inside broad demand arguments. | Give each claim a separate source, population, period, and limitation. Enrollment is not workforce prevalence or a vacancy measure. |
| `src/data/standards.ts:27–28` | Says DigComp bands map “directly” to radar levels. Similar numbers of bands do not establish equivalence. | “مواءمة تحريرية استرشادية” with a crosswalk and stated limits. |
| `src/views/EntityDetail.tsx:54–65,133` | English mode retains untranslated Arabic taxonomy and service descriptions. | Translate the taxonomy; mark original-language source text explicitly and provide a reviewed summary. |
| `src/views/EntityDetail.tsx:118` | Small 2026 chart text uses `#DBA102`, despite the earlier amber-text correction. | Use the darker amber text token; keep the original amber for suitable graphical fills. |

**Two evidence distinctions need to become visible throughout the product.**

First, **source type is not confidence**. An official service record can be strong evidence of recorded delivery and weak evidence of unmet skill demand. A published international survey can support its sampled population while providing limited evidence about a particular Saudi entity.

Second, **a source citation is not a derivation**. A defensible claim record should identify:

- Claim text, value, and unit.
- Population, geography, and reporting period.
- Source title, publisher, URL or document identifier, and page/table/sheet locator.
- Whether it is observed, forecast, self-reported, or editorially derived.
- Confidence level and a short rationale.
- Formula, denominator, and input claims where applicable.
- Review date, reviewer, and next review trigger.

The workbook discrepancy is handled constructively in `src/data/govData.report.md:45–56`: it distinguishes table totals from inconsistent prose. Preserve that reconciliation, but do not turn “provided official workbook” into an unsupported claim of publicly approved publication. Source authority and publication status are separate fields.

**Western digits:** The source scan found no Arabic-Indic or Persian digit literals in `src`. Existing explicit `en-US` formatting and `ar-SA-u-nu-latn` usage are positive. The remaining work is to enforce a shared formatter and verify runtime dates, labels, exports, and mixed-direction content. Do not report a digit regression without observing one.

**Terminology:** Establish a short bilingual glossary:

| Preferred Arabic | Intended meaning |
|---|---|
| تقييم ذاتي | Self-report, not validated capability measurement |
| موقف حكم مهني | A scored editorial scenario |
| تحقق معرفي | Knowledge questions |
| أولوية تطوير مقترحة | A recommendation, not a measured deficiency |
| مستهدف تطويري استرشادي | Editorial role-development target |
| سجلات مشاركة تدريبية | Participation records, not necessarily unique people |
| سجل خدمات التمكين | Recorded service activity |
| إشارة مستقبلية | Evidence-informed signal, not a guarantee |

### G. A rebuild plan for an intensive 1–2 day push by AI coding agents

This is feasible as a **focused release hardening and journey redevelopment**, not as full psychometric validation, exhaustive bilingual reauthoring, and 8 new features.

Use explicit file ownership. One integrator owns route definitions, shared contracts, and dependencies. Other agents should work against those contracts rather than independently changing them.

| # | Work packet | Scope | Reviewer-verifiable acceptance criteria | Dependencies | Parallelizable? |
|---|---|---|---|---|---|
| **1** | Freeze the release contract | Route map, terminology, evidence schema, result schema, feature scope | One agreed list of routes, labels, data contracts, and release exclusions; no unresolved competing navigation designs | None | No |
| **2** | Repair assessment entry and completion | `Home`, `Wizard`, role/entity entrances, draft state | Fresh-browser employee entrance reaches valid track/role confirmation; all 5 tracks complete; refresh resumes sensibly; incomplete required responses cannot produce a result | 1 | Yes |
| **3** | Unify results and development logic | `Results`, `Pathways`, `learning`, `levels`, result schema | High self-report/low judgment fixture produces a verification action in both results and plan; partial knowledge attempts remain partial; progression labels agree | 1 | Yes |
| **4** | Correct government-data claims | `sectorSkills`, `Impact`, `GovSectors`, `EntityDetail`, methodology | No measured-demand or causal-impact implication; denominators and coverage visible; no mixed-unit benefit total; missing records are not described as proven non-use | 1 | Yes |
| **5** | Establish independent identity | Header/footer, logo component, asset packaging, core tokens | No official logos in rendered pages or release assets; independent-concept statement visible; green/amber/IBM Plex family retained | 1 | Yes |
| **6** | Build the route shell and metadata | `App`, navigation, route registry, prerender setup, deployment config | Public pages open directly, refresh, share, and use back/forward correctly; AR/EN routes have distinct titles; unknown URL is handled; 5-item navigation works on mobile | 1 | Yes |
| **7** | Separate data delivery and strengthen storage | Dataset access, static data outputs, `store`, font assets | Landing page does not fetch full entity/career datasets; storage corruption or denial does not crash; versioned import/export and full deletion work; fonts are first-party | 1, coordination with 6 | Yes |
| **8** | Add one complete useful outcome | Development agreement and one representative decision brief/task map | Employee can select priorities and print a coherent plan; executive can obtain a sourced brief without assessment; all new content is bilingual | 3, shared contracts from 1 | Yes |
| **9** | Complete evidence and language checks for release scope | Claim records, shared source display, glossary, visible content | Every released quantitative claim resolves to source and confidence information; no placeholder English; counts derive from data; uncertain claims are qualified or withheld | 4, 8 | Yes |
| **10** | Accessibility and visual integration | Navigation, forms, charts, motion, responsive layouts, print styles | All primary journeys operable by keyboard; charts have equivalent text/table content; selected states announced; reduced motion verified; Arabic/English mobile and print review pass | 2–8 | Yes |
| **11** | Run adversarial release verification | Unit/data tests, Playwright journeys, accessibility checks, performance measurement | Reproduction cases from this review pass; no serious automated accessibility findings in primary journeys; no personal data in URLs or network requests; budget measured against final artifact | 2–10 | No |
| **12** | Publish the reviewed artifact | CI, preview, domain-path configuration, release manifest, rollback | Preview and release use the same artifact; direct links and assets work on the selected omary.me path; rollback artifact retained; existing site content preserved | 11 | No |

**Suggested sequencing:** Day 1 establishes contracts and completes packets 2–7 in bounded parallel work. Day 2 completes the narrow outcome, evidence/language integration, verification, and release.

If time is tight, cut additional decision briefs and optional exploration features. Do not cut the assessment-entry repair, recommendation consistency, government-claim corrections, independent identity, or direct-link testing.

### H. What NOT to do

- **Do not add an overall “government readiness score.”** The current evidence cannot support that interpretation.
- **Do not rank entities or employees by competence.** Service activity and self-report are not defensible comparative performance measures.
- **Do not present sample profiles as national benchmarks.** A benchmark requires a defined population, instrument, sampling approach, and date.
- **Do not add a chatbot as the flagship feature.** It would introduce a backend or external transmission, evidence-control problems, and scope that the core product does not need.
- **Do not describe encoded share links as anonymous or secure.** Encoding does not prevent a recipient from reading scores or identifying a person through context.
- **Do not launch team score aggregation during this push.** A useful local planning workshop can serve HR without establishing a channel for employee profiling.
- **Do not add accounts, cloud synchronization, analytics pixels, or session replay.** They are unnecessary for the stated concept and privacy model.
- **Do not keep official logos because they make the demo look authoritative.** That directly contradicts the brief.
- **Do not convert global forecasts or vendor enrollments into Saudi vacancy, salary, or entity-demand estimates.**
- **Do not add more careers, technologies, or scenarios before making existing recommendations coherent and traceable.**
- **Do not use a methodology disclaimer to excuse overclaiming in headings, charts, and calls to action.**
- **Do not promise psychometric validation within 2 days.** The release can become honest, dependable, and useful; validation requires separate empirical work.
- **Do not rebuild the whole stack merely to obtain URLs and static HTML.** Preserve working components and data while correcting the architecture.
- **Do not make the interactive radar the only way to understand the product.** A senior visitor should obtain the same conclusion from a clear brief, table, or plan.
- **Do not replace missing data with zero, missing English with silent Arabic fallback, or missing evidence with an impressive-looking percentage.**