# تسليم v9 — رادار المهارات الرقمية (2026-10-22)

**الحيّ:** https://radar.omary.me (العربية `/ar/`، الإنجليزية `/en/`). **المستودع:** github.com/moalomary-ux/digital-skills-radar (الفرع `main` = المصدر، `gh-pages` = البناء المنشور). الإصدار السابق محفوظ في الوسم `v8-handover`.

## ما المنتج (v9)
منصة ثابتة (بلا خادم، بلا حسابات، بلا تتبّع) لدعم قرار تطوير القوى العاملة الحكومية: 6 محاور — تقييمي، للقادة والفرق، تحوّل العمل الحكومي، الأدوار والمهارات، الجهات والقطاعات، المنهجية والمصادر. القرار الكامل في `docs/plan/DECISION-20261021.md`، والحزم في `docs/plan/PLAN-20261021.md`، والمراجعات الثماني في `docs/reviews-20261021/`.

## التشغيل
```bash
npm ci
npm run dev          # تطوير محلي
npm test             # vitest + فحص المحتوى الصارم (CONTENT_LINT_STRICT=1)
npm run build        # prebuild: توليد بيانات الجهات (JSON) → vite → 404 → SSR → ترميز مسبق 88 صفحة → sitemap → ختم وضع البناء
npm run guard        # حارس النشر: يفشل إن تسرّب شعار أو سجل جهة أو ترتيب إلى البناء العام
npm run size-budget  # ≤ 180KB لأكبر حزمة، ≤ 220KB لمجموع الصفحة الأولى (مضغوطة)
VITE_DATA_MODE=full npm run build && scripts/deploy-gh-pages.sh   # النشر إلى gh-pages (البناء الكامل)
```

## وضعا البيانات
- `VITE_DATA_MODE=full` (**المنشور بقرار المالك 2026-10-22**): الأرقام الوطنية + مجاميع القطاعات + سجل خدمات كل جهة + شعارات الجهات (بلا شعار الهيئة، بلا ترتيب): `VITE_DATA_MODE=full npm run build && scripts/deploy-gh-pages.sh`.
- `VITE_DATA_MODE=aggregate` (الافتراضي عند البناء بلا مفتاح): مجاميع فقط بلا سجلات ولا شعارات؛ للنشر به: `PUBLISH_MODE=aggregate scripts/deploy-gh-pages.sh`.
- الشعارات المحوّلة (484 WebP بلا شعار الهيئة) في `src/data/gov/logos/`؛ تُنسخ إلى `public/logos/` في الوضع الكامل فقط.

## سير النشر الآلي (معلّق)
ملف `.github/workflows/deploy.yml` جاهز في الفرع `ci/deploy-workflow` لكن دفعه يحتاج صلاحية `workflow` لرمز GitHub. بعد `gh auth refresh -h github.com -s workflow` (يُجريه المالك تفاعلياً): `git push origin ci/deploy-workflow` ثم دمجه في `main` وتحويل Pages إلى «GitHub Actions» من الإعدادات. إلى ذلك الحين النشر يدوي بالسكربت أعلاه.

## أين ماذا
`src/lib/routes.ts` (المسارات) · `src/lib/head.ts` (عناوين/أوصاف/OG) · `src/lib/priorities.ts` (محرك الأولويات الواحد) · `src/lib/resultCode.ts` (رمز النتيجة) · `src/lib/team.ts` (رادار الفريق) · `src/data/claims/` (سجل الادعاءات) · `src/data/gov/` (طبقة الجهات) · `scripts/` (البناء والحراس) · `.orchestration/HANDOFF.json` (حالة القيادة).
