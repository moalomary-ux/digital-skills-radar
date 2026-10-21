# Digital Skills Radar v8: content and evidence review

**Reviewer:** Claude Opus 5.5, independent senior content and evidence reviewer. My lens is Arabic editorial quality, terminology, numerals, sourcing, psychometric honesty and government credibility.
**Date:** 2026-10-21
**Scope:** the repository is read-only and was not modified. I ran no npm. I read every file in `src/data/*.ts` except a sample of `careers.ts`, `technologies.ts` and `techAr.ts`, and a scripted scan of `govEntities.ts`. I also read all `src/views/*.tsx`, `src/components/{Header,Footer,Disclaimer}.tsx`, the handover, the prior synthesis and the 18-page external review.
**Method:** I searched with grep and ran small Python counts over the data files: answer-key and length cues, plural errors, entity scopes and duplicate terms. Line references are `file:line` relative to `repo/`. Five facts were checked against the web, and the links are given where they are used. One cross-check uses the owner's own platform record: project memory `data-refresh-20261018.md`, verified 2026-10-18.

---

## A. Verdict

| Dimension | Score | One sentence |
|---|---|---|
| Product concept | **7/10** | A human-skills radar for government work, tied to the owner's two teams, is a strong idea that nobody else in the region offers. Youth-career content and a public layer of per-entity government data dilute it. |
| User journey | **5/10** | The path from assessment to results to plan works. Around it sit 19 views with no URLs, two different pages both called «دليل الجهات», and an executive entrance that lands on an adoption playbook rather than on anything useful to an executive. |
| Visual/brand | **6.5/10** | I did not render the site. The code shows disciplined tokens in the DGA-inspired theme, but 485 official logos and copy that does not match the visuals («المضلع البنفسجي» for a polygon drawn in amber) undercut the "inspired, not official" stance. |
| Engineering | **4.5/10** | The typed data model is clean. Against that: one 1.63 MB JS bundle (`dist/assets/index-gLuaTt7U.js`), `react-router-dom` installed but unused, every string inline in the views, and no tests beyond one self-test. |
| Content/evidence | **4/10** | The content is broad, Saudi-grounded, and honest about its limits on the methodology page. It is undermined by exposure of sensitive data, numbers that do not reconcile, visible Arabic errors, evidence items that can be guessed, and an evidence discipline that lives in the handover more than in the data. |

**Overall:** 5/10 as a flagship today. A content-first push (section G) can reach 8 or more without adding a single feature.

---

## B. Top 10 weaknesses, ranked by impact on a senior government audience

### B1. Internal per-entity government data and official logos on a personal domain (highest risk)
- **Why it matters:** A Deputy Minister will not ask about UX. The first question will be "who authorised publishing which services the Royal Court, State Security and the Ministry of Defense received from DGA?" One such question ends the demonstration and can become a compliance matter for the owner personally.
- **Evidence:**
  - `govEntities.ts:34` «مركز دعم اتخاذ القرار» (Royal Court sector) shows 56 training records, 9 consulting services, and «مستودع البرمجيات الحكومية (3)…».
  - `govEntities.ts:149` «الشؤون الخاصة لخادم الحرمين الشريفين».
  - `govEntities.ts:195` «مركز الأمن الوطني» shows «الدوائر الرقمية (5)؛ تفعيل الهوية الرقمية (1)…».
  - `govEntities.ts:1503` «رئاسة أمن الدولة» shows 42 training, 5 consulting, years «2023 إلى 2025».
  - 17 Royal Court/Cabinet, 21 Interior/Security and 12 Defense entities carry service records.
  - `EntityDetail.tsx` publishes each entity's yearly series and a section «ما الذي تحتاجه جهتك؟».
  - `Impact.tsx:254` publishes a top-10 league table of entities by benefit.
  - 261 entities are publicly labelled «لم تستفد من الخدمات بعد» (`Directory.tsx:179`, `EntityDetail.tsx:140`).
  - `public/logos/` holds 485 official PNGs (6.3 MB), including `ent-0009.png` (الديوان الملكي) and `ent-0179.png` (DGA itself, `govEntities.ts:3897`).
- **Contradictions:**
  - The brief says "no official logos".
  - The handover says logos were removed on the owner's direction: `HANDOVER-v8.md:26` «إزالة كل الشعارات الرسمية بعد توجيه المستخدم». They came back in v7.
  - `Footer.tsx:95` says «غير تابع لأي جهة رسمية», while `Impact.tsx:112` and `Impact.tsx:319` say «أرقام موثقة من سجلات الخدمة الرسمية / سجلات خدمات هيئة الحكومة الرقمية الرسمية». A reader concludes either a leak or an official endorsement; both are bad.
- **Fix sketch:**
  - Get a written data-classification decision from the data owner (public or restricted).
  - Until then, publish national aggregates and sector aggregates only, with small cells suppressed (fewer than 5 entities).
  - Remove entity pages, the league table, the «لم تستفد» labels and every logo. Use initials or no mark.
- **Effort:** S to remove. M to rebuild as aggregates.

### B2. Numbers that contradict the owner's own platforms, and themselves
- **Why it matters:** The owner runs QTECH and ADVICEDGA. If an official sees «7,915» here and «7,891» on «برنامج قدراتك», "no number without a source" collapses in one sentence.
- **Evidence:**

| Figure | Radar | Elsewhere |
|---|---|---|
| Training records | 7,915 (`govServices.ts:59`) | Workbook prose: 7,935 (`Impact.tsx:326` admits the gap). QTECH live, deduplicated 2026-10-18: **7,891**. |
| Consulting services | 2,873 (`govServices.ts:60`) | Workbook prose: 2,918. QTECH: **2,918**. ADVICEDGA reads 2,788 government services across 320 government entities. |
| Entities served | «421 جهة حكومية استفادت» (`Home.tsx:218`) | The same file says only **370** are government or quasi-government (`govServices.ts:58`). Of the 421, 47 are private and 4 are non-profit (scope field in `govEntities.ts`). |
| Directory | «682 جهة حكومية وشبه حكومية» (`Impact.tsx:349`, `Directory.tsx:63`) | Scope breakdown: 442 government, 90 quasi, **114 private**, 34 non-profit, 1 international. Types include 79 PIF portfolio companies, 29 sports clubs, 29 sports federations and 21 banks. QTECH holds 604 entities. |
| «إجمالي الاستفادة» = 10,788 | `Impact.tsx:100`, `Impact.tsx:257` | Adds training *records* to consulting *services*, which are different units. |

- **Fix sketch:** Define one data contract. Every figure is a fact object with value, unit, scope, as-of date and source. Add a visible reconciliation note: "the radar uses the 2026-10-18 deduplicated register used by «برنامج قدراتك»" (or the reverse). Scope labels must say «جهة مستفيدة» and give the government share separately. Drop «إجمالي الاستفادة».
- **Effort:** S to M.

### B3. Arabic errors on high-visibility surfaces
- **Why it matters:** Arabic is the primary language, and a native reader notices these errors in seconds. One of them is on step 2 of the home page.
- **Evidence:** the full list is in F5. The worst cases:
  - «قيّس» in 7 places, including `Home.tsx:164` «قيّس مهاراتك».
  - «تخطيط العدو / مراجعة العدو» for Sprint (`learning.ts:780`, `learning.ts:782`, `learning.ts:787`). This reads as "planning the enemy".
  - «لعبارات عمل جهتك الحرجة» (`scenarios.ts:1072`), meant as "workloads".
  - «حتى يتعاشرا» (`scenarios.ts:989`).
  - «انتحار تشغيلي» (`scenarios.ts:836`).
  - «اصغ مساهمة» (`learning.ts:505`), which means "listen".
  - «يتشاركون حساب إداري واحدًا» (`scenarios.ts:798`).
  - 197 generated strings of the form «و4 خدمة أخرى / و1 خدمة أخرى» in `govEntities.ts` (`topConsulting`).
- **Fix sketch:** A native editor does a full pass against a glossary. Generated counts use `Intl.PluralRules('ar')`. Add a CI lint for the known error list.
- **Effort:** S to M.

