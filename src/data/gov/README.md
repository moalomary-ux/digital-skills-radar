# طبقة بيانات الجهات (حزمة P4)

آخر توليد: 2026-10-22. المرجع: `docs/plan/DECISION-20261021.md` (القسم 2 الصفوف 5 و6 و7، والقسم 3) و`docs/plan/PLAN-20261021.md` (P4).

## الملفات

| الملف | الدور |
|---|---|
| `src/data/govEntities.ts` | مصدر الحقيقة المنقّى (682 صفًا) بالحقول الجديدة `entityType` و`status` و`mergedInto`؛ مدخل لسكربت البناء فقط، لا يستورده أي عرض |
| `src/data/govSectors.ts`, `govEntityDetails.ts`, `govServices.ts` | مدخلات سكربت البناء؛ `govServices.ts` صغير ويجوز استيراده متزامنًا (الأرقام الوطنية فقط، بلا ترتيب) |
| `src/data/sectorSkills.ts` | جدول ربط الفئة بالمجال (`categoryDomainMap`، أوزان تحريرية مسجلة كادعاءات) ودوال نقية فوق المجاميع؛ بلا حسابات على المصفوفات الكبيرة |
| `src/data/gov/types.ts` | الأنواع المشتركة وقاعدة `SECTOR_MIN_ENTITIES = 10` |
| `src/data/gov/taxonomy.ts` | التصنيفات الثنائية اللغة: القطاعات (المعرّف = مسار `/sectors/:sectorId`)، النوع التنظيمي، النطاق، المنطقة، فئات الاستشارات، الركائز، الفترات، تاريخ القطع |
| `src/data/gov/plural.ts` | نحو الجمع العربي لذيل «و… خدمة أخرى» |
| `src/data/gov/loaders.ts`, `useGovData.ts` | محمّلات `fetch` بذاكرة داخل الجلسة، وخطّاف React |
| `src/lib/flags.ts` | `dataMode()` و`isFullMode()`: `VITE_DATA_MODE=aggregate` (الافتراضي) أو `full` |
| `src/components/EntityLogo.tsx` | حرف أول على قرص أخضر في البناء العام؛ شعار WebP كسول في الوضع الكامل فقط |
| `src/data/claims/gov.ts` | ادعاءات الأرقام الوطنية والدليل المنقّى (`gov-*`)؛ المجاميع الوطنية والتوفيق مع السجل الحي مسجلة في `method-gov-*` وتُعاد الإشارة إليها |
| `scripts/build-gov-data.mjs` | التنقية (`--clean`) وتوليد JSON والتحقق (`--check`) |
| `scripts/convert-logos.mjs` | تحويل الشعارات إلى WebP 96px ونشرها للوضع الكامل |
| `public/data/entities-index.json` | الفهرس العام: `id, nameAr, nameEn, sectorId, type, region` فقط (587 صفًا) |
| `public/data/sectors.json` | المجاميع القطاعية (30 قطاعًا + صف مجمّع) |
| `public/data/entities/<sectorId>.json` | تفاصيل الجهات؛ تُولَّد في الوضع الكامل فقط ولا تُلتزم في المستودع |
| `src/data/gov/logos/<id>.webp` | الشعارات المحوّلة (مصدر؛ لا تُنسخ إلى `public/logos/` إلا في الوضع الكامل) |

## الأوامر

```bash
node scripts/build-gov-data.mjs --clean      # إعادة كتابة govEntities.ts وgovSectors.ts بالقواعد أدناه (متكرر الناتج)
node scripts/build-gov-data.mjs              # الشجرة العامة: entities-index.json + sectors.json، وحذف entities/ وشعارات public/logos/*.webp
node scripts/build-gov-data.mjs --check      # تحقق فقط: ثوابت التنقية + مطابقة ادعاءات gov.ts للأعداد
node scripts/convert-logos.mjs               # public/logos/*.png → src/data/gov/logos/*.webp (أطول ضلع 96px) ثم حذف PNG؛ ent-0179.png يُحذف ولا يُحوَّل

# بناء عام (الافتراضي)
node scripts/build-gov-data.mjs && npm run build

# بناء كامل للعروض الخاصة، ثم إعادة الشجرة العامة قبل أي التزام
node scripts/build-gov-data.mjs --full && VITE_DATA_MODE=full npm run build
node scripts/build-gov-data.mjs
```

