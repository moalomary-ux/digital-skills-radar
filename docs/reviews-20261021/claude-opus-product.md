# Product review — Digital Skills Radar (رادار المهارات الرقمية) v8

Reviewer: Claude Opus 5.5 · lens: product concept, user journey, information architecture, persona value · 2026-10-21

**Evidence basis.** Read: `App.tsx`, `store.tsx`, all 19 views (full read of Wizard, Results, Home, Entities, EntityDetail, Pathways; headings and strings of the rest), `Header`, `Footer`, `Disclaimer`, `RadarChart`, `EntityLogo`, and the data files `domains`, `tracks`, `roles`, `roleLibrary`, `levels`, `scenarios`, `sectorSkills`, `govEntities`, `futureSkills`, `learning`, `guidance`, `technologies`, `careers`; `HANDOVER-v8.md`; `00-SYNTHESIS.md`. I also drove the **live v8 demo with Playwright on 2026-10-21** on a fresh profile at 1440 px and 390 px. Note on the screenshots in the brief: they are dated 2026-10-18 17:39–17:50 and show the **v5** product (old hero «أين أنت على خريطة المهارات الرقمية؟», old flat nav, and the date 18 October 2026 rendered in Eastern Arabic-Indic digits in `20-results-filled-desktop.png`). They are useful history but not a picture of v8, so I captured v8 myself (paths at the end).

---

## A. Verdict