### B4. Tone toward the public sector and positioning drift
- **Why it matters:** The platform's primary audience is government employees, yet it tells them their sector is slow and their jobs are outdated. That is unacceptable on a DGA GM's flagship.
- **Evidence:**
  - `guidance.ts:122`: «والشركات الخاصة توظّف بناءً على القدرة المثبتة أسرع بكثير مما كان يفعل القطاع العام. استراتيجية «الوظيفة الحكومية الآمنة» لجيل الآباء لم تعد إحصائيًا الطريق الرئيس».
  - `careers.ts:1412`: «لا تستهدف المكتب الحكومي بصورة 2010 … لا عبر انتظار منصب كتابي».
  - `careers.ts:746`: «السكرتارية القانونية **وكتابة العدل**» is tagged «يندثر», with the verdict «لا — كهدف مهني تجنّبه». كاتب العدل is a Ministry of Justice office. Prior review P1-14 asked for this fix and it **was not applied**.
  - The navigation still sells career guidance: «اكتشف التخصصات» (`Header.tsx:48`) and «ما يزدهر وما يندثر» (`Header.tsx:25`).
  - The footer tagline is «منصة إرشاد مهني ومهاري» (`Footer.tsx:58`), and the meta description says «وإرشاد مهني» (`index.html:6`).
  - The career pages speak to parents: «هل أنصح ابني بهذا التخصص؟» (`Careers.tsx:273`).
- **Fix sketch:** Delete or neutralise the disparaging lines. Move the youth and parent tools out of the main navigation, either into a separate «للأفراد» area or removed. Rewrite the footer and meta to «تطوير قدرات القوى العاملة الحكومية».
- **Effort:** S for copy. M to restructure.

### B5. The institutional playbook contradicts the platform's own ethics and privacy promises
- **Why it matters:** An HR director will read this page as policy advice from a DGA GM.
- **Evidence:**
  - `futureSkills.ts:399` «اربط نتائج التقييم بملف الموظف في نظام الموارد البشرية» contradicts `futureSkills.ts:407` «لا تُعرض نتيجة فرد إلا للفرد نفسه…» and the usage boundary at `futureSkills.ts:410`.
  - `futureSkills.ts:390` «وثبّت **مستويات الاستحقاق** لكل مرتبة وظيفية»: "entitlement levels per grade" is the language of promotion.
  - KPI «نسبة إتمام التقييم ≥ 80%» (`futureSkills.ts:416`) cannot be measured on a platform that collects no data, and it makes a voluntary reflection tool coercive.
  - On the employee's development-plan page, «منصة جدارات … للترشح والمفاضلة على الوظائف العامة» (`learning.ts:1176-1178`) appears as a "support rail".
  - The home-page roadmap promises public portfolios that families can follow and mentor matching by gender (`guidance.ts:390-408`, `Home.tsx:297-315`), which conflicts with privacy by default.
- **Fix sketch:** Remove the HR-file linkage and «مستويات الاستحقاق». Turn KPIs into ones that respect anonymity and opt-in. Take Jadarat out of the plan. Drop social and portfolio features from the roadmap.
- **Effort:** S.

### B6. The "evidence layers" can be guessed
- **Why it matters:** The product's main psychometric claim is that judgment and knowledge layers check self-report. As written, a test-wise user maxes both without knowing anything, while the results page flags inflation in other people.
- **Evidence (computed):**
  - **Scenarios:**
    - In 33 of 40, the best option is the longest Arabic text.
    - In 33 of 40, the best option starts «أفعل ذلك / نفعل ذلك / أسأل ذلك / أضيف لذلك». It refers to another option, which is shuffled at render (`Wizard.tsx:17-18`, `Wizard.tsx:381`), so "that" may appear *below* it.
    - Every item follows the same ladder: reckless, passive, correct, then correct plus institutionalise.
  - **Calibration MCQ:** in 19 of 24, the key is the longest option.
  - **Calibration true/false:** 13 of 16 are keyed «خطأ», and almost all use absolutes («مضمون، يلغي جميع، دائمًا، بالضرورة، فقط»). The «صحيح/خطأ» order flips between items.
  - **Inflation flag:** one scenario per domain drives the «تحقق من التضخيم» flag (`Results.tsx:133`).
  - **Headline:** an unmeasured judgment layer is printed as «فهمك الموقفي 0.0 من 4» (`Results.tsx:227`).
- **Fix sketch:** Item-writing repair (packet G5): standalone, length-balanced options, a balanced true/false key, at least 2 items per domain before any flag, and «لم يُقَس» instead of 0.0.
- **Effort:** M.

### B7. The evidence discipline is claimed, not implemented
- **Why it matters:** The handover promises the owner something the data does not deliver. `HANDOVER-v8.md` §5 says «كل ادعاء كمي يحمل حقل `source` … مع شارة ثقة».
- **Evidence:**
  - A `source` field exists only in `careers.ts` (provenance map). No `confidence` field exists anywhere in `src/`.
  - Trust badges render only on career cards (`Careers.tsx:31-34`).
  - Unbadged numbers: `Home.tsx:301` «يُتمّها 3–6% فقط» (no source at all), every figure in the explainer `guidance.ts:82-131` (inline citations only), the micro-skill demand signals (`futureSkills.ts`), framework facts with no date (`standards.ts`), the sector-demand percentages, and the playbook KPI targets.
  - The evidence register asked for in P0-10 does not exist.
- **Fix sketch:** A fact registry (packet G2) and a public «سجل الأدلة» page.
- **Effort:** M.

### B8. Stale or wrong facts and inconsistent counts
- **Evidence:**
  - SFIA 9 «أكثر من 121 مهارة» (`standards.ts:8`). SFIA 9 has **147** skills; 121 was SFIA 8.
  - «بطالة السعوديين … 6.3% … مستوى قياسي … تحقق مستهدف 7%» (`guidance.ts:122`). The series has moved since: 7.2% in Q4 2025, 6.4% in Q1 2026, 6.5% in Q2 2026.
  - Women's participation «36.3% … متجاوزةً مستهدف 30%» (`careers.ts:2571`). That is the series *peak*; Q1 2026 is about 33.9%.
  - `SLEN` (`roleLibrary.ts:195`) is still present although P1-9 flagged it.
  - Counts disagree:
    - Careers: 30 vs 50 (`Methodology.tsx:21`, `guidance.ts:404`).
    - Roles: 20 vs 24 (`Wizard.tsx:173`, `Roles.tsx:30` vs `Home.tsx:30`).
    - Calibration questions: 24 vs 40 (`learning.ts:5`, `learning.ts:545`).
- **Fix:** Refresh the facts. Derive every count in the UI from array lengths. Details in F3.
- **Effort:** S.

### B9. The derived "skills demand" overclaims
- **Why it matters:** «ما الذي تحتاجه جهتك؟ … وليس افتراضًا» (`EntityDetail.tsx:151`) and «محسوبة — لا مفترضة» (`Methodology.tsx:65`, `sectorSkills.ts:2-3`) present an editorial weighting as a measurement. The weights (0.7/0.3 and so on, `sectorSkills.ts:31-64`) are assumptions.
- **Further problems:**
  - Consulting *requests to DGA* are not workforce skill demand.
  - Cyber can never exceed 0.3 of one category, because NCA's mandate is not in DGA's consulting catalogue. A security sector will therefore "need" little cyber, which is an absurd message to a security audience.
  - Renormalising the top 3 to 100% exaggerates contrast.
- **Fix:** Rename to «مؤشر تقريبي مشتق من طلبات الاستشارات لدى الهيئة» with an «تحريري/منخفض» badge, aggregate to sector level only, and caveat cyber.
- **Effort:** S.

### B10. Terminology chaos and incomplete bilingualism
- **Evidence:**
  - Data literacy has 3 names. Data steward has 2 (one wrong, «وكالة البيانات»). Agile has 3 spellings, blockchain 3, and agentic AI 3.
  - The same thresholds carry two 4-tier names (خبير/رائد).
  - «Awareness» names both a track and a level.
  - The owner's own program appears as «برنامج قدراتك (قدرات-تقنية)» / "QTech (Qudrat-Tech)" (`learning.ts:237`) and as "Qudratok Program" (`pathways.ts:20`), with two different URLs.
  - 359 of 682 entities have no English name, and sectors, categories and regions are Arabic-only strings. English provider names leak into the Arabic UI (`Pathways.tsx:183`).