يقرأ `build-gov-data.mjs` ملفات TypeScript مباشرة عبر تجريد الأنواع في Node (الإصدار 22.6 فأعلى)؛ لذلك تستورد ملفات `src/data/gov/*` بعضها بامتداد `.ts` صريح.

## قواعد التصنيف (`entityType`)

تُطبَّق بالترتيب، وجدول التجاوزات أولًا:

| # | القاعدة | الصنف |
|---|---|---|
| 0 | تجاوز صريح بالمعرّف (الجدول أدناه) | حسب الجدول |
| 1 | النوع «نادي» أو «اتحاد رياضي» | `sports` |
| 2 | القطاع «منظمات دولية وجهات أخرى» أو النطاق «دولية» | `international` |
| 3 | النطاق «أهلية» | `nonprofit` |
| 4 | النطاق «خاصة» (مكاتب محاماة، موردون، إعلام SRMG، بنوك، وكل الـ27 في قطاع «القطاع الخاص» ومنها «التميمي للمحاماة» و«Al Habardi Law») | `private` |
| 5 | القطاع «الشركات المملوكة للدولة والصناديق السيادية»، أو النوع «شركة» / «محفظة صندوق الاستثمارات» / «صندوق سيادي» مع نطاق «حكومية» أو «شبه حكومية» | `state-owned` |
| 6 | النطاق «شبه حكومية» | `quasi-government` |
| 7 | النطاق «حكومية» | `government` |
| 8 | النطاق «غير محددة» | يُحسم بالاسم ويُوثَّق في التجاوزات |

التجاوزات:

| المعرّف | الجهة | الصنف | السبب |
|---|---|---|---|
| ent-0679 | مركز الملك سلمان للإغاثة والأعمال الإنسانية | government | جهة حكومية سعودية رغم إدراجها في قطاع المنظمات الدولية |
| ent-0680 | المؤسسة الخيرية لرعاية الأيتام (إخاء) | nonprofit | مؤسسة خيرية |
| ent-0440 | الاتحاد الرياضي للجامعات السعودية | sports | النطاق «غير محددة»؛ حُسم بالاسم |
| ent-0437 | الاتحاد السعودي للهجن | sports | نوعه «اتحاد» ونطاقه «حكومية» في المصدر |
| ent-0439 | رابطة الدوري السعودي للمحترفين | sports | مسجلة بنطاق «حكومية» |
| ent-0466 | المنتخب السعودي الأول | sports | مسجل بنطاق «خاصة» |
| ent-0470 | دوري روشن السعودي | sports | مسجل بنطاق «خاصة» |

النتيجة (682 صفًا):

| الصنف | العدد |
|---|---|
| government | 432 |
| quasi-government | 5 |
| state-owned | 87 |
| private | 87 |
| nonprofit | 3 |
| international | 5 |
| sports | 63 |

ملاحظة: «370 جهة حكومية أو شبه حكومية» في ملف المصدر تعتمد نطاق الملف (حكومية + شبه حكومية = 532 جهة)، وهو أوسع من تصنيف الدليل المنقّى الذي يفرز الشركات المملوكة للدولة والجهات الرياضية على حدة. الرقمان يُعرضان كل بمصدره (الادعاء `gov-entities-served-gov`).

## الحالة (`status`)

تاريخية (`historical`؛ مخفية من الفهرس العام، لا سجلات خدمات لأي منها):