| Dimension | Score | One sentence |
|---|---|---|
| Product concept | **5/10** | The organizing question is excellent and the evidence culture is rare, but v8 is three products stapled together (an employee self-check, a student career guide, and a showcase of DGA's internal service records), and it gives an executive, a CIO or an HR director nothing to act on for *their* organization. |
| User journey | **3/10** | The one journey the product is built around cannot be completed on the live site today (blank screen after the 40th statement), and when results exist they give three different answers to "what should I work on first?". |
| Visual / brand | **7/10** | A calm, credible DGA-family look with good Arabic typography and colour restraint, let down by an overloaded header that wraps, a 16-item mobile scroller, text-wall pages, and a home page whose largest section is unbuilt roadmap. |
| Engineering | **4/10** | Clean typed data and hand-built bilingual SVG, but no URLs and no back button, one 1.63 MB JS file (416 KB gzip), motion that hides content in print, and no end-to-end test. That is how a JSX nesting bug that blocks every user got shipped. |
| Content / evidence | **6/10** | Global claims are sourced with unusual honesty. The government data layer is the weakest and most dangerous content: private firms, clubs and abolished ministries counted as "government entities", totals that disagree with the owner's own verified platforms, and inferred "needs" printed against named entities. |

**Overall: 5/10 today. 8.5/10 is reachable in one focused push**, because the hard assets already exist: the scenario bank, role targets, sourced trajectories and a bilingual data model. The push is mostly removal, plus one bug fix, one priority engine, URLs and an organizational layer.

---

## B. Top 10 weaknesses (ranked by impact on a senior government audience)

### B1. The core assessment cannot be finished on the live site — effort S
- **Why it matters:** "try it" is the first thing every persona does. After answering all 40 statements and pressing «مرحلة مواقف الحكم المهني», the page shows only «موقف حكم 1 من 8 · 100%» and the role line. There is no scenario, no button, and no way back except «إعادة البدء من الصفر». **Nobody can reach Results or the 90-day plan.** A Deputy Minister who tries it once will not try it again.
- **Evidence:** `src/views/Wizard.tsx:343`. The scenario stage `{step >= SCENARIO_BASE && scenario && (…)}` sits inside the calibration `<AnimatePresence>` (`:289`), which sits inside the domain branch `{step >= 1 && domain && (…)}` (`:216`). Because `domain` is `null` for step ≥ 9 (`:52`), the branch never renders. I reproduced this live on 2026-10-21 with Playwright (fresh profile, track «أساسي تطبيقي», role «موظف حكومي عام»); see `live-wizard-step9.png`.
- **Fix sketch:** move the scenario block up so it is a sibling under the top-level `AnimatePresence` (`:121`). Add a Playwright test, run in CI before every deploy, that goes from a fresh profile through 40 statements and 8 scenarios to Results and the plan, in both Arabic and English.
- **Effort:** S (minutes for the fix; a few hours for the test harness).

### B2. Results give three contradictory answers to "what first?" — effort S/M
- **Why it matters:** the promise is "measure → gap → plan". When the page disagrees with itself, a senior reader stops trusting every number on it.
- **Evidence (live, sample profile generalist/applied):**
  - The headline «خلاصتك العملية» says **Cloud**. It uses the rule `target − max(self, scenario)` (`Results.tsx:160–172`).
  - The gap list «بماذا تحتاج أن تركز؟» ranks **Emerging Tech** first. It uses self-report only (`:54–62`).
  - Panel «د · أولويتي التطويرية» labels the same Emerging Tech «على المسار», because of a 0.75 threshold (`:146–157`).
  - The plan page uses self-report only (`Pathways.tsx:52–62`), so it ignores the judgment layer and the «تحقق من التضخيم» flag.
  - The headline sentence is also circular: «مهمتك… مهام «السحابة والبنية التحتية الرقمية»، والمهارة الأهم لها هي «السحابة والبنية»» (`:227`). Its first step for a *generalist* employee is «صنّف ثلاث خدمات… حسب نموذج الخدمة السحابية (IaaS/PaaS/SaaS)».
- **Fix sketch:** write one `priorities()` function. Inputs: self-score, scenario score, calibration agreement, target. Output: at most 3 ranked priorities, each with a reason code. Headline, list, panel, plan, print and team aggregation all read from it. Delete the parallel gap list. Write the headline from the reason code, for example "your self-estimate is above your scenario judgment in X" or "both are below target in Y".

### B3. Nothing for the three organizational personas — effort M/L
- **Why it matters:** Deputy Ministers, CIOs and HR directors make decisions about *units*, not about themselves. The organizing question («ما القدرات التي يحتاجها الموظف والقيادي، وكيف نطوّرها؟») is answered only for the individual.
- **Evidence:**
  - The executive entrance (`Home.tsx:41–47`) lands on «للجهات الحكومية» (`Entities.tsx`). That page is a governance text about *adopting this tool*, and its call to action is «جرّب المنصة كموظف أولًا» (`:149`).
  - Its KPI «نضج المجالات — متوسط مستوى الجهة» (`futureSkills.ts:421`) cannot be computed anywhere in the product.
  - The "Manager" entrance goes to a page of global trajectories (`Home.tsx:35–39`).
  - The only organization-level data shown is DGA's own service volume. It describes DGA's activity, not the visitor's workforce.
- **Fix sketch:** proposals C1 (Team Radar), C2 (leader brief and judgment check) and C4 (unit capability planner).

### B4. Internal records for named entities, and 485 official logos, on a personal domain — effort S
- **Why it matters:** this item could hurt the owner personally. On omary.me a visitor can open any agency and see:
  - how many DGA trainings and consultations it received, and what it asked for, verbatim;
  - the line «لم تستفد هذه الجهة…»;
  - a computed «ما الذي تحتاجه جهتك؟»;
  - and a public ranking, «أعلى 10 جهات استفادة».

  An agency head who finds their agency ranked, labelled or "diagnosed" on a DGA General Manager's personal site will not read it as a concept demo. It also breaks the brief's "no official logos" rule: the DGA's own logo ships as `public/logos/ent-0179.png` (`govEntities.ts:3888–3897`), next to 484 other entities' trademarks.
- **Evidence:**
  - `EntityDetail.tsx:84–135` shows the service records and the verbatim `topConsulting` text.
  - `:139–141` shows the "has not benefited" message, and `:146–153` the needs section ending «…وليس افتراضًا».
  - `Impact.tsx:106` and `:254` hold the top-10 ranking.
  - `GovSectors.tsx:128` and `:258` present «تغطية الشعارات» (logo coverage) as a sector KPI.
  - The 2026-10-18 committee listed «مقارنة جهات» among uses to avoid (`00-SYNTHESIS` §6, item 2). v7–v8 added it anyway.
- **Fix sketch:**
  - The public build ships aggregates only: national figures, plus sector figures where the sector has at least 10 entities. No entity pages, no rankings, no logos (use a monogram or nothing).
  - If the owner wants the full layer for private demos, keep it behind a build flag.
  - The owner confirms which aggregates may be published.

### B5. "682 government entities / 31 government sectors" is not true, and the totals disagree with the owner's own platforms — effort S/M
- **Why it matters:** the audience *is* government. They know which bodies exist, and one wrong name discredits the whole dashboard.
- **Evidence:**
  - **Not government:** 27 entities sit in the sector «القطاع الخاص», for example «التميمي للمحاماة», «Al Habardi Law», «bmb group» and «شركة سرار». There are also 79 «الشركات المملوكة للدولة والصناديق السيادية», 66 «الرياضة» entries including football clubs («نادي الأهلي», «نادي الاتحاد»…), and 6 international organizations.
  - **Abolished or duplicated:** three housing ministries appear side by side: «وزارة الإسكان» (`govEntities.ts:1381`), «وزارة الشؤون البلدية والقروية والإسكان» (`:1396`) and «وزارة البلديات والإسكان» (`:829`). «الهيئة العامة للرياضة (سابقة)» is also listed (`:9719`).
  - **Labels:** the Directory and Impact pages still say «682 جهة حكومية وشبه حكومية», and GovSectors says «31 قطاعًا حكوميًا».
  - **Totals:** the radar shows **7,915** training records, **2,873** consulting services and **421** entities. The owner's own platforms were refreshed on 2026-10-18 and verified entity by entity at **7,891 training / 2,918 consulting**. ADVICEDGA also hides non-government entities by design and shows 320 government entities. Three different "official" figures from the same owner is a credibility trap.
- **Fix sketch:**
  - Use one reconciled source: the verified registers from 10-18.
  - Keep government entities only (the same rule ADVICEDGA uses), merge duplicates, and remove abolished entities.
  - Every number carries its date and source.

### B6. Half the product is a career guide for students and families — effort M
- **Why it matters:** mixed positioning is the first thing a senior visitor notices, and it produces absurd outputs.
- **Evidence:**
  - **Navigation:** the top nav includes «اكتشف التخصصات», «الخريطة التفاعلية» and «اختبار التوجيه» (`Header.tsx:47–49`).
  - **Home:** there is a whole section «للأفراد والطلاب» (`Home.tsx:258–291`).
  - **Career data:** only 1 of the 50 careers is a government role. The list includes commercial pilot (`careers.ts:1554`), delivery driver (`:1214`) and door-to-door sales (`:1044`), plus Qudurat/Tahsili admission notes (`:2491` onward).
  - **Self-description:** the meta description says «…وإرشاد مهني» (`index.html:6`), and the footer tagline says «منصة إرشاد مهني ومهاري» (`Footer.tsx:58`).
  - **Results:** a government generalist is advised to consider «الطب العام», «التمريض» and «معلم التعليم العام» under «مهن تليق بنقاط قوتك» (`Results.tsx:79–99`, `:539` onward).
  - **Ignored committee advice:** «قيّس جاهزيتك لهذه المهنة» is still shown on licensed careers (`Careers.tsx:428`), despite the committee's "do not" item 8.
- **Fix sketch:**
  - Remove the citizen lane from the omary.me v9 build and keep it on an archive branch.
  - Replace it with the government work-shift map (C6).
  - Remove careers from Results.

### B7. No URLs: no deep links, no back button, nothing to share — effort M
- **Why it matters:** senior audiences share by WhatsApp and email ("look at this brief"). Today every page is the same address:
  - Back leaves the site.
  - A refresh on any page returns to Home.
  - There is no per-page title and no link preview.
- **Evidence:** `store.tsx:101` (`useState<View>('home')`); `App.tsx:40–58` (conditional render); a single `<title>` and no OG tags in `index.html`.
- **Fix sketch:** see E1 (a router, prerendered routes, the language in the path, and result/team codes in the URL hash).

### B8. Too many navigation items, badly grouped — effort S/M
- **Why it matters:** 19 destinations with no hierarchy says "prototype".
- **Evidence:**
  - **Desktop:** 6–8 top items, plus 10 more under «أدوات متخصصة / Pro tools» (`Header.tsx:20–31, :38–50`), where data pages and reference pages are called "tools". The header wraps to two lines at 1425 px (`live-results.png`).
  - **Mobile:** all 16 items sit in one horizontal scroller (`Header.tsx:125–137`; I counted 16 live).
  - **Footer:** «للجهات الحكومية», «أثر تمكين الجهات», «القطاعات», «دليل الجهات» and «رادار التقنيات» are filed under «التوجيه المهني» (`Footer.tsx:23–33`).
  - **Name clash:** «دليل الجهات» means the adoption playbook on Home (`Home.tsx:46`) and the 682-entity directory in the menu (`Header.tsx:24`).
  - **Accessibility:** the dropdown opens on hover/focus only and has no `aria-expanded` (`:87–110`).
  - **Ignored committee advice:** item P1-12 ("5 items") was not applied.
- **Fix sketch:** section D below (5 hubs).

### B9. The home page sells a roadmap and global statistics, not the product — effort S
- **Why it matters:** the first 10 seconds decide credibility.
- **Evidence:**
  - **Roadmap first:** the largest section on Home is five community features, each tagged «خارطة طريق — غير منفذة بعد» (`Home.tsx:293–324, :315`).
  - **Global, not government:** "how is government work changing?" is answered with global WEF job counts written «170M / 92M / +78M», with a Latin "M" in the Arabic UI (`guidance.ts:10–15`, `Home.tsx:191–208`). Nothing is about government work.
  - **Fake sample:** the hero radar is a made-up sample.
  - **Scattered entrances:** the four entrances lead to four unrelated pages.
- **Fix sketch:**
  - Home becomes a one-line promise, a persona router (employee / leader / team / HR), a strip on the "5 shifts in government work", and previews of the real outputs (a sample A4 plan and a sample team brief).
  - The roadmap moves to «عن المفهوم».

### B10. Results look like a test score, and the "development only" guard is missing where it matters — effort S
- **Why it matters:** the brief's hard rule is "never for selection or promotion", and the UI invites exactly that.
- **Evidence:**
  - **A score to copy:** a 5xl gradient «مرحلتك العامة: نامٍ» with a one-decimal average (`Results.tsx:279–302`) is exactly what a manager would paste into an appraisal.
  - **Wrong audience:** the results disclaimer speaks to students: «ولا بديلًا عن الموجه المهني أو عن شروط القبول الرسمية» (`Disclaimer.tsx:20`).
  - **Guard in the wrong place:** the ban on use for selection appears only on the Methodology page (`Methodology.tsx:30`).
  - **HR-file advice:** the adoption playbook recommends «اربط نتائج التقييم بملف الموظف في نظام الموارد البشرية» (`futureSkills.ts:399`).
  - **Job platform in the plan:** the plan points to «منصة جدارات», the government job-application platform (`learning.ts:1175–1182`).
- **Fix sketch:**
  - Remove the overall stage; show 3 priorities and the 8 domain levels instead.
  - Put «للتطوير الذاتي فقط — لا يُستخدم في التقييم الوظيفي أو الترقية أو المفاضلة» on screen and in print.
  - Delete the HR-file recommendation and remove Jadarat from the plan.

**Close calls outside the top 10:**
- The 8-domain model is a digital-specialist taxonomy (see C5).
- Print/PDF prints blank cards: below-the-fold `whileInView` cards stay at `opacity: 0` in print media (verified live).
- One 4-step scale has three overlapping vocabularies (F6).

---

## C. Idea evolution — proposals that make this a materially stronger product

### C0. The strategic move
Rebuild the product around **one clear deliverable per persona**, all produced in the browser and all printable:

| Persona | "Useful to me today" means… | Delivered by |
|---|---|---|
| Deputy Minister / agency head | "In 10 minutes I know the 5 shifts in government work, the 3 decisions I own this year, and how mature my own judgment is — on one page I can bring to my leadership meeting." | C2, then C1 through HR |
| CIO / CDO | "I can model the capability profile my digital unit needs, see my team's real (self-reported) gap without collecting data, and decide whether to build, hire or borrow." | C4 + C1 |
| HR director / L&D | "I get a training-needs analysis per department in a week, with no new system, no personal-data processing, and a before/after view for a programme." | C1 + C7 + C8 |
| Mid-level employee | "In 15 minutes I get 3 priorities and a 90-day plan I can take to my manager — plus the GenAI-at-work skills I need this month." | C3 + C5 |

**The best asset nobody is using:** 40 scenario items with graded options and rationales (`scenarios.ts`, 8 per track). Today they are a hidden test stage, and currently unreachable (B1). They are the best learning content in the product and the natural basis for leader checks and workshops.

### C1. «رادار الفريق» — Team Radar built from anonymous result codes — **MUST**
- **What it is:**
  - **The code:** every finished assessment produces a short **رمز النتيجة** (about 16 base32 characters, plus a QR code). It encodes the schema version, the role *family* (not the exact role), the track, the 8 self-scores rounded to 0.5, the 8 scenario scores (0–3), 8 agreement flags, the month of assessment and a checksum.
  - **Sharing:** the employee *chooses* to give the code to their manager, by copying it, showing the QR, or entering it in an internal form the entity already uses.
  - **The view:** the manager opens «رادار الفريق» and pastes the codes or drops a CSV. Everything happens in the browser. The manager gets:
    1. per-domain distribution (dot strip or box plot, never a single average);
    2. coverage: the share of the team at or above its role target, per domain;
    3. **single points of failure**: domains where at most 1 person is at «إتقان» or above;
    4. team-level inflation risk (self-report above scenario judgment);
    5. the top 3 shared priorities, turned into a 13-week cohort learning plan, with a "build vs. hire or borrow" hint (links to C4);
    6. an A4 «ملخص احتياج الفريق» (a training-needs brief), and a before/after comparison when two sets of codes are loaded (before and after a programme).
- **Guardrails (non-negotiable):**
  - Nothing renders below **k = 5** codes.
  - The page never shows a row per person and never links a code to a person.
  - Duplicate codes are detected, and codes older than 6 months are flagged.
  - Screen banner and print footer: «للتخطيط التطويري فقط — ليس تقييمًا للأداء».
  - The adoption guide states that sharing a code is voluntary.
- **Who it serves:** HR directors, department heads and CIOs. Also the owner's own training team: they get a cohort baseline and before/after evidence for «برنامج قدراتك»-style programmes without any central data.
- **Why it beats what exists:** it turns an individual mirror into an organizational tool while keeping "no data collection" literally true, because the platform never receives anything. Nothing in v8 serves a manager with information about *their* people.
- **Data/content needed:** the code specification, aggregation rules, the k threshold and a brief template. No new assessment items.
- **Effort:** M.
- **Risks:**
  - Misuse as surveillance or ranking. Mitigated by k ≥ 5, score bands, no per-person rows and the wording.
  - Re-identification in very small teams. Mitigated by k and by coarse role families.
  - Self-report bias. Mitigated by showing the scenario layer next to it.

### C2. «الموجز القيادي» + «فحص القرار القيادي» — leader brief and leader judgment check — **MUST**
- **What it is:**
  - **(a) The brief:** one screen, one A4 page, on the **5 shifts in government work 2026–2030**. Example shifts: GenAI in daily casework, decisions based on data, services that are measured and published, cyber and privacy as a legal duty, product-based delivery. Each shift has:
    - what changes in the work (2 lines);
    - the capability it requires, linked to a domain;
    - «القرار المطلوب منك هذا العام» (1 line);
    - one sourced signal with a confidence badge;
    - «ما الذي لا يتغير».

    The brief ends with «10 أسئلة تطرحها على مدير التقنية ومدير الموارد البشرية».
  - **(b) The check:** a 6-minute standalone leader judgment check built from the 8 executive-track scenarios (`scenarios.ts`; for example the "three AI opportunities competing for one budget" item at `:1011`). One scenario per screen, graded options, the rationale after each answer, and an output of «3 قرارات تستحق وقتك». No self-rating scale and no headline score.
- **Who it serves:** Deputy Ministers, agency heads, General Managers, board members.
- **Why it beats what exists:** leaders will not answer 40 «أستطيع…» statements. They read briefs and test their judgment. Today's executive entrance is a manual for adopting the tool.
- **Data/content needed:**
  - Trajectories in `futureSkills.ts` and the executive scenarios already exist.
  - About one page of new content on the shifts. Sources: WEF Future of Jobs 2025, OECD Digital Government Policy Framework/DGI, UN E-Government Survey 2024, SDAIA's AI and GenAI guidance, NCA ECC. Verify the exact titles before publishing.
- **Effort:** S/M.
- **Risk:** it could read as DGA policy. Mark it «قراءة مستقلة — ليست موقفًا رسميًا» and date the content.

### C3. «خطتي» — a plan the employee can actually use — **MUST**
- **What it is:** results shrink to **3 priorities** from the single priority engine (B2), each with a plain-Arabic "why". Then:
  - **«ورقة حوار التطوير»:** a designed A4 print view, not `window.print()` of the screen. It holds the 3 priorities, the evidence layers, 3 behaviours per priority across 13 weeks, «ما أحتاجه من مديري» (time, a stretch task, shadowing) and two checkpoint dates.
  - **Calendar file:** an `.ics` file generated in the browser, with 13 weekly nudges and a day-90 re-check.
  - **Tracking and portability:** a checkbox per week (stored in localStorage), and a personal link `#r=<code>` that reopens the result on another device without a server.
  - **Day 90:** re-assessment shows the old and the new polygon; the existing `previous` support already handles this.
- **Who it serves:** mid-level employees and their direct managers.
- **Why it beats what exists:** behaviour changes through a conversation and a calendar, not a long page. Today's printout contains invisible cards (verified: below-the-fold cards print at opacity 0) and two sections unrelated to the plan (technologies and careers).
- **Data/content needed:** content exists (`pathways.ts`, `learning.ts`). New: the print template, the `.ics` writer, and the result code (shared with C1).
- **Effort:** S/M.
- **Risk:** low.

### C4. «مخطِّط قدرات الوحدة» — unit capability planner: role mix → required capability profile — **SHOULD** (MUST for the CIO story)
- **What it is:** the CIO builds the unit from the role library with head-counts (for example 1 CDO, 2 product managers, 3 data analysts, 1 security architect, 12 generalists) and ticks the entity's priorities. The planner returns:
  - **Required profile:** the unit's target radar, weighted by head-count.
  - **Critical capabilities:** domains where many roles need «إتقان» or above.
  - **Build / hire / borrow per domain:** based on time-to-level rules of thumb. At best, one level takes one 90-day plan; a gap of two levels means hire or borrow.
  - **Job descriptions:** the SFIA 9 skills to write into them.

  Loading the team's codes (C1) adds a gap heat-map of roles × domains.
- **Who it serves:** CIOs/CDOs, HR business partners, and the owner's consulting team before an engagement.
- **Why it beats what exists:** it turns the role library (today a reading list, `Roles.tsx`) into a calculator for a real decision.
- **Data/content needed:** role targets and SFIA codes in `roleLibrary.ts` already exist. The time-to-level rules of thumb are new and must be labelled «تقدير تحريري».
- **Effort:** M.
- **Risk:** overclaiming SFIA alignment, and editorial rules of thumb. Mitigate with labels and a Methodology entry.

### C5. «الذكاء الاصطناعي التوليدي في عملي» — everyday GenAI readiness check — **SHOULD**
- **What it is:** a 10-minute standalone check:
  - **8 behaviours**, for example «أتحقق من أي استشهاد نظامي يقترحه النموذج قبل استخدامه».
  - **6 scenarios:**
    - pasting a classified memo into a public chatbot;
    - an AI-drafted reply to a citizen;
    - AI help on a procurement document;
    - a made-up ("hallucinated") regulation article;
    - telling people when AI was used;
    - bias when screening CVs.
  - **Output:** a result card and a one-page «قواعدي في استخدام الذكاء الاصطناعي».
- **Who it serves:** every employee; HR directors who want a baseline for mass upskilling (through C1 codes); the owner's trainers (workshop content).
- **Why it beats what exists:** the 8 domains are a digital-specialist taxonomy (cloud, agile delivery, emerging tech…). As a result:
  - The generalist profile targets «تطبيق» in cloud and emerging tech (the generalist targets in `roles.ts`).
  - Its first homework is cloud IaaS/PaaS (B2).
  - The capability changing every employee's work *now* is buried in an "AI & Data" domain written for analysts.

  A separate module fixes this without re-engineering the 8-axis model during a 2-day push.
- **Data/content needed:** about 14 new items with rationales. Each cites SDAIA's AI ethics principles and GenAI guidance for government, NDMO data classification, or PDPL, with a date. Reuse the wizard engine.
- **Effort:** M.
- **Risk:** guidance changes over time. Date-stamp each item, link the sources, and avoid "rules" wording.

### C6. «خريطة تحوّل العمل الحكومي» — government work-shift map — **WOW** (replaces careers, quiz, lists and network map)
- **What it is:** about 20 government job families: policy analyst, procurement officer, HR officer, customer-service agent, legal advisor, finance officer, communications officer, project/programme manager, inspector/auditor, records/archives officer, data analyst, IT operations, and others. For each family:
  - tasks sorted into four lanes for 2026–2030: «تُؤتمت · تُعزَّز · تنشأ · تبقى إنسانية»;
  - the rising capabilities, linked to domains and skills;
  - «ماذا يفعل المدير الآن».

  Use qualitative bands only (ILO 2025 refined GenAI exposure gradients, WEF 2025), with confidence badges and no percentages.
- **Who it serves:** all four personas. It is the direct answer to the organizing question.
- **Why it beats what exists:** v8's "how roles change" content is about pilots, nurses and delivery drivers, written for students, and only 1 of the 50 careers is a government role.
- **Data/content needed:** new content. The structure can reuse the task-change section at `Careers.tsx:325`. Start with 8 families in the push and grow later.
- **Effort:** L for the full content; M for the first 8 families.
- **Risk:** overclaiming automation. Use qualitative bands only and mark the ISCO mapping as approximate.

### C7. «وضع الورشة» — facilitator mode for scenario-based learning — **WOW**
- **What it is:** a projector layout for running scenarios in a room.
  1. The facilitator picks a track and 4–8 scenarios.
  2. The room votes by show of hands, and the facilitator taps in the counts.
  3. The reveal shows the graded options, the rationale and discussion prompts.
  4. At the end, participants can generate their codes, and C1 gives a cohort baseline.
  5. Re-running at the end of the programme produces a before/after brief, with honest caveats.
- **Who it serves:** the owner's Digital Skills team, L&D teams, leadership off-sites.
- **Why it beats what exists:** it makes the static site something the owner's own team uses every week, and it turns the strongest content (the scenarios) into learning instead of a hidden test.
- **Data/content needed:** the existing scenarios, plus about 2 discussion prompts per scenario.
- **Effort:** S/M.
- **Risk:** low; no individual data.

### C8. «موجز احتياج القطاع» — sector capability-demand brief generator — **SHOULD** (replaces the directory and entity pages)
- **What it is:**
  - **Inputs:** a sector (cleaned, government-only list), an entity archetype (وزارة سياسات · جهة تنظيمية · جهة خدمية · بلدية/إمارة · جهة تشغيلية) and 3 transformation priorities.
  - **Output:** a printable brief with priority domains, critical roles, typical leader scenarios and a learning sequence.
  - **Optional demand signal:** only when the sector has at least 10 entities with records, an aggregate «ما طلبته جهات القطاع من خدمات استشارية 2023–2026», labelled «طلب على خدمات ≠ احتياج مهاري».
- **Who it serves:** HR directors, CIOs, a minister's office; the owner's consulting team as a conversation starter.
- **Why it beats what exists:** it keeps v8's best idea (linking real demand to skills) without publishing named entities, logos or inferred diagnoses.
- **Data/content needed:** the `sectorSkills.ts` mapping (its editorial weights stay disclosed), cleaned sector aggregates, and new editorial archetype profiles.
- **Effort:** M.
- **Risk:** sector aggregates are still internal data, so each published figure needs the owner's approval.

**Sequencing:** C3 → C1 (same code) → C2 → C5 → C6 (first 8 families) → C7 → C4 → C8. The first four are what make each of the four personas call it "useful today"; C6 and C7 are what make it memorable.

---

## D. Information architecture and journey

### D1. Principles
1. Five hubs, each named after a user goal, not a data source.
2. One concept = one Arabic term (glossary in D4), enforced by a lint check.
3. Every hub ends in something you can print or share.
4. Data pages are evidence *inside* goals, not destinations of their own.

### D2. Navigation
Desktop: logo + 5 hubs + language toggle + CTA button. Mobile: a drawer plus a sticky CTA.

| # | Arabic label | English | Contains | Main output |
|---|---|---|---|---|
| — | logo «رادار المهارات الرقمية» (= Home) | Home | persona router, «5 تحولات» strip, sample outputs | — |
| 1 | **تقييمي** | My assessment | «ابدأ التقييم» → «نتيجتي» → «خطتي»; «فحص الذكاء التوليدي» (C5) | ورقة حوار التطوير + calendar |
| 2 | **للقادة والفرق** | Leaders & teams | «الموجز القيادي» + «فحص القرار القيادي» (C2), «رادار الفريق» (C1), «مخطِّط قدرات الوحدة» (C4), «موجز احتياج القطاع» (C8), «وضع الورشة» (C7), «دليل التبني المؤسسي» | leader brief, team needs brief |
| 3 | **تحوّل العمل الحكومي** (short: «تحوّل العمل») | How government work is changing | «خريطة تحوّل المهام» (C6), «مهارات 2030» (today's FutureSkills), «تقنيات تغيّر العمل» (re-scoped tech radar), WEF growing/declining lists as one evidence panel | — |
| 4 | **الأدوار والمهارات** | Roles & skills | «المجالات الثمانية», «الأدوار (24)», «قاموس المهارات (40)», «سُلّم المستويات» | printable role sheet |
| 5 | **المنهجية والمصادر** | Method & sources | «كيف نبني أحكامنا», «المعايير والتقارير», «مصادر البيانات وتواريخها», «الخصوصية», «سجل التغييرات» | — |
| CTA | «ابدأ التقييم» / «أكمل التقييم» | Start / continue the assessment | | |

**Footer:**
- «عن المفهوم»: the author, the statement that this is an independent concept and not an official product, and the roadmap.
- «الخصوصية», «المصادر», the language toggle, and the date of the last data update.

**Why these names:**
- «تقييمي» is one possessive word a non-technical reader understands instantly.
- «للقادة والفرق» says who the hub is for.
- «تحوّل العمل الحكومي» echoes the organizing question.
- «الأدوار والمهارات» is more concrete than «المرجع».
- «المنهجية والمصادر» signals the evidence culture.

### D3. What happens to each of the 19 current views

| Current view (id) | Decision | New home / name |
|---|---|---|
| `home` | Rewrite | Home: persona router + «5 تحولات» + sample outputs; drop the roadmap and student sections |
| `wizard` | Keep, fix (B1), simplify step 0 | تقييمي › «ابدأ التقييم». Replace today's two choices (track, then role) with one question, «ما طبيعة دورك؟», which sets both track and target; the precise role becomes optional |
| `results` | Merge and redesign | تقييمي › «نتيجتي»: 3 priorities, 8 levels, evidence layers; no overall stage, no careers, no tech cards |
| `pathways` | Merge | تقييمي › «خطتي» |
| `future-skills` | Keep | تحوّل العمل › «مهارات 2030» |
| `careers` | Remove from the omary.me v9 build | replaced by «خريطة تحوّل المهام» (C6); student content kept on an archive branch |
| `decide` (quiz) | Remove | — (highest credibility risk, off-mission) |
| `lists` | Remove as a page | becomes one evidence panel inside «تحوّل العمل»; drop the family article «المهارات أم الشهادة؟» |
| `explore` (network map) | Remove for now | could return later as a roles↔skills↔technologies map. Today its middle ring is career categories, a third sector taxonomy |
| `tech-radar` | Demote and re-scope | «تقنيات تغيّر العمل»: each technology → the skills it demands; show the horizon only; numeric TRL moves to the detail view with an "editorial" badge |
| `roles` | Keep | الأدوار والمهارات › «الأدوار» (also the engine for C4) |
| `skills` (registry) | Merge | الأدوار والمهارات › «قاموس المهارات» |
| `standards` | Merge | المنهجية والمصادر › «المعايير والتقارير» |
| `methodology` | Keep as hub | المنهجية والمصادر |
| `entities` (playbook) | Merge and rewrite | للقادة والفرق › «دليل التبني المؤسسي»; drop the HR-file link and mark KPI targets as editorial |
| `impact` | Demote | a national aggregate strip inside «عن المفهوم» or Methodology › «مصادر البيانات», only after the numbers are reconciled and approved |
| `sectors` | Merge | feeds the C8 aggregates (n ≥ 10); no "logo coverage" |
| `directory` | Remove from the public build | private-demo flag only |
| `entity` | Remove from the public build | private-demo flag only |

**Net result:** 19 views become 5 hubs and about 14 routes. Four new tools (C1, C2, C4/C8, C7) replace four student-oriented and data pages.

### D4. Arabic glossary (enforce with a lint check)

| Concept | Use | Do not use |
|---|---|---|
| the 8 areas | مجال / المجالات الثمانية | محور، قدرة |
| the 40 capability items | مهارة | كفاءة (keep it for the SFIA mapping) |
| the 4-step scale (one only) | مستوى: **وعي · تطبيق · إتقان · ريادة** (same grammatical form for all four) | the parallel stages «تأسيسي/نامٍ/متمكّن/رائد», or mixing in «ممارس/خبير» |
| the 5 audience tiers | فئة الدور: عام · تطبيقي · تخصصي · قيادة فرق · تنفيذي | «مسار» (overloaded) and «توعوي» (clashes with the level «وعي») |
| the 90-day plan | خطة التطوير / خطتي | مسارات التطوير |
| the result code | رمز النتيجة | رابط/كود |
| "measure" (imperative) | قِس | «قيّس» |
| entity | جهة حكومية (government only) | counting companies or clubs as جهات حكومية |
| sector | one list (the cleaned government sectors) | the 7 tech-radar "sectors" and the 25 career categories labelled «قطاع» |
| large numbers in Arabic | 170 مليون | «170M» |

### D5. Main journey for each persona

**Mid-level employee** (target: ≤ 15 minutes, ≤ 3 choices before the questions start)
1. Home → «أنا موظف».
2. «ما طبيعة دورك؟»: one choice; picking a precise role is optional.
3. 40 statements across 8 short screens, with save and resume.
4. 8 scenarios, with the rationale shown after each one.
5. «نتيجتي»: 3 priorities with their reasons.
6. «خطتي»: download «ورقة حوار التطوير» and the calendar file.
7. Optional: «شارك رمزك مع مديرك».
8. Day 90: «أعد القياس» shows the old and new polygons.

**Deputy Minister** (target: 10 minutes, no self-rating)
1. Home → «أنا قيادي».
2. «الموجز القيادي»: 5 shifts, 3 decisions.
3. «فحص القرار القيادي»: 8 scenarios, about 6 minutes.
4. Print the A4.
5. «اطلب من الموارد البشرية رادار الفريق»: a one-paragraph instruction to forward to HR.

**CIO / CDO**
1. Home → «أقود فريقًا رقميًا».
2. «مخطِّط قدرات الوحدة»: enter the role mix and priorities.
3. Read the required profile and the build/hire/borrow suggestions.
4. «اطلب رموز فريقك»: a message template to send the team.
5. «رادار الفريق» (k ≥ 5) → gap heat-map → print.
6. Reference: «الأدوار», with SFIA codes.

**HR director / L&D**
1. Home → «الموارد البشرية والتعلم».
2. «دليل التبني المؤسسي»: privacy, voluntary codes, and how to run a cohort in 2 weeks.
3. Run the cohort: employees use «تقييمي»; «وضع الورشة» is optional.
4. «رادار الفريق» per department → «ملخص احتياج الفريق» + «موجز احتياج القطاع».
5. After the programme, load the second set of codes → before/after brief.

### D6. Mobile
- **Navigation:** a drawer showing the 5 hubs with their sub-items, grouped (instead of a 16-chip scroller), and a sticky bottom «ابدأ التقييم» / «أكمل التقييم» button.
- **Wizard:** one statement group per screen, with large tap targets.
- **Charts:** below 480 px, a sorted bar list replaces the radar (the radar labels wrap badly at 390 px).
- **Printing:** print views are reachable through "save as PDF" buttons.

---

## E. Engineering review for a static deployment on omary.me

### 1. Routing, deep links, back button, sharing
- **Routes:** React Router 6 (data router) with **path routes and a language prefix**: `/ar/…`, `/en/…`. Examples: `/ar/assessment`, `/ar/plan`, `/ar/leaders/brief`, `/ar/leaders/team`, `/ar/work/shifts`, `/ar/roles/cdo`, `/ar/skills/ai-data-3`, `/ar/method`.
- **Prerendering:** prerender every non-personal route to static HTML with **vite-react-ssg**. It works with React Router and emits one HTML file per route with its own title and meta, so link previews work and pages load without a flash.
- **Personal state:** never put it in the path. Result and team codes go in the **URL hash** (`#r=…`, `#team=…`), which browsers never send to the server.
- **Hosting:** Cloudflare Pages or Netlify (SPA fallback via `_redirects`), or GitHub Pages with a 404 fallback.
- **Base path:** move to `/`. The current `base: '/digital-skills-radar/'` in `vite.config.ts` and the `logoUrl()` helper in `EntityLogo.tsx:7–10` must change.
- **Navigation behaviour:** use `ScrollRestoration` for back/forward. Remove the page-level `AnimatePresence` (`App.tsx:32–60`): it delays every navigation by about 300 ms and fights scroll restoration.

### 2. Bundle size and code-splitting
- **Today:** one 1.63 MB JS file (416 KB gzip).
- **Changes:**
  - Lazy-load each route with `React.lazy`.
  - Move large datasets out of JS into hashed JSON files under `/data/*.json`, fetched per route. Candidates: `govEntities.ts` (13,629 lines), `careers.ts` (2,762), `scenarios.ts` (1,255), `learning.ts` (1,183), `technologies.ts` (1,005).
  - Load framer-motion through `LazyMotion` + `domAnimation`, or replace it with CSS transitions.
- **Budget:** initial JS ≤ 150 KB gzip, route chunks ≤ 60 KB, LCP ≤ 2.0 s on a mid-range Android phone over 4G, CLS ≤ 0.05, total transfer on Home ≤ 400 KB.

### 3. Logos
- Remove them from the public build (B4).
- If a private build keeps them: 96 px WebP/AVIF, lazy-loaded, ≤ 6 KB each. Today there are 485 PNG files totalling 5.4 MB.

### 4. Data loading
- **JSON files with a build-time schema check:** use zod in a Node script, not in the browser. The check requires:
  - both `ar` and `en` text;
  - `source` + `confidence` on every quantitative field;
  - an `asOf` date;
  - Western digits only.
- **Saved data:** add a version number to the localStorage schema, with migrations (`dsr-history` has none today).

### 5. SEO, meta tags, link previews, sitemap
- Per-route `<title>`, description, canonical URL and `hreflang` ar/en.
- OG/Twitter cards with one designed static PNG per hub.
- `sitemap.xml`, `robots.txt`, and minimal JSON-LD (`WebApplication`, plus `Person` for the author).
- Fix the meta description (`index.html:6`) so it no longer says «إرشاد مهني».

### 6. Accessibility
- **Navigation:** nav items must be links, not buttons. A dropdown needs `aria-expanded`, Esc and arrow keys; the 5-hub layout in D2 removes the dropdowns altogether.
- **Answer options:** the wizard scales should be a `role="radiogroup"` with arrow-key movement and `aria-checked`; scenario options likewise.
- **Radar chart:**
  - The `aria-label` must follow the UI language; today it is the English «skills radar chart» even in the Arabic UI (`RadarChart.tsx:110`).
  - Add a visually hidden data table and a one-sentence text summary.
  - Make the axis labels keyboard-focusable.
- **Progress:** announce it with `aria-live`.
- **Motion:** never let content depend on `whileInView` — in print and for screen readers it stays at opacity 0.
- **CI:** run axe-core.

### 7. RTL correctness
- Logical CSS properties are already used, which is good.
- Wrap mixed-direction tokens in `<bdi>` ("TRL 8", "IaaS/PaaS/SaaS", "SFIA 9").
- Pin dates to `calendar: 'gregory'` together with `ar-SA-u-nu-latn`. Chrome 155 resolves Gregorian today, but the default `ar-SA` calendar has varied across engines and versions (historically Umm al-Qura).
- Draw arrows with one direction-aware component.
- Check how radar labels wrap at 390 px.

### 8. Performance and fonts
- Self-host IBM Plex Sans Arabic (woff2, subset, 3 weights).
- Drop Inter and Google Fonts. This removes a third-party request at load (a privacy issue) and keeps the Plex family for Latin text too.
- Use `font-display: swap` and preload one weight.

### 9. PWA / offline
- Optional, and SHOULD for workshop rooms with weak Wi-Fi: use `vite-plugin-pwa` to precache the app shell and JSON.
- No push notifications and no background sync.

### 10. Bilingual text (i18n)
- **Keep:** the typed inline `{ar, en}` objects. They guarantee both languages at compile time.
- **Add a lint check that fails on:**
  - empty strings;
  - Arabic text inside `en`;
  - Eastern digits;
  - banned terms (glossary D4).
- **Plurals:** use `Intl.PluralRules('ar')` for counts («4 خدمات أخرى»).
- **Entity names:** 359 of 683 entities have `nameEn: null`, so English mode shows Arabic. This stops mattering once entity pages are removed.

### 11. Testing a static site
- **Playwright end-to-end:**
  - the four persona journeys, in Arabic and English, at 1440 px and 390 px — this would have caught B1;
  - print-to-PDF checks that no element has computed opacity 0 in print;
  - visual snapshots per hub.
- **Vitest unit tests:**
  - the priority engine, against fixture profiles;
  - code encode/decode round-trip, as a property test;
  - the k-anonymity gate.
- **Content tests:** schema, sources, glossary.
- Keep `levels.selftest.mjs` as a unit test.

### 12. Build and deploy pipeline
- **GitHub Actions, in order:**
  1. typecheck;
  2. lint, including the content lint;
  3. unit tests;
  4. build + prerender;
  5. Playwright against `vite preview`;
  6. deploy to Cloudflare Pages (a preview per PR, production on tag);
  7. smoke test on the live URL.
- **Headers:** strict CSP (no inline scripts), `Referrer-Policy: no-referrer`, long caching for hashed assets.
- **Analytics:** none by default.

---

## F. Content and evidence review — what would embarrass the owner

### 1. Non-government bodies counted as government
- Law firms and vendors («التميمي للمحاماة», «Al Habardi Law», «bmb group», «Secure Networks»), football clubs and international organizations are all inside «682 جهة حكومية وشبه حكومية» and «31 قطاعًا حكوميًا» (`Directory.tsx`, `GovSectors.tsx:53–57`, `Impact.tsx:349`).
- Some English names are stored in `nameAr`.
- Some `nameEn` values are lowercase, for example «bureau of experts at the council of ministers».

### 2. Abolished and duplicate ministries
- «وزارة الإسكان» (`govEntities.ts:1381`), «وزارة الشؤون البلدية والقروية والإسكان» (`:1396`) and «وزارة البلديات والإسكان» (`:829`) all appear.
- So does «الهيئة العامة للرياضة (سابقة)» (`:9719`).

### 3. Totals that contradict the owner's own platforms
- **Mismatch:** 7,915 / 2,873 / 421 here, against 7,891 / 2,918 verified on 2026-10-18, and 320 government entities in ADVICEDGA.
- **Records vs. beneficiaries:** the label «سجل تدريبي» is attached to the field `trainingBeneficiaries` (`EntityDetail.tsx:89`).
- **Mixed units:** «إجمالي الاستفادة = السجلات التدريبية + الخدمات الاستشارية» (`Impact.tsx:257`) adds two units that cannot be added.
- **Sounds official:** «أرقام موثقة من سجلات الخدمة الرسمية» (`Impact.tsx:112`) reads as an official DGA statement.

### 4. Inferred needs presented as fact
- The page says «مشتق من الفئات الاستشارية التي طلبتها هذه الجهة فعليًا… — وليس افتراضًا» (`EntityDetail.tsx:151`).
- Yet the category→domain weights are editorial (`sectorSkills.ts:13–61`), and the shares are the top 3 re-scaled to 100% (`:86–89`).
- Example of the logic failing: requests for "awards & competitiveness" map 60% to leadership. So an entity that asked for help applying to awards is shown as "needing leadership".

### 5. Grammar errors visible on every entity page
- «و4 خدمة أخرى», «و10 خدمة أخرى», «و1 خدمة أخرى» appear in dozens of `topConsulting` strings in `govEntities.ts` («و1 خدمة أخرى» alone 38 times).
- Correct forms: «وخدمة أخرى / وخدمتان أخريان / و4 خدمات أخرى».

### 6. Three overlapping vocabularies for one scale, and «مسار» used four ways
- **Tracks:** «توعوي…تنفيذي» (`tracks.ts:29–76`).
- **Levels:** «وعي/تطبيق/ممارس/خبير» (`levels.ts:6–30`).
- **Stages:** «تأسيسي/نامٍ/متمكّن/رائد» (`levels.ts:41–71`).
- Results shows «نامٍ» right next to «تطبيق · 1.6».
- «مسار» means the audience track, the development plan («مسارات التطوير»), support programmes («مسارات الدعم الوطنية») and the university path («المسار الجامعي»).

### 7. Wrong verb form
- «قيّس» appears in `Home.tsx:164`, `EntityDetail.tsx:168`, `Explore.tsx:262`, `GovSectors.tsx:166` and `Careers.tsx:423, :428`.
- The correct «قِس» is used elsewhere (`Home.tsx:20`, `FutureSkills.tsx:71`).

### 8. Stale counts and colours
- **Role count:** «مكتبة الأدوار (20 دورًا)» (`Wizard.tsx:173`), «عشرون دورًا» (`Roles.tsx:30`) and «مكتبة 20 دورًا» (`Methodology.tsx:83`), against 24 roles in `roleLibrary.ts` and «الأربع والعشرين» on Home (`Home.tsx:30`).
- **Wrong colour:** «المضلع البنفسجي» (violet polygon) in `Wizard.tsx:134` and `Roles.tsx:30`, but the target polygon is amber.
- **Old theme leftovers:** cyan hover colours in `RadarChart.tsx:163, :280`.

### 9. Support programmes aimed at the wrong audience
- The plan page offers government employees:
  - «برنامج تمهير», which is for fresh graduates;
  - «دعم الشهادات الاحترافية (هدف)», from HRDF and oriented to the private sector;
  - «منصة جدارات», the job-application platform.

  Locations: `learning.ts:1146–1183`, `Pathways.tsx:266–283`.
- Resources are annotated «قد تعوَّض رسومها عبر دعم هدف» (`Pathways.tsx:189`).
- This is left over from the student-era item P0-9. For government staff, the relevant routes are government training providers (verify their current names before listing them) and the entity's own L&D budget.

### 10. Contradictions in the adoption playbook
- «اربط نتائج التقييم بملف الموظف في نظام الموارد البشرية» (`futureSkills.ts:399`) contradicts both "development only" and privacy.
- The KPI targets «≥ 80%», «≥ 20 دورًا» and «≥ 50%» (`futureSkills.ts:416–420`) have no source and no "editorial" badge, which breaks "no number without a source".
- «أكاديمية الحكومة الرقمية» (`futureSkills.ts:398`): verify the exact official name before a DGA audience reads it.

### 11. Small factual slips a DGA audience will catch
- «الهوية الرقمية الوطنية (نفاذ، توكلنا)» (`futureSkills.ts:64, :187`): Nafath is the identity layer; Tawakkalna is a services app.

### 12. Leftover career-guide positioning
- Meta description «…وإرشاد مهني» (`index.html:6`).
- Footer «منصة إرشاد مهني ومهاري» (`Footer.tsx:58`).
- The results disclaimer mentions «الموجه المهني… شروط القبول الرسمية» (`Disclaimer.tsx:20`).
- «قيّس جاهزيتك لهذه المهنة» on licensed professions (`Careers.tsx:428`).
- Careers suggested to civil servants (B6).

### 13. Latin abbreviations in the Arabic UI
- «170M / 92M / +78M» (`guidance.ts:10–15`) should be «170 مليون…».
- The digits themselves are correct in v8: the Eastern-digit date in `20-results-filled-desktop.png` was fixed with `ar-SA-u-nu-latn` (`Results.tsx:118`).

### 14. A parallel tech radar
- 48 TRL judgments by a single author, shown in a DGA-like identity (`technologies.ts`). The rationale and skills fields are English-only (`:22–29`).
- This invites the question "why does a DGA General Manager publish ratings that differ from the official GovTech Radar?"
- Re-scope it to "technology → skills" (D3).

### 15. Roadmap on the home page
- Five features marked «غير منفذة بعد» (`Home.tsx:315`). Acceptable inside «عن المفهوم»; harmful as the main home section.

---

## G. Rebuild plan — an intensive 1–2 day push by AI coding agents

| # | Packet | Scope | Acceptance criteria (a reviewer can verify) | Depends on | Parallel? |
|---|---|---|---|---|---|
| 1 | Hotfix + safety net | `Wizard.tsx` nesting bug; Playwright + Vitest harness | A fresh profile completes 40 statements + 8 scenarios and lands on Results, in Arabic and English (CI log + screenshots); unit test for `computeScores` | — | No (first) |
| 2 | Router and URL foundation | React Router; `/ar` and `/en` routes for every retained view; per-route title/meta; ScrollRestoration; base `/`; remove the page-level AnimatePresence; prerender with vite-react-ssg | Every route deep-links and survives a refresh; Back returns to the previous page; `document.title` is unique per route; `dist/` contains prerendered HTML for each route | 1 | No |
| 3 | Public data clean-up | `govEntities`, `govSectors`, `govServices`, `sectorSkills`; the Impact, Sectors, Directory and EntityDetail pages | Public `dist/` has 0 logo files, no entity routes and no ranking; non-government entities filtered out; totals match one dated source file approved by the owner; sector aggregates only where n ≥ 10; searching `dist/` for «التميمي» or «Al Habardi» finds nothing | 2 (routes) | Yes |
| 4 | Single priority engine + results redesign | new `priorities.ts`; Results, Pathways | 6 fixture profiles give the same top 3 in the headline, list, plan and print; no «مرحلتك العامة»; the development-only sentence appears on screen and in print (ar/en); no career or tech cards on Results | 1 | Yes (with 3 and 5) |
| 5 | IA and glossary | Header, Footer, Home, hub pages, drawer; take Decide, Careers, Lists and Explore out of the nav | Exactly 5 hubs + CTA with no wrapping at 1280 and 1440 px; mobile drawer works by keyboard; content lint passes D4 (no «قيّس», no «20 دورًا», no «البنفسجي», «مسار» only where allowed) | 2 | Partly (Home with 8) |
| 6 | Plan pack (C3) + result code | print view, `.ics`, `#r=` code, weekly checkboxes | Playwright PDF of the plan has 0 elements at opacity 0 and ≤ 2 A4 pages; the `.ics` opens in Apple, Google and Outlook calendars; encode/decode round-trip property test over 1,000 profiles | 4 | No (packet 7 needs it) |
| 7 | Team Radar (C1) | new route `/ar/leaders/team` | 4 codes → gate message; 12 fixture codes → distributions, coverage, single points of failure and A4 brief; the DOM contains no per-person row; before/after works with two code sets | 6 | Yes (with 8 and 9) |
| 8 | Leader brief + judgment check (C2) | content JSON + route | 5 shifts, each with source, confidence and date; the check is 8 scenarios on ≤ 8 screens with no headline number; A4 print ≤ 2 pages | 2, 5 | Yes |
| 9 | Work-shift map MVP (C6) + tech radar re-scope | content for 8 government job families; tech radar becomes "technology → skills" | 8 families × 4 lanes filled; every lane item sourced or marked editorial; no percentages; ar/en complete (lint) | 5 | Yes (content agent) |
| 10 | GenAI-at-work check (C5) | content + reuse of the wizard engine | 8 behaviours + 6 scenarios with dated citations; printable result card; code compatible with C1 (version field) | 4, 6 | Yes |
| 11 | Performance, accessibility and SEO hardening | lazy routes, JSON data, LazyMotion, self-hosted fonts, OG images, sitemap, hreflang, radar data table, nav as links | Initial JS ≤ 150 KB gzip; Lighthouse mobile performance ≥ 90 on Home; axe reports 0 serious/critical issues on 10 routes; zero third-party requests on load | 2, 5 | Yes |
| 12 | Content QA + release gate | all copy; visual QA; CI deploy to omary.me | Glossary, digits and plural lints green; screenshot set ar/en × 1440/390 px reviewed for every hub; B1–B10 re-checked on the live URL with evidence; owner sign-off on public data | all | No |

**Deferred to a second push:** C4 (unit capability planner), C7 (workshop mode) and C8 (sector brief). Their designs are ready in section C, and they reuse packets 4, 6 and 7.

---

## H. What NOT to do

1. **No entity-level exposure on omary.me.** Do not publish named-entity records, rankings, "has not benefited" labels, inferred entity "needs" or official logos (including the DGA's). The risks of confidentiality breach, implied endorsement and impersonation outweigh any demo value.
2. **No percentiles or league tables.** Do not add "you vs. your peers" or entity rankings. There is no reference sample of real employees, so any percentile would be an invented number.
3. **No link to HR decisions.** Do not connect results to HR files, appraisals, promotions, Jadarat or nominations. Do not show individual rows in Team Radar. Do not let the adoption guide imply that sharing a code is mandatory.
4. **No browser-side AI coach.** Do not add an "AI coach" or chatbot that sends answers to a third-party LLM from the browser. It breaks privacy-by-default and the evidence discipline in one move.
5. **No tracking.** Do not add analytics, Google Fonts or third-party embeds. Even "anonymous" tracking on a DGA official's personal domain invites questions.
6. **No more breadth yet.** Do not add careers, technologies or pages until the four persona journeys pass end to end. v3→v8 grew to 19 views by accretion.
7. **No parallel tech radar.** Do not rebuild a tech radar with numeric TRL scores in a DGA-like identity. Map technologies to skills instead.
8. **No official-sounding language.** Do not describe the site with «منصة وطنية», «معتمد», «رسمي» or «أرقام موثقة من سجلات الخدمة الرسمية». Add a persistent «مفهوم مستقل» marker.
9. **No gamification.** No badges, streaks or leaderboards: badges read as certification, and leaderboards as ranking employees.
10. **No motion that hides content.** Do not let `whileInView` or page transitions control visibility; print and screen readers must see everything.
11. **No server framework.** Do not move to Next.js SSR to get SEO; prerender static HTML instead. "No backend" is part of the trust argument.
12. **No domain-model rebuild in this push.** Do not try to re-engineer the 8-domain model now. Add the GenAI module beside it, and plan the domain-model revision with the owner's training team after the push.

---

**Live captures (v8, 2026-10-21), full paths:**
- `/private/tmp/claude-501/-Volumes-Alomary-SSD/cf769935-55c8-4d95-a8e4-8a96936cb081/scratchpad/live-wizard-step9.png` — blank scenario stage (B1)
- `/private/tmp/claude-501/-Volumes-Alomary-SSD/cf769935-55c8-4d95-a8e4-8a96936cb081/scratchpad/live-results.png` — contradictory priorities, careers for a civil servant, header wrapping (B2, B6, B8)
- `/private/tmp/claude-501/-Volumes-Alomary-SSD/cf769935-55c8-4d95-a8e4-8a96936cb081/scratchpad/live-home.png` — v8 home: roadmap section, global stats (B9)
- `/private/tmp/claude-501/-Volumes-Alomary-SSD/cf769935-55c8-4d95-a8e4-8a96936cb081/scratchpad/live-home-mobile-top.png` — mobile header and scroller (B8)