- Full tables are in F7 and F9.
- **Effort:** M.

---

## C. Idea evolution: proposals that make the product materially stronger

### C1. «موجز القدرات» for a sector or entity: a printable one-page brief — **MUST**
- **What:** A one-page, bilingual, printable brief per sector, or per entity on request.
  - National context (aggregate facts with dates).
  - The 3 domains most relevant to the sector's mandate, with editorial rationale and a badge.
  - The 5 role families most affected.
  - The 3 recommended interventions, each mapped to a real offer: a «برنامج قدراتك» track, a «منصة الاستشارات والدراسات» service, or an IPA or SDAIA Academy course.
  - "How to measure progress in 90 days."
- **Serves:** Deputy Minister, CIO, HR director.
- **Better than today:** It replaces the risky per-entity utilisation pages with something an executive can take into a meeting.
- **Data needed:** Sector-level aggregates cleared for publication, a mapping table reviewed by the owner's consulting team, and the QTECH/ADVICEDGA catalogue as a static export.
- **Effort:** M. **Risk:** low once B1 is resolved.

### C2. Team radar from shareable codes (client-side aggregation) — **WOW**
- **What:**
  - Each employee exports a short code from their result: domain scores rounded to 0.5, track and role, with no name.
  - A manager pastes 5 or more codes, and the browser renders a team heat-map and the shared top-3 gaps. Nothing leaves the device.
  - Below 5 codes the view refuses to render (k-anonymity).
  - A printable team plan follows: which domain to take as a team, which scenarios to discuss.
- **Serves:** HR director, team lead.
- **Better than today:** It answers "what does my team need?" without any backend or data collection.
- **Effort:** M. **Risk:** low to medium; codes can be shared under pressure, so add consent text and keep a minimum group size.

### C3. «كيف يتغير عملي؟» task maps for the 10 most populous government job families — **MUST**
- **What:** It replaces the 50-career youth explorer. For each job family (administrative officer, HR specialist, procurement officer, customer-service officer, financial officer, legal researcher, and others) it gives:
  - the 12–15 core tasks;
  - each task's AI/automation tag (automate, augment or human);
  - the skill that protects or upgrades it;
  - one scenario and one 2-week micro-action.
- **Serves:** mid-level employees, the largest audience.
- **Data needed:** the Saudi Unified Classification of Occupations (التصنيف السعودي الموحد للمهن) instead of approximate ISCO-08; ILO 2025 exposure at task level, cited; editorial review by the owner's training team.
- **Effort:** L. Start with 3 families.

### C4. Scenario workshop kit — **SHOULD**
- **What:** Turn the 40 scenarios, once repaired (G5), into facilitator cards: situation, options, discussion questions, the "mature" answer and why, and the link to a skill record. Printable as an A4 deck.
- **Serves:** the owner's Digital Skills team, which can run these in workshops.
- **Better than today:** It is the most original content in the product, and it is currently used as a guessable test.
- **Effort:** S to M.

### C5. Executive decision rehearsal — **WOW**
- **What:** 6 investment cases built from existing executive scenarios (`scenarios.ts:1010-1245`): an AI chatbot versus governance first, a cloud lock-in discount, an inclusion gap, a regulatory stance, "green until failure" reporting, and conference hype. The executive writes success and stop conditions. The tool returns a structured decision memo they can print.
- **Serves:** Deputy Minister, CIO.
- **Better than today:** It turns «قرار بشروط نجاح وتوقف» from rhetoric into a practice.
- **Effort:** M.

### C6. A public evidence register with freshness — **MUST**
- **What:** One page lists every number in the product. Each entry has the claim, value, unit, scope, source, publication date, type (official, survey or self-reported), confidence, the page where it is used, and the next review date. Facts past their review date show «يحتاج تحديثًا».
- **Serves:** all audiences, and especially sceptics.
- **Better than today:** It makes the "no number without a source" promise checkable.
- **Effort:** M (the same work as G2).

### C7. A bridge from plan to offer, tied to the owner's two teams — **SHOULD**
- **What:**
  - Each gap in the 90-day plan maps to a real national offer: «برنامج قدراتك», IPA, SDAIA Academy, Doroob, or the consulting services of «منصة الاستشارات والدراسات» for entity-level needs.
  - A "request for my team" button produces a pre-filled text or email that the user sends themselves. No backend.
- **Serves:** employees and managers. It also connects the concept to the owner's real portfolio.
- **Effort:** S to M.

### C8. A printable personal development report for a 1:1 — **MUST (cheap)**
- **What:** A one-page PDF built from the browser's print stylesheet. It has the radar with a data table, 3 priorities, the first 2 weeks of the plan, and a fixed footer: «للحوار التطويري فقط — لا يُستخدم في التقييم أو الترقية».
- **Effort:** S.

### C9. Optional, clearly separated pilot calibration — **WOW, separated, later**
- **What:** A single-entity, opt-in, anonymous pilot (n ≥ 200) to set norms and validate thresholds 1.25/2.25/3.25 and scenario discrimination. Run it on an approved government host, not on omary.me. The static core stays unchanged and only publishes the resulting norms with a date.
- **Risk:** governance. It needs the entity's DPO and a documented PDPL legal basis.

---

## D. Information architecture and journey

### Top-level navigation (5 items, Arabic first)
1. **الرئيسية**
2. **قِس قدراتك**: التقييم → نتائجي → خطتي (90 يومًا). The results and the plan sit inside this item, not in the main navigation.
3. **القدرات المطلوبة**: مكتبة الأدوار · سجل المهارات · مهارات المستقبل · «كيف يتغير عملي؟» (C3). The technology radar is folded in here as «تقنيات تمس مهاراتك» inside each domain.
4. **للجهات والقيادات**: موجز القدرات (C1) · فريقي (C2) · محاكاة القرار (C5) · دليل التبني (rewritten) · أثر التمكين (national aggregates only).
5. **المنهجية والأدلة**: المنهجية · سجل الأدلة (C6) · المعايير والمراجع · سجل الإصدارات. The technical changelog goes to the repository.

### Merge, demote, rename or remove

| Current view | Action | Reason |
|---|---|---|
| `careers`, `decide`, `lists`, `explore` | **Remove from the flagship**, or move to a separately branded «للأفراد» sub-area reached only from the footer | Student and parent framing; disparaging lines; 50 careers including pilots and tour guides labelled «حكومية ومجاورة» (`Careers.tsx:87`) |
| `directory`, `entity-detail` | **Remove** until the classification decision is made; afterwards make them sector-level only | B1 |
| `sectors` | Keep **only** as a sector-aggregate view; drop «تغطية/نسبة الشعارات» (`GovSectors.tsx:128`, `Impact.tsx:339`), an internal data-hygiene metric shown as a KPI | — |
| `impact` | Keep national totals with the reconciliation note; drop the top-10 table and the summed «إجمالي الاستفادة» | B2 |
| `tech-radar` | Rename and demote: avoid «رادار التقنيات الحكومية» (`TechRadar.tsx:85`), which echoes DGA's official product name | H |
| `entities` (playbook) | Rename «دليل تبنّي المنصة في الجهات» and fix B5 | Today both it and the directory are called «دليل الجهات» |
| `standards` + `methodology` | Merge under «المنهجية والأدلة» | — |
| `skills` (registry) | Keep under «القدرات المطلوبة» | — |

### Naming rules
- Use the imperative «قِس» (never «قيّس»).
- Use «القدرات» for the product promise and «المهارات» for items.
- Use «المستفيد» for citizens and businesses, never «العميل» in the government context.
- Give each concept one name, from the glossary in F7.