| المعرّف | الجهة | الخلف |
|---|---|---|
| ent-0236 | وزارة البيئة والخدمات - سابقة | وزارة البيئة والمياه والزراعة |
| ent-0237 | وزارة المياه والكهرباء (سابقاً) | وزارة البيئة والمياه والزراعة، وزارة الطاقة |
| ent-0421 | الهيئة السعودية للسياحة والتراث الوطني (سابقاً) | وزارة السياحة، هيئة التراث |
| ent-0468 | الهيئة العامة للرياضة (سابقة) | وزارة الرياضة |
| ent-0062 | وزارة الإسكان | وزارة البلديات والإسكان (ent-0038) |
| ent-0063 | وزارة الشؤون البلدية والقروية والإسكان | وزارة البلديات والإسكان (ent-0038) |

مدمجة (`merged`؛ تُجمع سجلاتها في الهدف إن وُجدت، ولا سجلات لأي منها):

| المعرّف | الجهة | مدمجة في |
|---|---|---|
| ent-0427 | موسم الرياض 2022 | ent-0426 موسم الرياض |
| ent-0428 | موسم الرياض 2023 | ent-0426 موسم الرياض |

## إصلاح الأسماء

قاعدة: لا جهة في الفهرس العام باسم عربي بلا حروف عربية. الأسماء اللاتينية المنقولة إلى `nameAr` نُقلت إلى `nameEn` وأُعطيت اسمًا عربيًا:

| المعرّف | قبل | nameAr بعد | nameEn بعد |
|---|---|---|---|
| ent-0385 | About Her | مجلة أباوت هير | About Her Magazine |
| ent-0386 | SRMG International | SRMG الدولية | SRMG International |
| ent-0387 | SRMG Labs | مختبرات SRMG | SRMG Labs |
| ent-0388 | SRMG Media | SRMG للإعلام | SRMG Media |
| ent-0389 | SRMG Think | SRMG ثينك | SRMG Think |
| ent-0390 | SRMG Ventures | SRMG فينتشرز | SRMG Ventures |
| ent-0391 | SRMG X | SRMG إكس | SRMG X |
| ent-0392 | أ SRMG Academy | أكاديمية SRMG | SRMG Academy |
| ent-0660 | Al Habardi Law | الحبردي للمحاماة | Al Habardi Law |
| ent-0661 | Secure Networks | شركة سيكيور نتوركس | Secure Networks |
| ent-0662 | United National Information Technology Co. | الشركة الوطنية المتحدة لتقنية المعلومات | United National Information Technology Co. |
| ent-0663 | bmb group | مجموعة بي إم بي | BMB Group |
| ent-0681 | UNU EGOV | وحدة الحكومة الإلكترونية بجامعة الأمم المتحدة | UNU-EGOV (United Nations University) |

الأسماء الإنجليزية الصغيرة الحروف (8) صارت بحروف كبيرة أولى مع إبقاء of/at/the/for/and صغيرة: ent-0012، ent-0108، ent-0185، ent-0362، ent-0514، ent-0521؛ واستثناء العلامتين `stc Group` (ent-0637) و`noon` (ent-0648). المقر «حائل)» صُحح إلى «حائل».

## نحو الجمع في `topConsulting`

`otherServicesAr(n)`: 1 ← «وخدمة أخرى»، 2 ← «وخدمتان أخريان»، 3 إلى 10 ← «و4 خدمات أخرى»، 11 فأكثر ← «و11 خدمةً أخرى». التوزيع بعد التنقية: 38 / 27 / 136 / 14. الملف الملتزم لا يطابق النمط الممنوع `/و\s?\d+\s?خدمة أخرى/` (يفحصه `content-lint` و`--check`).

## إعادة ترقيم معرّف الهيئة (ID_REMAP)

- صف هيئة الحكومة الرقمية في المصنّف هو الصف 179 (`num: 179`)، لكن معرّفه المنشور هو `ent-9179` لا `ent-0179`، كي لا يظهر النص `ent-0179` (اسم ملف الشعار المحذوف) في أي ملف مولَّد أو في `dist/` (معيار القبول: `grep -r ent-0179 dist/` فارغ). الجدول `ID_REMAP` في `scripts/build-gov-data.mjs`، ويُطبَّق آخر خطوة في `cleanEntity` لأن جداول الاستثناءات مفتاحها المعرّف الخام.
- مفتاحا الجهة في `src/data/govEntityDetails.ts` (`entityCategoryRecords` و`entityYearlyTraining`) أُعيدت تسميتهما يدويًا إلى `ent-9179` (2026-10-22)؛ `--check` يرفض بقاء المفتاح الخام.

