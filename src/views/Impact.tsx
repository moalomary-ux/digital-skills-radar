import { motion } from 'framer-motion'
import { useApp } from '../store'
import {
  govServiceKpis,
  consultingCategories,
  strategicPillars,
  yearlyTraining,
  regionStats,
  topEntitiesByBenefit,
} from '../data/govServices'
import Icon from '../components/Icon'

const fmt = (n: number) => n.toLocaleString('en-US')

const GREEN = '#1B8354'
const GREEN_DEEP = '#167248'
const AMBER = '#DBA102'
const INK = '#212539'
const MUTED = '#4D5761'
const BG = '#EEF1F4'

interface HRow {
  key: string
  label: string
  value: number
  hint?: string
}

/** Horizontal SVG bar chart — bars grow from the left (transform/opacity only). */
function HBarChart({ rows, max, labelW = 200, ariaLabel, onRowClick }: { rows: HRow[]; max: number; labelW?: number; ariaLabel: string; onRowClick?: (row: HRow) => void }) {
  const rowH = 32
  const barH = 15
  const W = 760
  const valW = 120
  const barMax = W - labelW - valW
  const H = rows.length * rowH + 6
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={ariaLabel}>
      {rows.map((r, i) => {
        const y = i * rowH + 4
        const w = Math.max((r.value / max) * barMax, 3)
        return (
          <g
            key={r.key}
            onClick={onRowClick ? () => onRowClick(r) : undefined}
            className={onRowClick ? 'cursor-pointer transition-opacity hover:opacity-75' : undefined}
          >
            {onRowClick && <title>{r.label}</title>}
            <text x={labelW - 10} y={y + barH - 3} textAnchor="end" fontSize="11.5" fill={INK}>
              {r.label.length > 34 ? `${r.label.slice(0, 33)}…` : r.label}
            </text>
            <rect x={labelW} y={y} width={barMax} height={barH} rx={7.5} fill={BG} />
            <rect
              x={labelW}
              y={y}
              width={w}
              height={barH}
              rx={7.5}
              fill={GREEN}
              className="bar-intro"
              style={{ animationDelay: `${i * 45}ms` }}
            />
            <text x={labelW + w + 8} y={y + barH - 3} fontSize="11.5" fontWeight="700" fill={GREEN_DEEP}>
              {fmt(r.value)}
              {r.hint ? <tspan fontWeight="400" fill={MUTED} fontSize="10">{`  ${r.hint}`}</tspan> : null}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Impact() {
  const { t, go, lang, openSectorsByCategory } = useApp()

  const kpis: { value: string; label: { ar: string; en: string }; sub: { ar: string; en: string } }[] = [
    {
      value: fmt(govServiceKpis.servedEntities),
      label: { ar: 'جهة مستفيدة', en: 'Entities served' },
      sub: { ar: `منها ${fmt(govServiceKpis.govQuasiEntities)} حكومية وشبه حكومية`, en: `incl. ${fmt(govServiceKpis.govQuasiEntities)} gov & quasi-gov` },
    },
    {
      value: fmt(govServiceKpis.trainingRecords),
      label: { ar: 'سجل تدريبي', en: 'Training records' },
      sub: { ar: govServiceKpis.trainingPeriod, en: '2021 to 2026' },
    },
    {
      value: fmt(govServiceKpis.consultingServices),
      label: { ar: 'خدمة استشارية', en: 'Consulting services' },
      sub: { ar: govServiceKpis.consultingPeriod, en: '2023 to end of Q3 2026' },
    },
    {
      value: fmt(govServiceKpis.trainingPrograms),
      label: { ar: 'برنامجًا تدريبيًا', en: 'Training programs' },
      sub: { ar: `${fmt(govServiceKpis.trainingEntities)} جهة درّبت`, en: `${fmt(govServiceKpis.trainingEntities)} entities trained` },
    },
    {
      value: fmt(govServiceKpis.totalBenefit),
      label: { ar: 'إجمالي الاستفادة', en: 'Total benefit' },
      sub: { ar: `${fmt(govServiceKpis.bothTracksEntities)} جهة في المسارين معًا`, en: `${fmt(govServiceKpis.bothTracksEntities)} entities on both tracks` },
    },
  ]

  const maxYear = Math.max(...yearlyTraining.map((y) => y.records))
  const top10 = topEntitiesByBenefit.slice(0, 10)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-8 max-w-3xl">
        <p className="eyebrow">{t({ ar: 'أرقام موثقة من سجلات الخدمة الرسمية', en: 'Verified figures from official service records' })}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">
          {t({ ar: 'أثر تمكين الجهات الحكومية', en: 'Government Enablement Impact' })}
        </h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          {t({
            ar: 'حصيلة خدمات التدريب والاستشارات المقدمة للجهات الحكومية وشبه الحكومية: التدريب من 2021 إلى 2026، والاستشارات من 2023 إلى نهاية الربع الثالث 2026.',
            en: 'The outcome of training and consulting delivered to government and quasi-government entities: training from 2021 to 2026, consulting from 2023 to end of Q3 2026.',
          })}
        </p>
      </div>

      {/* KPI hero row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label.en}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="glass p-5 text-center"
          >
            <p className="text-3xl font-bold text-dga-green-deep" dir="ltr">{k.value}</p>
            <p className="mt-2 text-sm font-semibold text-dga-black">{t(k.label)}</p>
            <p className="mt-1 text-[11px] leading-snug text-dga-muted">{t(k.sub)}</p>
          </motion.div>
        ))}
      </div>

      {/* yearly training */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45 }}
        className="glass mt-10 p-6"
      >
        <h2 className="text-lg font-bold text-dga-green-dark">
          {t({ ar: 'السجلات التدريبية حسب السنة', en: 'Training records by year' })}
        </h2>
        <p className="mt-1 text-xs text-dga-muted">
          {t({ ar: '2026 سنة جزئية — الأرقام حتى تاريخ استخراج البيانات.', en: '2026 is a partial year — figures as of the data extraction date.' })}
        </p>
        {(() => {
          const W = 720
          const H = 230
          const padB = 28
          const padT = 26
          const bw = 56
          const gap = (W - yearlyTraining.length * bw) / (yearlyTraining.length + 1)
          const chartH = H - padB - padT
          return (
            <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="yearly training bar chart">
              {yearlyTraining.map((y, i) => {
                const x = gap + i * (bw + gap)
                const h = (y.records / maxYear) * chartH
                const partial = y.year === 2026
                return (
                  <g key={y.year}>
                    <text x={x + bw / 2} y={H - padB - h - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill={partial ? AMBER : GREEN_DEEP}>
                      {fmt(y.records)}
                    </text>
                    <rect
                      x={x}
                      y={H - padB - h}
                      width={bw}
                      height={h}
                      rx={6}
                      fill={partial ? AMBER : GREEN}
                      className="bar-intro-y"
                      style={{ animationDelay: `${i * 60}ms` }}
                    />
                    <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize="12" fill={MUTED}>
                      {y.year}
                      {partial ? '*' : ''}
                    </text>
                  </g>
                )
              })}
            </svg>
          )
        })()}
      </motion.section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* strategic pillars */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className="glass p-6"
        >
          <h2 className="text-lg font-bold text-dga-green-dark">
            {t({ ar: 'الخدمات حسب الركيزة الاستراتيجية', en: 'Services by strategic pillar' })}
          </h2>
          <div className="mt-4">
            <HBarChart
              ariaLabel="strategic pillars bar chart"
              labelW={150}
              max={Math.max(...strategicPillars.map((p) => p.recordCount))}
              rows={strategicPillars.map((p) => ({ key: p.pillar, label: p.pillar, value: p.recordCount }))}
            />
          </div>
        </motion.section>

        {/* consulting categories */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="glass p-6"
        >
          <h2 className="text-lg font-bold text-dga-green-dark">
            {t({ ar: 'الخدمات الاستشارية حسب الفئة', en: 'Consulting services by category' })}
          </h2>
          <p className="mt-1 text-xs text-dga-muted">
            {t({ ar: 'اضغط على أي فئة لعرض القطاعات الأكثر طلبًا لها.', en: 'Click any category to see the sectors that demand it most.' })}
          </p>
          <div className="mt-4">
            <HBarChart
              ariaLabel="consulting categories bar chart"
              labelW={250}
              max={Math.max(...consultingCategories.map((c) => c.recordCount))}
              rows={consultingCategories.map((c) => ({ key: c.category, label: c.category, value: c.recordCount }))}
              onRowClick={(r) => openSectorsByCategory(r.key)}
            />
          </div>
        </motion.section>
      </div>

      {/* top entities */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45 }}
        className="glass mt-6 p-6"
      >
        <h2 className="text-lg font-bold text-dga-green-dark">
          {t({ ar: 'أعلى 10 جهات استفادة', en: 'Top 10 benefiting entities' })}
        </h2>
        <p className="mt-1 text-xs text-dga-muted">
          {t({ ar: 'إجمالي الاستفادة = السجلات التدريبية + الخدمات الاستشارية.', en: 'Total benefit = training records + consulting services.' })}
        </p>
        <div className="mt-4">
          <HBarChart
            ariaLabel="top entities bar chart"
            labelW={270}
            max={Math.max(...top10.map((e) => e.totalBenefit))}
            rows={top10.map((e) => ({
              key: String(e.rank),
              label: `${e.rank}. ${e.name}`,
              value: e.totalBenefit,
              hint: lang === 'ar' ? `تدريب ${e.trainingBeneficiaries} · استشارات ${e.consultingServices}` : `trn ${e.trainingBeneficiaries} · cons ${e.consultingServices}`,
            }))}
          />
        </div>
      </motion.section>

      {/* regions */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45 }}
        className="glass mt-6 p-6"
      >
        <h2 className="text-lg font-bold text-dga-green-dark">
          {t({ ar: 'الانتشار حسب المنطقة', en: 'Coverage by region' })}
        </h2>
        <div className="mt-4">
          <HBarChart
            ariaLabel="regions bar chart"
            labelW={180}
            max={Math.max(...regionStats.map((r) => r.entities))}
            rows={regionStats.map((r) => ({
              key: r.region,
              label: r.region,
              value: r.entities,
              hint:
                lang === 'ar'
                  ? `تدريب ${fmt(r.trainingBeneficiaries)} · استشارات ${fmt(r.consultingServices)}`
                  : `trn ${fmt(r.trainingBeneficiaries)} · cons ${fmt(r.consultingServices)}`,
            }))}
          />
        </div>
      </motion.section>

      {/* provenance */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="glass mt-6 border-s-4 border-dga-amber p-6"
      >
        <h2 className="flex items-center gap-2 text-base font-bold text-dga-black">
          <Icon name="shield" className="h-5 w-5 text-dga-amber-tx" />
          {t({ ar: 'مصدر البيانات وملاحظة منهجية', en: 'Data source & methodology note' })}
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-loose text-dga-ink">
          <li className="flex gap-2">
            <span className="text-dga-green">▸</span>
            {t({
              ar: 'المصدر: سجلات خدمات هيئة الحكومة الرقمية الرسمية (ملفا القطاعات والخدمات) — مطابقة أسماء الجهات بين السجلين 421/421 (100%).',
              en: 'Source: official DGA service records (sectors & services workbooks) — entity name match across the two records 421/421 (100%).',
            })}
          </li>
          <li className="flex gap-2">
            <span className="text-dga-amber-tx">▸</span>
            {t({
              ar: 'ملاحظة: يرد في نص المنهجية المرافق للمصدر رقما 7,935 تدريبًا و2,918 استشارة، بينما مجاميع الجداول نفسها — بعد إعادة الاحتساب — هي 7,915 و2,873؛ وقد اعتمدت هذه الصفحة أرقام الجداول الموثقة.',
              en: 'Note: the accompanying methodology prose mentions 7,935 training and 2,918 consulting records, while the workbook totals themselves — recomputed — are 7,915 and 2,873; this page adopts the documented sheet totals.',
            })}
          </li>
        </ul>
      </motion.section>

      {/* cross-links */}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <button onClick={() => go('sectors')} className="glass-strong group p-6 text-start transition-shadow hover:shadow-card-lg">
          <Icon name="flag" className="h-7 w-7 text-dga-green" />
          <h3 className="mt-3 text-lg font-bold text-dga-black">{t({ ar: 'القطاعات الحكومية', en: 'Government Sectors' })}</h3>
          <p className="mt-1 text-sm text-dga-muted">
            {t({ ar: '31 قطاعًا: عدد الجهات، نسبة الشعارات، وحجم الاستفادة في كل قطاع.', en: '31 sectors: entity counts, logo coverage, and benefit volume per sector.' })}
          </p>
          <span className="mt-3 inline-block text-sm font-semibold text-dga-green-dark group-hover:underline">
            {t({ ar: 'استكشف القطاعات', en: 'Explore sectors' })} {lang === 'ar' ? '←' : '→'}
          </span>
        </button>
        <button onClick={() => go('directory')} className="glass-strong group p-6 text-start transition-shadow hover:shadow-card-lg">
          <Icon name="compass" className="h-7 w-7 text-dga-green" />
          <h3 className="mt-3 text-lg font-bold text-dga-black">{t({ ar: 'دليل الجهات', en: 'Entity Directory' })}</h3>
          <p className="mt-1 text-sm text-dga-muted">
            {t({ ar: '682 جهة حكومية وشبه حكومية قابلة للبحث والتصفية مع شعاراتها وسجل استفادتها.', en: '682 searchable, filterable government & quasi-government entities with logos and benefit records.' })}
          </p>
          <span className="mt-3 inline-block text-sm font-semibold text-dga-green-dark group-hover:underline">
            {t({ ar: 'افتح الدليل', en: 'Open the directory' })} {lang === 'ar' ? '←' : '→'}
          </span>
        </button>
      </div>
    </div>
  )
}