### Primary journeys
- **Mid-level employee:** home «قِس قدراتك» → track (5) → role → 40 statements → 8 scenarios (at least 16 once repaired) → results (self-estimate, judgment, priority) → plan → print the 1:1 report (C8) → optionally share a code with the manager (C2).
- **Specialist:** home → «القدرات المطلوبة» → role library → "measure against this role" → results → plan mapped to certifications, balanced against vendor-neutral options.
- **HR director or team lead:** «للجهات والقيادات» → «فريقي» (paste codes) → team gaps → workshop kit (C4) → request training from «برنامج قدراتك» (C7).
- **CIO:** «للجهات والقيادات» → sector brief (C1) → the technologies that touch each domain → decision rehearsal (C5).
- **Deputy Minister:** the home page shows a one-screen summary: what changes in government work, the 3 numbers that matter (dated and sourced), and «موجز قطاعك». They read the brief (C1), print it, and are done in 3 minutes.

---

## E. Engineering review for a static deployment on omary.me

I am the content reviewer, so this section is deliberately concise and grounded in what I saw in the repository.

- **Routing and deep links:**
  - Today views are switched with `useState<View>` (`store.tsx:101`), and `react-router-dom@6` is in `package.json` but unused.
  - Use React Router `createBrowserRouter` with real paths (`/assess`, `/results`, `/plan`, `/roles/:id`, `/skills/:id`, `/methodology`, `/en/...`). Add a `404.html` SPA fallback on GitHub Pages, or `_redirects` on Cloudflare Pages.
  - Better still, pre-render the content pages (role, skill record, methodology, evidence register) with `vite-react-ssg` so they are crawlable and shareable.
  - Language goes in the path prefix (`/en/`), not only in localStorage.
- **Bundle and code-splitting:**
  - The single JS file is 1.63 MB uncompressed and includes the entity, tech and career datasets.
  - Lazy-load routes (`React.lazy`), and move large datasets to `public/data/*.json` fetched on demand.
  - Budget: 200 KB gzipped of JS on first load, and LCP under 2.0 s on a mid-range phone over 4G.
  - framer-motion: use `LazyMotion` with `domAnimation`.
- **Data loading:** JSON files are versioned with a `meta` block (as-of date, source, contract version). Facts come from one `facts.json` (G2). Nothing numeric is hard-coded in views.
- **SEO, meta and OG:**
  - Give each route its own `<title>`/description in Arabic and English, `hreflang` pairs, `og:image` (static, no official logos), and a `sitemap.xml`.
  - Replace the current meta description (`index.html:6`) with the government-workforce positioning.
- **i18n:**
  - Extract inline `{ar,en}` objects from the views into `locales/ar.json` and `locales/en.json` with ICU MessageFormat, for example via `@formatjs/intl` or `i18next` with ICU.
  - Use `Intl.PluralRules('ar')` for every count; this fixes «و4 خدمة أخرى» and the label grammar next to KPI numbers.
  - Keep Western digits by formatting with `ar-SA-u-nu-latn` everywhere. The codebase is currently clean: **0 Eastern digits** in `src/`.
- **Accessibility:**
  - Every SVG chart (radar, tech radar, network map, bars) needs a visually hidden `<table>` or a "show data" toggle.
  - `aria-describedby` on chart summaries; keyboard focus on radar vertices; `prefers-reduced-motion` already handled.
  - Scenario and quiz options must be real radio groups.
- **RTL:** Use logical properties (already partly done: `text-start`, `ms-`). Wrap mixed Arabic and Latin with `<bdi>`. Audit arrows («←/→») per language.
- **Performance and assets:** Remove the 485 PNG logos (B1). If any marks are approved, convert them to WebP or AVIF, size them at 64 px, lazy-load them, and serve them from one sprite.
- **PWA and offline:** Optional. Use `vite-plugin-pwa` with a cache-first app shell so the assessment works offline. Results never leave the device.
- **Testing a static site:**
  - Vitest is installed but has no tests. Add:
    - unit tests for scoring (port `scripts/levels.selftest.mjs`);
    - **content tests**: counts in copy equal array lengths; no Eastern digits; no glossary-banned terms; every fact has source and date; answer-key balance (best option not the longest in more than 30% of items, true/false within 40–60%); no option starting «أفعل ذلك»;
    - Playwright smoke tests per route in both languages;
    - `axe-core` checks;
    - `lychee` link checks for the 48 resource URLs.
- **Build and deploy:**
  - GitHub Actions runs typecheck, tests, the content lint, Lighthouse CI and a link check, then builds.
  - Deploy to Cloudflare Pages or GitHub Pages with the custom domain `omary.me`.
  - Set headers: `Content-Security-Policy` (self plus Google Fonts), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
  - No analytics by default. If needed, use a cookieless, aggregate-only tool, declared on the privacy page.

---

## F. Content and evidence review: what would embarrass the owner

### F1. Data governance (the item that can end the demonstration)
1. **Per-entity service utilisation for sovereign and security bodies** (B1). The quotes are exact; for example `govEntities.ts:1503-1525`, «رئاسة أمن الدولة», shows «تفعيل الهوية الرقمية (2)؛ برنامج التميز الرقمي والأبعاد المختلفة (1)؛ و2 خدمة أخرى» and «2023 إلى 2025». Publishing what a security body consulted DGA about, and when, is a classification question the owner cannot answer on a stage.
2. **League tables and naming non-users.** «أعلى 10 جهات استفادة» (`Impact.tsx:254`), plus 261 public «لم تستفد من الخدمات بعد» labels. Entities did not consent to being ranked.
3. **Non-government bodies presented as government.** 27 entities sit in sector «القطاع الخاص», including law firms and IT vendors: `govEntities.ts:13103` «Al Habardi Law», 'Secure Networks', 'bmb group'. There are also banks (`govEntities.ts:11321` «مصرف الراجحي»), football clubs (`govEntities.ts:9809` «نادي الأهلي») and SRMG subsidiaries, all inside «682 جهة حكومية وشبه حكومية».
4. **Official logos**, including the Royal Court's and DGA's own, on a personal site that says «غير تابع لأي جهة رسمية» (`Footer.tsx:95`). Prior owner direction removed them (`HANDOVER-v8.md:26`).
5. **The "official" label.** «سجلات خدمات هيئة الحكومة الرقمية الرسمية» (`Impact.tsx:319`) on a non-official site creates the impersonation risk the brief forbids.

### F2. Numbers that do not reconcile
See the table in B2. Three more:
- Region chart: Riyadh holds 288 of 421 served entities (`govServices.ts:100`). This reflects headquarters location, not service reach. Add «حسب مقر الجهة الرئيس» or remove the chart.
- The Home KPI labels mix grammatical forms next to numbers: «جهة حكومية استفادت / سجل تدريبي / خدمة استشارية / برنامجًا تدريبيًا» (`Home.tsx:218-221`). Only the last is in the tamyiz form. Pick one: label-style nominatives without tamyiz, such as «الجهات المستفيدة».
- The methodology page shows prose numbers (7,935/2,918) next to table numbers (7,915/2,873) (`Methodology.tsx:58`, `Impact.tsx:326`). Being honest about it is good, but showing the discrepancy on the public face, without the reconciled figure used by «برنامج قدراتك», invites the question "which one is right?"

### F3. Stale, wrong or overclaimed facts

