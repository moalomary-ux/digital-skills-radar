# Gov Data Build Report — Digital Skills Radar

Generated from two Saudi-government Excel workbooks (no numbers invented; every figure below was recomputed programmatically from the sources).

- `inbox/sectors.xlsx` — دليل القطاعات والجهات والشعارات (sheets: الدليل، القطاعات، الجهات بلا شعار، المنهجية)
- `inbox/services.xlsx` — خدمات الهيئة للجهات (sheets: الملخص، الجهات، تفصيل الخدمات الاستشارية، التدريب حسب السنة، حسب القطاع، حسب المنطقة، المنهجية)

## Outputs

| Output | Content |
|---|---|
| `public/logos/ent-XXXX.png` | 485 unique logo files (486 anchored images, 1 shared) |
| `src/data/govEntities.ts` | 682 entities + joined DGA service utilization |
| `src/data/govSectors.ts` | 31 sectors + per-sector service totals |
| `src/data/govServices.ts` | KPIs, consulting taxonomy, pillars, yearly series, regions, top 15 |

## Row counts (verified)

| Source | Rows |
|---|---|
| sectors.xlsx / الدليل | 682 entities (nums 1..682, sequence verified) |
| sectors.xlsx / القطاعات | 31 sectors + الإجمالي row |
| sectors.xlsx / الجهات بلا شعار | 196 entities |
| services.xlsx / الجهات | 421 entities + الإجمالي row |
| services.xlsx / تفصيل الخدمات الاستشارية | 1,597 detail lines |
| services.xlsx / التدريب حسب السنة | 322 entities (per-row totals match row sums, 0 mismatches) |
| services.xlsx / حسب القطاع | 31 sectors + total |
| services.xlsx / حسب المنطقة | 14 regions + total |

## Logo extraction

- Images anchored on الدليل: **486**; entities mapped to a logo: **486**; status counts: يوجد شعار 486 / لا يوجد شعار 196 — anchor rows and logo-status rows coincide exactly (set difference empty).
- All 486 images are PNG (magic-byte verified); 12-file random sample re-validated with PIL.
- **485 unique files written**; 1 duplicate detected by SHA-1 and reused: entity #61 «شركة السجل العقاري» and entity #592 «السجل العقاري» share identical bytes → both map to `/logos/ent-0061.png`.
- File naming: `ent-XXXX.png` keyed by directory entity number (zero-padded). Total size ≈ 5.4 MB; largest file 38 KB.
- Mapping exported inside `govEntities.ts` as `logo: string | null`.

## Name matching (services الجهات → directory الدليل)

- Match rate: **421 / 421 = 100%** — all matched at the *exact* stage; the normalization fallbacks (hamza/alef/ya/taa-marbuta folding, whitespace compaction) were implemented but never needed.
- Unmatched services entities: **none**.
- Duplicate arabic names inside the directory: 0; normalized-name collisions: 0.
- Sector consistency across matched pairs: 421/421 identical (0 mismatches).

## Totals cross-check (recomputed vs workbook)

| Metric | Recomputed | الملخص KPI | المنهجية prose |
|---|---|---|---|
| Training participation records | **7,915** | 7,915 | 7,935 ⚠ |
| Consulting services | **2,873** | 2,873 | 2,918 ⚠ |
| Total benefit | **10,788** | — | — |
| Served entities | 421 | 421 | — |

⚠ The المنهجية sheet prose mentions 7,935 training records and 2,918 consulting services, but the workbook's own الملخص sheet and the totals rows of الجهات / حسب القطاع / حسب المنطقة all say 7,915 / 2,873, and recomputation from the 421 entity rows confirms **7,915 / 2,873**. The generated TS uses the recomputed (authoritative) figures and carries a comment documenting the discrepancy.

Other KPIs from الملخص: 370 government/quasi-government entities of the 421 served; 322 entities used training; 372 used consulting; 273 used both tracks; 377 training programs; consulting period 2023 → end of Q3 2026; training period 2021 → 2026.

## Consulting taxonomy (1,597 detail lines; عدد السجلات sums to 2,873 ✓)

8 categories (lineCount / recordCount):

| الفئة | lines | records |
|---|---|---|
| 2. تخطيط وتمكين البنية التقنية | 625 | 1,512 |
| 1. الاستراتيجيات الرقمية | 298 | 362 |
| 4. التميز المؤسسي واستمرارية الأعمال | 216 | 244 |
| 6. البيانات والتكامل | 159 | 291 |
| 7. مؤشرات الأداء الرقمي | 92 | 155 |
| 3. الابتكار والتقنيات الناشئة | 83 | 118 |
| 5. الاستثمار والخدمات الرقمية | 80 | 108 |
| 8. التميز والتنافسية | 44 | 83 |

6 strategic pillars (الركيزة الاستراتيجية, split on «؛» — a line may carry several pillars, so pillar line counts exceed 1,597):

| الركيزة | lines | records |
|---|---|---|
| تسريع التحول | 919 | 1,356 |
| رضا المستفيدين | 333 | 734 |
| البيئة التنظيمية | 271 | 439 |
| حكومة فعّالة | 259 | 676 |
| تمكين الأعمال | 218 | 476 |
| كفاءة الاستثمار | 27 | 36 |

## National yearly training series (sums across 322 entities; total = 7,915 ✓)

| 2021 | 2022 | 2023 | 2024 | 2025 | 2026 |
|---|---|---|---|---|---|
| 179 | 806 | 1,288 | 1,326 | 2,462 | 1,854 |

2026 is a partial year (consistent with the stated consulting cutoff of end-Q3 2026).

## Regions (14; entities sum = 421 ✓)

Riyadh dominates: 288 entities / 6,567 training / 2,238 consulting. Then Makkah (21/418/126), Eastern Province (18/324/120), Madinah (11/170/64), Aseer (6/125/81)… plus **«غير محدد» = 47 entities with 0 training and 81 consulting** (see anomalies).

## Sector joins

- 31/31 directory sectors joined to services حسب القطاع by exact name (0 unjoined).
- Served-entity counts agree between القطاعات (sectors.xlsx) and حسب القطاع (services.xlsx) for all 31 sectors.
- Sheet sector entity counts match recomputed counts from the 682 entity rows for all 31 sectors.

## Anomalies / notes

1. **المنهجية vs الملخص totals** — 7,935/2,918 in prose vs 7,915/2,873 everywhere else; recomputation confirms the latter (used).
2. **Duplicate logo** — «شركة السجل العقاري» (#61) and «السجل العقاري» (#592) share the same PNG bytes; stored once.
3. **غير محدد region** — 47 served entities have no region in services.xlsx; all show 0 training / 81 consulting. Kept as its own region entry in `regionStats`.
4. **القطاع الخاص sector** — 27 served entities, 0 training records, 46 consulting services (training tracks are government-focused).
5. **services.xlsx الجهات column «الشعار» (col 13)** exists but is 100% empty; ignored.
6. **Duplicate-looking names** — none: all 682 directory names are unique both raw and normalized.
7. **2026 partial-year** — 1,854 training records already logged for 2026; treat YoY comparisons with care.
8. All three TS files pass an esbuild syntax check (parsed + type-stripped without errors); entity/logo/services counts re-verified against the generated source (421 with services / 261 without; 486 with logo / 196 without).