## الشعارات

- `public/logos/ent-0179.png` (شعار هيئة الحكومة الرقمية) يُحذف ولا يُحوَّل؛ الحقل `logo` للجهة ent-9179 (الهيئة) هو `null`.
- بقية الشعارات تُحوَّل إلى WebP بأطول ضلع 96px في `src/data/gov/logos/` وتُحذف ملفات PNG من `public/logos/`. الشعار المكرر: ent-0592 يشير إلى `ent-0061`.
- الوضع العام لا يشحن أي شعار (`dist/logos/` فارغ)؛ `--full` ينسخ WebP إلى `public/logos/` وتعيد التشغيلة الافتراضية حذفها.
- تنبيه تنفيذي (2026-10-22، أُعيد التحقق في جولة الإصلاح): ملفات PNG حُذفت من شجرة العمل `wt-p4` قبل تحويلها، و`src/data/gov/logos/` فارغ. بيئة التنفيذ لا تصل إلى `repo/.git` (رفض على مستوى النظام)، فالاسترجاع يُنفَّذ خارجها، من داخل `wt-p4`:
  1. `git log --oneline --diff-filter=D -- public/logos | head -1` لمعرفة التزام الحذف `<C>` (إن لم يكن الحذف ملتزمًا بعد يكفي `git checkout -- public/logos`).
  2. `git checkout <C>^ -- public/logos` ثم `node scripts/convert-logos.mjs` (يحذف ent-0179.png ولا يحوّله، ويحوّل الباقي إلى WebP 96px في `src/data/gov/logos/` ويحذف PNG).
  3. `node scripts/build-gov-data.mjs --full` ثم `ls public/logos/*.webp | wc -l` للتحقق من نسخ الوضع الكامل، ثم `node scripts/build-gov-data.mjs` لإعادة الشجرة الافتراضية.
  المسار مُجرَّب على ملفات PNG اصطناعية (أفقي، عمودي، صغير بلا تكبير، وحذف ent-0179).

## ملفات JSON

- `entities-index.json`: الجهات القائمة من الأصناف العامة (`PUBLIC_ENTITY_TYPES` = كل الأصناف عدا `private`)، مرتبة برقم الصف؛ 587 صفًا؛ «موسم الرياض» مرة واحدة؛ لا `logo` ولا `services`.
- `sectors.json`: 30 قطاعًا (بلا «القطاع الخاص») وصف مجمّع `other-pooled`. لكل قطاع: `entityCount` (الجهات العامة القائمة)، `entitiesWithRecords` (كل الجهات ذات السجلات في القطاع، ومنها موردون خاصون قليلون كي تبقى المجاميع مطابقة لورقة المصدر)، `showAggregates = entitiesWithRecords ≥ 10`، و`training`/`consulting`/`categories`/`domains` عند الإظهار فقط. مجاميع القطاعات المخفية و«القطاع الخاص» تُجمع في الصف المجمّع، فمجموع `training` = 7,915 ومجموع `consulting` = 2,873 دائمًا (يتحقق منه السكربت).
- `domains`: ترتيب المجالات من `domainsFromCategoryCounts` بعدد السجلات الموزونة، بلا نسب أعلى-3 معاد تطبيعها.

## ما يُحذف مع الجزء الثاني (P4-SHIM)

أبقيت توافقًا للتجميع فقط إلى أن يستبدل الجزء الثاني العروض القديمة؛ ابحث عن `P4-SHIM` واحذف: `topEntitiesByBenefit` و`TopEntity` و`totalBenefit` في `govServices.ts`، و`totalBenefit` في `GovEntityServices`، و`SkillDemand`/`sectorSkillProfiles`/`entitySkillProfile`/`topCategoryForSector`/`sectorsByCategory` في `sectorSkills.ts`.