| # | Claim (location) | Problem | Fix | Confidence |
|---|---|---|---|---|
| 1 | «إطار SFIA 9 … أكثر من 121 مهارة» (`standards.ts:8`) | SFIA 9 (Oct 2024) has **147** skills; 121 is SFIA 8. SFIA 10 is planned for Q4 2027, so SFIA 9 stays current. Sources: [BCS](https://www.bcs.org/articles-opinion-and-research/framing-the-new-digital-landscape/), [SFIA 9 release notes](https://sfia-online.org/en/sfia-9/sfia-9-release-notes), [SFIA March 2026 update](https://sfia-online.org/en/news/march-2026-sfia-update) | «147 مهارة على 7 مستويات (SFIA 9، أكتوبر 2024)» | High |
| 2 | «بلغت بطالة السعوديين مستوى قياسيًا منخفضًا عند 6.3% في الربع الأول 2025 … وتحقق مستهدف رؤية 2030 للبطالة (7%) قبل ست سنوات» (`guidance.ts:122-123`) | 18 months stale. Reported GASTAT series: Q1 2026 6.4% (down 0.8 pp q/q, which implies about 7.2% in Q4 2025, *above* 7%); Q2 2026 6.5%. "Target met" depends on the quarter quoted. Sources: [Gulf News](https://gulfnews.com/world/gulf/saudi/saudi-unemployment-falls-to-64-in-q1-2026-1.500592445), [Trading Economics](https://tradingeconomics.com/saudi-arabia/unemployment-rate/news/588098) | Latest quarter with date and a link to the GASTAT release; add a quarterly review date | Medium-high (secondary reports of GASTAT; confirm on stats.gov.sa) |
| 3 | «مشاركة المرأة السعودية … 36.3% (الربع الأول 2025) متجاوزةً مستهدف 30%» (`careers.ts:2571`) | 36.3% is the series peak; Q1 2026 is about 33.9%, per analysis of GASTAT. Quoting the peak as current is cherry-picking. Also confirm whether the 30% target has been updated. Sources: [GASTAT news](https://www.stats.gov.sa/en/w/news/6), [analysis](https://vision2030.ai/analysis/saudi-women-workforce-participation-falling/) | Latest quarter, dated | Medium (verify on GASTAT) |
| 4 | «القطاع الخاص لا الحكومة هو من يخلق غالبية الوظائف الجديدة … (البنك الدولي/الموارد البشرية 2025: حصة 52.8%)» (`guidance.ts:122`; also `careers.ts:1388`, `careers.ts:2429`) | A *share of employment* (stock) is used to support a claim about *new jobs* (flow). "World Bank/HRSD" is not a specific publication. The sentence also disparages the public sector (F6). | Delete, or cite the exact publication and table | High (logic) |
| 5 | «وخلاصة McKinsey أن التوظيف المهاري أدق خمس مرات» (`guidance.ts:106`) | No year or report named; the statistic is widely misattributed | Cite the specific McKinsey publication and year, or remove | Medium |
| 6 | «يتناول برامج المهارات الحكومية ويربط انتشار التدريب بمكاسب إنتاجية قابلة للقياس» (GTMI, `Standards.tsx` top cards) | GTMI is a maturity *index*. It describes a top maturity level; it does not measure productivity gains | «يتضمن مؤشرًا لبرامج المهارات الرقمية في القطاع العام» | Medium |
| 7 | «تقارير دولية محكّمة (WEF … McKinsey …)» (`Methodology.tsx:23`) | WEF and McKinsey reports are not peer-reviewed | «تقارير دولية مرجعية» | High |
| 8 | «الإطار الوطني السعودي للمهارات الرقمية … مبني عليه: 102 مهارة على 7 مستويات» (`standards.ts:10`) | No link and no date | Add a URL and date, or soften | Unverified |
| 9 | Qatar DSF «115 مهارة … 4 مستويات» (`standards.ts:87-97`); SDAIA occupational standards (`standards.ts:74-84`) | Root-domain URLs only (`mcit.gov.qa`, `sdaia.gov.sa`) | Deep links and dates | Unverified |
| 10 | «نمو التسجيل في مساقات الذكاء الاصطناعي التوليدي بنسبة +195% — أسرع مهارة نموًا **على الإطلاق** في المنصة» (`standards.ts` reportCards) | The superlative is probably editorial | Quote the report's wording | Medium |
| 11 | `SLEN` (`roleLibrary.ts:195`) | Already flagged in P1-9 and still present. SFIA's site reliability engineering code is `SREN` | Verify all 24 roles' codes automatically against the SFIA 9 list | Medium-high |
| 12 | «السكرتارية القانونية **وكتابة العدل**» (`careers.ts:746`) | Mistranslation flagged in P1-14 and still present; it tags a Ministry of Justice office as dying | «السكرتارية القانونية والأعمال الكتابية القانونية» | High |
| 13 | «تمكين …: الاتحاد السعودي للأمن السيبراني والبرمجة» (`pathways.ts:14`) | The same body appears with its current name in the directory, «…والبرمجة والدرونز» | Use the current official name | High |
| 14 | «مسح الأمم المتحدة للحكومة الإلكترونية 2024» (`standards.ts` reportCards) | Biennial survey; check whether the 2026 edition is out before launch | Update or date-stamp | To verify |
| 15 | «أكاديمية طويق (أكثر من 32 ألف متدرب)» (`guidance.ts:114`); «نحو 80% من خريجيها يُوظَّفون» (`guidance.ts:98`) | No source or date in this text. The 80% figure is self-reported, labelled in careers but not here | Badge «بيان ذاتي الإبلاغ» with date | High |
| 16 | «المساقات المفتوحة وحدها يُتمّها 3–6% فقط» (`Home.tsx:301`) | Unsourced, on the home page | Source (HarvardX/MITx year) or remove | High |
| 17 | Community rationales: «Ruzuku cohort dataset 2026», «Harvard/MIT MOOC completion research» (`guidance.ts:374-387`) | A small vendor's blog data and an unnamed study | Use peer-reviewed sources (e.g., Reich & Ruipérez-Valiente, *Science* 2019) or drop | High |
| 18 | «الطلب صاعد بثبات ومقاوم للأتمتة بطبيعته» (leadership trajectory, `futureSkills.ts` leadership entry) | Overclaim | «أقل عرضة للأتمتة» | High |
| 19 | «التوائم الرقمية مدمجة في المشاريع الكبرى السعودية» (`futureSkills.ts` digital-twin micro-skill) | Unsourced | Cite or soften | High |
| 20 | Cyber evidence: Arabic «ملزمة للجهات والبنية الحرجة» vs English «mandate cyber staffing across government» (`futureSkills.ts` cyber trajectory) | The Arabic and English say different things; the English overclaims | Align on the Arabic | High |
| 21 | «يصف تقرير OECD لعام 2026» (tech cluster essay, `technologies.ts` citizen-experience cluster) | The publication is not named | Name it, or say «اتجاهات OECD الحديثة» | Medium |
| 22 | «رادار التقنيات الحكومية» (`TechRadar.tsx:85`) | Same name as DGA's official GovTech Radar on a personal site | «تقنيات تمس المهارات» or «رادار التقنيات الناشئة (مفهومي)» | High (risk) |

### F4. Where the evidence discipline is missing (claimed in the handover, absent in the data)
- No `confidence` property exists in any data file. A `source` property exists only in `careers.ts` (provenance map). Trust badges render only in `Careers.tsx:31-34`.
- Quantitative claims with no structured source or date:
  - `Home.tsx:301`.
  - All of `guidance.ts:82-131`: 39%, 85%, 53%, 97%, 1/700, 45%, 94%, 73%, 61%, 80%, 32,000, 6.3%, 52.8%, 59/100.
  - `futureSkills.ts` demand signals: +165%, 45/min, +107%, 86%, 77%, 58%, 63%, 79%, 50%.
  - `standards.ts` facts.
  - The playbook KPI targets (`futureSkills.ts:416-421`). These are acceptable as «مقترح», but need a badge saying they are editorial.
- Prior review **P0-10 (evidence register: claim → source → year → type → link → review date) was not implemented**, although the handover lists all P0 items as applied.

### F5. Arabic language errors (exact strings; corrections)

| Location | Current | Correction |
|---|---|---|
| `Home.tsx:164`, `GovSectors.tsx:166`, `EntityDetail.tsx:168`, `Explore.tsx:262`, `Careers.tsx:423`, `Careers.tsx:428`, `Methodology.tsx:143` | «قيّس» | «قِس» (already correct at `Home.tsx:20` and `FutureSkills.tsx:71`; the same page uses both) |
| `learning.ts:780`, `learning.ts:782`, `learning.ts:787` | «تخطيط العدو / مراجعة العدو / العدو» (reads as *the enemy*) | «تخطيط الدورة (Sprint Planning)»، «مراجعة الدورة»، «الدورة (Sprint)» |
| `learning.ts:1058` | «والتخطيط للتخطيط (Planning)» | «واجتماع التخطيط لتحديد عمل الدورة التالية» |
| `learning.ts:505` | «اصغ مساهمة» (= listen) | «صُغ مساهمة» |
| `learning.ts:488`, `learning.ts:506` | «وقد مسار عمل»، «قد جلسة للفريق» (reads as the particle «قد») | «وتولَّ قيادة مسار عمل»، «أدِر جلسة للفريق» |
| `scenarios.ts:186` | «فريقك الانتقل إلى دورات» | «انتقل فريقك إلى دورات» |
| `scenarios.ts:202` | «عندما يُسألني الميسّر» | «عندما يسألني الميسّر» |
| `scenarios.ts:232` | «ولا يحلها قاعدة البيانات الحالية» | «ولا تحلها قاعدة البيانات الحالية» |
| `scenarios.ts:438` | «التسلسل الصامت يعلّم الجهة…» | «الرضوخ الصامت يعلّم الجهة…» |
| `scenarios.ts:443` | «الطقسية الجامدة» | «التمسك الحرفي بالإجراء» |
| `scenarios.ts:545` | «(إعادة وزن/ميزان قيم)» | «(إعادة ترجيح العينة أو موازنتها)» |
| `scenarios.ts:685` | «أراجع التقنين» | «أراجع أداة القياس والتتبع» |
| `scenarios.ts:798` | «يتشاركون حساب إداري واحدًا» | «يتشاركون حسابًا إداريًا واحدًا» |
| `scenarios.ts:816` | «يعالج السلوك وسببته التشغيلية» | «يعالج السلوك وسببه التشغيلي» |
| `scenarios.ts:836` | «الكلفة بلا خريطة انتحار تشغيلي» | «خفض الكلفة دون خريطة للموارد مجازفة تشغيلية» |
| `scenarios.ts:841` | «موارد يتيمة وحقولًا مفتوحة» | «موارد غير مستخدمة وبيئات منسية» |
| `scenarios.ts:978` | «دمجت جهتك مع وحدة أخرى» | «دُمجت جهتك مع وحدة أخرى» |
| `scenarios.ts:989` | «حتى يتعاشرا» | «حتى يتآلفا تدريجيًا» |
| `scenarios.ts:1072` | «التزام حصري لعبارات عمل جهتك الحرجة» | «التزام حصري لأعباء العمل الحرجة في جهتك» |
| `Home.tsx:30` | «مكتبة الأدوار الأربع والعشرين» | «الأدوار الأربعة والعشرين» |
| `Pathways.tsx:73` | «تسعون يومك القادمة» | «أيامك التسعون القادمة» |
| `guidance.ts:90` | «أقل من 1 من كل 700 توظيفًا» | «أقل من توظيف واحد من كل 700» |
| `futureSkills.ts:175` | «وكالة البيانات» (= data agency) | «أمانة البيانات (الإشراف على البيانات)» |
| `futureSkills.ts:310` | «الدعم المباشر المسكربت» | «الدعم المباشر بالردود المُعدّة مسبقًا» |
| `careers.ts:759` | «وسادة التعزيز ضئيلة» | «هامش التعزيز ضئيل» |
| `govEntities.ts` `topConsulting` (197 of 211 strings) | «و4 خدمة أخرى»، «و1 خدمة أخرى»، «و2 خدمة أخرى» | «و4 خدمات أخرى»، «وخدمة أخرى»، «وخدمتان أخريان» (generate with `Intl.PluralRules('ar')`) |
| `govEntities.ts:8467` | «أ SRMG Academy» (stray letter); 18 Latin-only `nameAr` values | Official Arabic names |
| `skillRecords.ts` (agile:0) | «بأدوار وطقوس واضحة» | «بأدوار واجتماعات دورية واضحة» («طقوس» carries a religious connotation) |
| `levels.ts:51` | Stage «نامٍ» | Risky: without diacritics it reads «نام» (slept). Use «متنامٍ» or «في طور النمو» |
| `guidance.ts:106` | «…تتطلب شهادات معتمدة، وانتهى» | Delete «وانتهى» (colloquial) |
| `guidance.ts:130` | «ثم اركبوا المهارات فوقه» | «ثم أضيفوا إليه المهارات تباعًا» |

The tanween spelling is mixed. `learning.ts` has 48 «ـاً» and 17 «ـًا»; `technologies.ts` has 36 «ـاً» and 1 «ـًا»; the rest of the codebase uses «ـًا» (830). Standardise on «ـًا».

### F6. Tone and framing problems for a government audience
- **Disparaging the public sector:** `guidance.ts:122` and `careers.ts:1412` (quoted in B4). Also `careers.ts` government_admin «الدور الحكومي الباقي هو…» implies the rest are leftovers.
- **Sensationalist labels:**
  - «يندثر» (`careers.ts:44`) and «مهنة مندثرة» (`Decide.tsx:233`).
  - The navigation label «ما يزدهر وما يندثر» (`Header.tsx:25`).
  - Elsewhere the product uses «متراجع» (`futureSkills.ts:15`). Use «متراجع» everywhere.
- **Puffery:**
  - «ثم أهم مقال ستقرؤه هذه السنة» (`Lists.tsx:26`).
  - «النمو في كل مكان لمن يقرأ الخريطة» (`Explore.tsx:73`).
  - «اقتنعت؟ ابدأ اختبار التوجيه» (`Lists.tsx:161`).
  - «و10 مهام تتراجع بصدق» (`Home.tsx:248`).
  - «بأدلة موثقة لا بانطباعات» (`Home.tsx:72`) for what is a self-report tool.
- **Sensitive scenario framing:**
  - `scenarios.ts:1222-1245`: a ministry gets media credit for an entity's programme, and the zero-score option's rationale calls it «سرقة الفضل». Re-set the scenario inside one entity, for example a director taking credit.
  - «انتحار تشغيلي» (`scenarios.ts:836`) is unacceptable language.
- **Corporate titles instead of government ones:**
  - «نائب الرئيس غير التقني» (`scenarios.ts:490`) → «وكيل الجهة» or «المسؤول التنفيذي غير التقني».
  - «نائب الرئيس للموارد البشرية» (`futureSkills.ts:379`) → «مدير عام الموارد البشرية أو وكيل الجهة للموارد البشرية».
- **Gender framing:**
  - Parent copy addresses only sons: «ابني» (`Careers.tsx:273`) and «ابنك» (`Decide.tsx:82-84`). Use «ابنك أو ابنتك».
  - The women's notes lean on stereotypes: «ميزة واقعية لمن يوازن مسؤوليات عديدة» (`careers.ts:2578`) and «المحتوى … الموجه للمستهلكات» (`careers.ts:2582`). Rewrite around data on sector opening, or remove.
- **Developer jargon on the public methodology page:**
  - «v7», «sectors.xlsx», «scripts/», «lazy», «base النشر», «SVG» (`Methodology.tsx:58`, `Methodology.tsx:115`, `Methodology.tsx:133-134`).
  - The public admission «كان الخيار الثاني صحيحًا في 30/40» (`Methodology.tsx:115`).
  - 8 versions, all dated «أكتوبر 2026».
  - Move the changelog to the repository and keep a 5-line «سجل الإصدارات» for users.
- **Disclaimer mismatch:** «ولا بديلًا عن … شروط القبول الرسمية» (`Disclaimer.tsx:20`) is shown on the employee assessment, but admission conditions are a student concept.

### F7. Terminology: one concept, several names

| Concept | Variants found (count or location) | Canonical proposal |
|---|---|---|
| Data literacy | «الإلمام بالبيانات» (`domains.ts:14`, 3), «محو أمية البيانات» (8: `skillRecords.ts` prerequisites, `careers.ts` skillVocab, `futureSkills.ts`), «الثقافة البيانية» (2, Standards) | «الإلمام بالبيانات». Avoid «محو أمية» for public servants |
| Data steward | «أمين البيانات» (`learning.ts` policy_gov_q1), «وكالة البيانات» (`futureSkills.ts:175`) | «أمين البيانات» |
| Agile | «الرشيقة/الرشيق/الرشاقة» (14), «آجايل» (`futureSkills.ts` agile), «أجايل» (`skillRecords.ts` domainEvidence) | «الرشيقة (Agile)», with the English given once |
| Blockchain | «سلسلة الكتل» (6), «البلوك تشين» (3), «بلوكتشين» (1) | «سلسلة الكتل» |
| Agentic AI | «الذكاء الاصطناعي الوكيل» (4), «الذكاء الوكيل» (2), «الوكلاء الأذكياء» (6) | «وكلاء الذكاء الاصطناعي» |
| GenAI | «الذكاء الاصطناعي التوليدي» (20), «الذكاء التوليدي» (6) | The full form |
| Beneficiary | «بحث المستفيدين» (`domains.ts:60`) vs «بحث المستخدمين» (`domains.ts:65`) on the same card | «المستفيد» for citizens; «المستخدم» only for UX method names |
| Accessibility | «إمكانية الوصول» (9), «الإتاحة» (4), «ميسّر الوصول» (1) | One term, aligned with DGA's published standard (verify the official term) |
| Digital access vs Nafath | «توسيع النفاذ الرقمي» right above «نفاذ، توكلنا» (`futureSkills.ts` cloud evidence) | «توسيع الوصول الرقمي» |
| Domain short name | «الذكاء والبيانات» (`domains.ts:7`, Standards) is ambiguous: «الذكاء» alone ≠ AI | «الذكاء الاصطناعي والبيانات» |
| Policy domain | Arabic «السياسات والحوكمة الرقمية» vs English "Digital Policy, Strategy & Governance" (`domains.ts:74`) | Add «والاستراتيجية» to the Arabic, or drop "Strategy" from the English |
| Agile domain | «إدارة المنتجات الرقمية الرشيقة» vs "Agile Product & Delivery" vs skillVocab «التسليم الرشيق» | «المنتجات والتسليم الرشيق» |
| Scale tiers | Levels «وعي/تطبيق/ممارس/خبير» and stages «تأسيسي/نامٍ/متمكّن/رائد» on identical thresholds (`Methodology.tsx:30`); track «توعوي» vs level «وعي»; English "Awareness" for both (`tracks.ts:30`, `levels.ts:6`) | One 4-tier vocabulary, and rename the track to «عام للجميع» |
| Declining | «يندثر» (`careers.ts:44`, `Header.tsx:25`) vs «متراجع» (`futureSkills.ts:15`) | «متراجع» |
| Horizon | «الآن / قريبًا / بعيد المدى» (`technologies.ts:50-63`) | «الآن / قريب المدى / بعيد المدى» |
| Career explorer page | «اكتشف التخصصات» (`Header.tsx:48`), «كيف تتطور الأدوار والمهام؟» (`Careers.tsx:83`, `Home.tsx:51`), «كل المهن الخمسين» (`Results.tsx:560`) | One name, or remove (D) |
| «دليل الجهات» | Directory (`Header.tsx:24`, `Directory.tsx:64`) **and** the playbook CTA (`Home.tsx:46`) | «دليل الجهات» for the directory; «دليل تبنّي المنصة» for the playbook |
| Target polygon | «المضلع البنفسجي» (`Wizard.tsx:134`, `Roles.tsx:30`), but the target is drawn amber `#DBA102` (`RadarChart.tsx:223`) | «المضلع الكهرماني (المستهدف)» |
| Sector name | «الإمارات والمناطق» (`govSectors.ts:34`) reads as the UAE | «إمارات المناطق» |

### F8. The owner's own programs and the national training rails
- **The owner's flagship programme is misnamed:**
  - «برنامج قدراتك (قدرات-تقنية) …» with English "QTech (Qudrat-Tech) Digital Skills Program" (`learning.ts:237`, linked to `my.gov.sa/en/content/179`).
  - «برنامج قدراتك» with English "Qudratok Program" (`pathways.ts:20`, linked to `dga.gov.sa`).
  - The owner's standard is «برنامج قدراتك» (QTECH), umbrella «منصة القدرات الرقمية». «قدرات-تقنية» is invented.
- **The consulting team is invisible:** «منصة الاستشارات والدراسات» (ADVICEDGA) is never mentioned, although the whole data layer is consulting records.
- **The playbook may name a non-existent body:** it routes gaps to «أكاديمية الحكومة الرقمية» (`futureSkills.ts:398`) but not to «برنامج قدراتك». Verify that the academy exists or remove it.
- **The main government trainer is missing:** «معهد الإدارة العامة» is absent from the learning rails and appears only as a directory entry (`govEntities.ts:6261`).
- **The rails shown inside a civil servant's plan are mostly wrong for civil servants** (`learning.ts:1146-1181`):
  - «تمهير» is for fresh graduates.
  - «جدارات … للترشح والمفاضلة» is a selection platform.
  - «قد تعوَّض رسومها عبر دعم هدف» appears on *every* certification (`Pathways.tsx:189`), but HRDF support targets the private sector.

### F9. Bilingual completeness and leakage
- **English leaking into Arabic:**
  - `LearningResource.provider` is an English-only string (`learning.ts:14`), rendered in the Arabic UI (`Pathways.tsx:183`): "Amazon Web Services", "SDAIA Academy (Saudi Data and AI Authority)", "Digital Government Authority (DGA), Saudi Arabia".
  - Community rationales are English-first (`guidance.ts:374` and following).
  - 18 Latin `nameAr` values in `govEntities.ts`.
- **Arabic in English mode:**
  - 359 of 682 entities have `nameEn: null`.
  - Sectors (`govSectors.ts:12` `name: string`), consulting categories, strategic pillars, regions, entity types and scopes, and `topConsulting` are Arabic-only.
  - Arabic will show in the English UI, or nothing will.
- **Arabic and English say different things:**
  - `levels.ts:8`: the Arabic adds «بثقة».
  - `levels.ts:114`: «بسهولة» vs "confidently".
  - `domains.ts:74`.
  - The cyber evidence (F3 #20).
  - `statements.ts:232`: «تقييم جدوى أتمتة» vs "assess the case for automating".

### F10. Psychometric honesty of the item content
1. **Option-length and dependency cues** (B6). A user who always picks the longest, "do that and more" option scores about 2.9 of 3 on judgment in every domain.
2. **Construct misalignment:** 3 of the 5 AI and data calibration items test ML engineering (`learning.ts:557-598`, `learning.ts:908`: supervised learning, data leakage, train/test split). The domain and its statements measure literacy, governance and responsible GenAI use (`statements.ts:16-45`).
3. **Statement-to-skill misfit:**
   - `emg-1` (`statements.ts:232`) measures generic process automation, not «الذكاء الاصطناعي الوكيل».
   - `cld-5` measures continuity while the skill is «المرونة وإدارة الموردين».
   - `agl-2` «أستطيع قيادة منتج رقمي» is still gated on role, despite the header claim (`statements.ts:5-8`).
4. **Response scale:** the 0 anchor «لا أعرف ما هذا» (`levels.ts:102`) is a knowledge anchor on an ability scale. Someone who knows the concept but cannot yet do it has no honest option. Use «لا أستطيع ذلك بعد».
5. **Tautological headline:** «مهمتك القابلة للتحسين … مهام «الذكاء الاصطناعي والبيانات»، والمهارة الأهم لها هي «الذكاء والبيانات»» (`Results.tsx:227`). The "most important skill" is the domain's short name. Use the weakest *skill record* in that domain.
6. **Results that push employees out:** the results page recommends careers «تليق بنقاط قوتك … وتزدهر في سوق الغد» (`Results.tsx:549-554`). On a government development tool, this nudges employees toward exits; it reads like a careers fair.

### F11. Learning resources
- **Vendor-heavy for a government platform:** AWS appears 4 times, Google 5, Microsoft 2 (11 of 48 resources are vendor credentials or vendor courses). Balance with vendor-neutral and Saudi public options.
- **Out of line with the domain definitions:**
  - AI and data: levels 2→3 and 3→4 are the ML Specialization, Deep Learning and GCP Professional Data Engineer (`learning.ts:46-74`), an engineering track for a literacy and governance domain.
  - Cyber: level 3→4 is SANS SEC504 «تقنيات الاختراق والاستغلال» (`learning.ts:119`).
  - Emerging tech: IoT embedded systems, blockchain, IBM Quantum, ARCore and MIT xPRO quantum (`learning.ts:330-363`). Nothing covers 4 of the domain's 5 skills: agentic AI, geospatial and digital twins, technology scouting, and IoT for smart cities (`domains.ts:116-120`).
  - Policy: level 1→2 is the OECD.AI observatory (`learning.ts:230`), which is a reference site, not a course.
- **The plan wording implies credentialing:** «سجّل مستوى الخبير في الرادار» (`learning.ts` week 13 lines). Use «حدّث تقييمك الذاتي».

### F12. What is good and should be kept
- **Western digits throughout:** 0 Eastern digits in `src/`. Add a CI guard to keep it that way.
- **An honest methodology page.** Editorial thresholds and unvalidated scenarios are declared (`Methodology.tsx:30`, `Methodology.tsx:44`, `Methodology.tsx:124`). This is rare and valuable; keep it, minus the jargon.
- **Realistic, Saudi-grounded scenarios** (Nafath, PDPL, data residency, Arabic dialect testing of chatbots). This is the best content asset once item writing is fixed.
- **A clear usage boundary** «النتائج للتخطيط التطويري فقط» (`futureSkills.ts:410`). Make it consistent everywhere.
- **The labelling rules** «ISCO تقريبي» and «مؤشر نوعي — ليس قياسًا كميًا» (`Careers.tsx:259-261`, `Careers.tsx:352`).

---

## G. Rebuild plan: a 1–2 day push by AI coding agents (12 packets)

| # | Packet | Scope | Acceptance criteria (reviewer-verifiable) | Depends on | Parallel? |
|---|---|---|---|---|---|
| G1 | **Owner gate: public data decision** | Decision memo only. Data owner: publish (a) national aggregates, (b) sector aggregates, (c) nothing per entity, (d) no logos | A signed decision recorded in `docs/DATA-DECISION.md`. Until it is signed, G3 runs in "aggregates only" mode | Owner | No (gate) |
| G2 | **Fact registry + evidence register page** | New `src/data/facts.json` (id, value, unit, scope, asOf, source, url, type, confidence, reviewBy, usedIn); page «سجل الأدلة» | `grep -E "[0-9]+%" src/views` finds no hard-coded percentages outside the registry. Every fact has source, url, asOf and confidence. The register lists all facts, and stale facts show «يحتاج تحديثًا» | — | Yes |
| G3 | **Government data layer de-risk** | `govEntities.ts`, `govEntityDetails.ts`, `Directory`, `EntityDetail`, `Impact`, `GovSectors`, `public/logos/` | 0 logos shipped. 0 per-entity utilisation strings. No top-10 table. Sector cells with fewer than 5 entities are suppressed. Labels read «جهة مستفيدة (منها 370 حكومية وشبه حكومية)». «إجمالي الاستفادة» is removed. A reconciliation note links the QTECH register (2026-10-18) | G1 | After G1 |
| G4 | **Arabic copy-edit + plurals** | All `ar:` strings and generated strings | Every row of F5 is fixed. `topConsulting` is generated with `Intl.PluralRules('ar')`. A lint test fails on «قيّس», «العدو», «خدمة أخرى» after 3–10, «يتعاشرا» and «انتحار». A native editor signs off on a 10% sample | G7 (glossary) | Yes |
| G5 | **Item bank repair** | `scenarios.ts`, `learning.ts` calibration, `levels.ts` scale | A script reports: best option is the longest in no more than 30% of items; 0 options start with «أفعل ذلك/نفعل ذلك/أسأل ذلك/أضيف لذلك»; true/false keyed false in 40–60%; fixed «صحيح/خطأ» order; correct MCQ option is the longest in no more than 30%; at least 2 scenarios per domain per track before the inflation flag fires; an unmeasured layer renders «لم يُقَس»; the scale 0 anchor reads «لا أستطيع ذلك بعد» | — | Yes |
| G6 | **Positioning and tone edit** | `guidance.ts`, `careers.ts` verdicts, `Header`, `Footer`, `index.html`, `Disclaimer`, `Lists`, `Decide`, `Results` career block | The disparaging lines in F6 are deleted. «كتابة العدل» is gone. «يندثر» is replaced by «متراجع». The navigation matches D. The meta and footer state government-workforce positioning. Youth tools are moved out of the main navigation (or removed). Parent copy says «ابنك أو ابنتك» | — | Yes |
| G7 | **Glossary + naming** | `docs/GLOSSARY.md` + `src/i18n/glossary.ts`, applied across files | Each F7 concept has one Arabic and one English term. A CI test greps the banned variants. The owner's programme names follow his standard («برنامج قدراتك», «منصة الاستشارات والدراسات», «منصة القدرات الرقمية»). The tech radar is renamed | — | Yes (first, it unblocks G4) |
| G8 | **Fact refresh + counts from data** | `standards.ts`, `guidance.ts`, `careers.ts`, `roleLibrary.ts`, views with counts | SFIA 9 = 147. Labour figures are the latest GASTAT quarter with a link. Women's participation is current. `SLEN` is resolved. The Tuwaiq body name is current. UN E-Gov is checked. Every count in copy is derived from `array.length`; a test proves that 50, 24 and 40 match the data | G2 | Yes |
| G9 | **Playbook ethics alignment** | `futureSkills.ts` playbook + KPIs; `learning.ts` national rails; `Pathways.tsx` Hadaf note | No HR-file linkage. No «مستويات الاستحقاق». KPIs are opt-in and aggregate. Jadarat and Tamheer are not shown in employee plans. The Hadaf note is limited to eligible users. IPA and «برنامج قدراتك» are added as rails | — | Yes |
| G10 | **Learning resources re-curation** | `learning.ts` resources (48) | Each domain transition maps to that domain's 5 skills (documented). At least 1 Saudi public or vendor-neutral option per transition. `provider` is bilingual. Link check passes 48 of 48 | G7 | Yes |
| G11 | **Routing, i18n extraction, code-split** | `App.tsx`, `store.tsx`, `views/*`, `locales/*` | Every view has a URL and per-route title/OG. Back button works. `/en/` prefix. Initial JS ≤ 200 KB gzipped. Large data is lazy-loaded. Charts have table alternatives (axe has 0 serious issues) | — | Yes (separate owner of files; merge last) |
| G12 | **Content QA automation + independent sign-off** | `tests/content/*.test.ts`, CI workflow | CI runs the digit guard, glossary lint, plural lint, count consistency, answer-key balance, fact completeness, link check and axe. A final reviewer (not the implementer) re-runs F5–F7 and confirms them closed with screenshots | G2–G11 | No (last) |

---

## H. What NOT to do

1. **Do not publish anything per entity until the data owner signs off.** That covers names with usage counts, «ما الذي تحتاجه جهتك؟», rankings, «لم تستفد» labels, logos, and Royal Court or security bodies at all. "It's only a concept" is not a defence on a personal domain.
2. **Do not name pages after official DGA products or reuse DGA marks.** That includes «رادار التقنيات الحكومية» and DGA's own logo, which is currently shipped as `ent-0179.png`. "Inspired by" must stay visibly *not* official.
3. **Do not add more careers, technologies or roles.** Prior reviewers said this and it is still true: depth and correctness first.
4. **Do not add a backend that stores individual results, and do not integrate with HR systems.** That would break the product's core promise and turn a reflection tool into an evaluation tool (PDPL, plus trust).
5. **Do not call editorial weightings "computed, not assumed"** or self-report "documented evidence". Badge them as editorial.
6. **Do not let an LLM generate more scenario items or Arabic copy without a native editor and a psychometric checklist.** The current cues are the classic patterns LLM-written items produce: "do that and more", absolute true/false statements, and the correct option being the longest.
7. **Do not "fix" stale numbers by swapping in other unsourced numbers.** Every replacement goes through the fact registry with a date and a link.
8. **Do not quote peaks as current values** (36.3%, "record 6.3%"). Show the latest value and, if useful, the trend.
9. **Do not keep the developer changelog on the public methodology page,** and do not advertise past defects («الخيار الثاني صحيحًا في 30/40») to a ministerial audience.
10. **Do not add gender-specific career advice** that relies on stereotypes. If women's data is shown, it must be sector-opening data from GASTAT with dates.
11. **Do not use percentages for automation exposure or "readiness for a career".** The digital radar does not measure readiness for licensed professions.
12. **Do not show these figures next to «برنامج قدراتك» numbers without reconciling them first.** The owner's credibility is the product.
