import type { L } from '../../data/types'
import type { View } from '../../store'

/** Last review of the data shown in the product (About, footer). ISO date. */
export const DATA_UPDATED_ON = '2026-10-22'

export const AUTHOR: L = { ar: 'محمد العُمري', en: 'Mohammed Alomary' }

export const SITE_NAME: L = { ar: 'رادار المهارات الرقمية', en: 'Digital Skills Radar' }

export const INDEPENDENCE: L = {
  ar: 'مفهوم مستقل من إعداد محمد العُمري — ليس منتجاً رسمياً لأي جهة.',
  en: 'An independent concept by Mohammed Alomary — not an official product of any entity.',
}

export interface HubLink {
  view: View
  label: L
  /** not built yet: rendered as text with a «قريباً» chip, never as a dead link */
  soon?: boolean
  /** shown only once the visitor has a saved result */
  needsHistory?: boolean
}

export interface Hub {
  id: 'assess' | 'leaders' | 'work' | 'roles' | 'sectors' | 'method'
  /** where the header link goes */
  view: View
  /** concise header label (fits one line at 1024 px) */
  nav: L
  /** full name (drawer, footer, hub page title) */
  title: L
  /** every view that belongs to this hub (drives the active underline) */
  views: View[]
  /** drawer sub-items */
  items: HubLink[]
}

export const hubs: Hub[] = [
  {
    id: 'assess',
    view: 'wizard',
    nav: { ar: 'تقييمي', en: 'My assessment' },
    title: { ar: 'تقييمي', en: 'My assessment' },
    views: ['wizard', 'results', 'pathways', 'report'],
    items: [
      { view: 'wizard', label: { ar: 'ابدأ التقييم', en: 'Start the assessment' } },
      { view: 'results', label: { ar: 'نتيجتي', en: 'My result' }, needsHistory: true },
      { view: 'pathways', label: { ar: 'خطتي', en: 'My plan' }, needsHistory: true },
    ],
  },
  {
    id: 'leaders',
    view: 'leaders',
    nav: { ar: 'للقادة والفرق', en: 'Leaders & teams' },
    title: { ar: 'للقادة والفرق', en: 'Leaders & teams' },
    views: ['leaders', 'leader-brief', 'leader-check', 'leader-team', 'adoption'],
    items: [
      { view: 'leader-brief', label: { ar: 'الموجز القيادي', en: 'Leader brief' } },
      { view: 'leader-check', label: { ar: 'فحص القرار القيادي', en: 'Leader judgment check' } },
      { view: 'leader-team', label: { ar: 'رادار الفريق', en: 'Team radar' } },
      { view: 'adoption', label: { ar: 'دليل التبني المؤسسي', en: 'Institutional adoption guide' } },
    ],
  },
  {
    id: 'work',
    view: 'work',
    nav: { ar: 'تحوّل العمل الحكومي', en: 'Changing work' },
    title: { ar: 'تحوّل العمل الحكومي', en: 'How government work is changing' },
    views: ['work', 'work-shifts', 'future-skills', 'tech-radar'],
    items: [
      { view: 'work-shifts', label: { ar: 'خريطة تحوّل المهام', en: 'Task-shift map' } },
      { view: 'future-skills', label: { ar: 'مهارات 2030', en: 'Skills for 2030' } },
      { view: 'tech-radar', label: { ar: 'تقنيات تغيّر العمل الحكومي', en: 'Technologies changing government work' } },
    ],
  },
  {
    id: 'roles',
    view: 'roles-hub',
    nav: { ar: 'الأدوار والمهارات', en: 'Roles & skills' },
    title: { ar: 'الأدوار والمهارات', en: 'Roles & skills' },
    views: ['roles-hub', 'roles', 'role', 'skills'],
    items: [
      { view: 'roles', label: { ar: 'الأدوار', en: 'Roles' } },
      { view: 'skills', label: { ar: 'قاموس المهارات', en: 'Skills dictionary' } },
    ],
  },
  {
    id: 'sectors',
    view: 'entities',
    nav: { ar: 'الجهات والقطاعات', en: 'Entities & sectors' },
    title: { ar: 'الجهات والقطاعات', en: 'Entities & sectors' },
    views: ['entities', 'sectors', 'sector', 'services', 'directory', 'entity'],
    items: [
      { view: 'sectors', label: { ar: 'القطاعات الحكومية', en: 'Government sectors' } },
      { view: 'services', label: { ar: 'سجل خدمات التمكين', en: 'Enablement service record' } },
      { view: 'directory', label: { ar: 'دليل الجهات', en: 'Entity directory' } },
    ],
  },
  {
    id: 'method',
    view: 'method-hub',
    nav: { ar: 'المنهجية والمصادر', en: 'Method & sources' },
    title: { ar: 'المنهجية والمصادر', en: 'Method & sources' },
    views: ['method-hub', 'methodology', 'evidence', 'standards', 'about'],
    items: [
      { view: 'methodology', label: { ar: 'المنهجية', en: 'Methodology' } },
      { view: 'evidence', label: { ar: 'سجل الأدلة', en: 'Evidence register' } },
      { view: 'standards', label: { ar: 'المعايير والتقارير', en: 'Standards & reports' } },
      { view: 'about', label: { ar: 'عن المفهوم', en: 'About the concept' } },
    ],
  },
]

export function hubForView(view: View): Hub | undefined {
  return hubs.find((h) => h.views.includes(view))
}

/** The views that are the assessment journey itself (no sticky «start» button there). */
export const ASSESS_VIEWS: View[] = ['wizard', 'results', 'pathways', 'report']

export const SOON: L = { ar: 'قريباً', en: 'Coming soon' }

const monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/**
 * ISO date → «22 أكتوبر 2026» / "22 October 2026": Gregorian, Western digits, no Intl calendar surprises.
 * Kept here (not imported from Claim.tsx) so the always-loaded shell does not pull in the claims registry.
 */
export function formatDay(iso: string, lang: 'ar' | 'en'): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  const month = (lang === 'ar' ? monthsAr : monthsEn)[Number(m[2]) - 1]
  return month ? `${Number(m[3])} ${month} ${m[1]}` : iso
}
