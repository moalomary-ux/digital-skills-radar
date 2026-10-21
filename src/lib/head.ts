import { useEffect } from 'react'
import type { L, Lang } from '../data/types'
import { libraryRoleById } from '../data/roleLibrary'
import type { View } from '../store'
import { pathFor, routeFromPath } from './routes'

export const SITE_URL = 'https://omary.me'
export const SITE_NAME: L = { ar: 'رادار المهارات الرقمية', en: 'Digital Skills Radar' }
export const OG_IMAGE_PATH = '/og/default.png'

export const pageTitles: Record<View, L> = {
  home: { ar: 'الرئيسية', en: 'Home' },
  wizard: { ar: 'تقييم المهارات', en: 'Skills Assessment' },
  results: { ar: 'نتائج التقييم', en: 'Assessment Results' },
  pathways: { ar: 'خطة التطوير', en: 'Development Plan' },
  roles: { ar: 'الأدوار', en: 'Roles' },
  skills: { ar: 'سجل المهارات', en: 'Skill Registry' },
  'future-skills': { ar: 'مهارات المستقبل', en: 'Future Skills' },
  'tech-radar': { ar: 'رادار التقنيات', en: 'Technology Radar' },
  entities: { ar: 'الجهات', en: 'Entities' },
  impact: { ar: 'الأثر', en: 'Impact' },
  sectors: { ar: 'القطاعات', en: 'Sectors' },
  directory: { ar: 'دليل الجهات', en: 'Entity Directory' },
  entity: { ar: 'تفاصيل الجهة', en: 'Entity Details' },
  standards: { ar: 'المعايير', en: 'Standards' },
  methodology: { ar: 'المنهجية', en: 'Methodology' },
  evidence: { ar: 'سجل الأدلة', en: 'Evidence register' },
  about: { ar: 'عن المفهوم', en: 'About the concept' },
  report: { ar: 'ورقة حوار التطوير', en: 'Development conversation sheet' },
  services: { ar: 'سجل خدمات التمكين', en: 'Enablement service record' },
  sector: { ar: 'موجز احتياج القطاع', en: 'Sector capability brief' },
  leaders: { ar: 'للقادة والفرق', en: 'Leaders & teams' },
  'leader-brief': { ar: 'الموجز القيادي', en: 'Leader brief' },
  'leader-check': { ar: 'فحص القرار القيادي', en: 'Leader judgment check' },
  'leader-team': { ar: 'رادار الفريق', en: 'Team radar' },
  adoption: { ar: 'دليل التبني المؤسسي', en: 'Institutional adoption guide' },
  work: { ar: 'تحوّل العمل الحكومي', en: 'How government work is changing' },
  'work-shifts': { ar: 'خريطة تحوّل المهام', en: 'Task-shift map' },
  role: { ar: 'ورقة الدور', en: 'Role sheet' },
  'roles-hub': { ar: 'الأدوار والمهارات', en: 'Roles & skills' },
  'method-hub': { ar: 'المنهجية والمصادر', en: 'Method & sources' },
  'not-found': { ar: 'الصفحة غير موجودة', en: 'Page Not Found' },
}

/** One or two sentences per view (70–160 characters) describing what the page offers. */
export const pageDescriptions: Record<View, L> = {
  home: {
    ar: 'رادار المهارات الرقمية: مفهوم مستقل يساعدك على قياس مهاراتك الرقمية مقابل متطلبات دورك الحكومي، وبناء خطة تطوير عملية.',
    en: 'Digital Skills Radar: an independent concept for measuring your digital skills against your government role and building a practical development plan.',
  },
  wizard: {
    ar: 'تقييم ذاتي قصير لمهاراتك الرقمية حسب مجالات العمل الحكومي، مع أسئلة معايرة وسيناريوهات عملية تكشف أين تقف مقارنة بدورك.',
    en: 'A short self-assessment of your digital skills across government work domains, with calibration questions and practical scenarios tied to your role.',
  },
  results: {
    ar: 'نتائج تقييمك: مستواك في كل مجال مقارنة بالمستوى المستهدف لدورك، وأبرز الفجوات ونقاط القوة التي تستحق التركيز.',
    en: 'Your assessment results: your level in each domain against the target for your role, with the gaps and strengths worth your attention.',
  },
  pathways: {
    ar: 'خطة تطوير شخصية مبنية على نتائج تقييمك: أولويات واضحة، وخطوات تعلم عملية، ومصادر مقترحة لكل فجوة.',
    en: 'A personal development plan built from your results: clear priorities, practical learning steps and suggested resources for each gap.',
  },
  roles: {
    ar: 'مكتبة الأدوار الحكومية الرقمية: لكل دور مهمته ومسؤولياته والمستويات المستهدفة في كل مجال مهارة، لتختار الدور الأقرب إليك.',
    en: 'A library of digital government roles: each role’s mission, responsibilities and target skill levels per domain, so you can pick the closest match.',
  },
  skills: {
    ar: 'سجل المهارات: تعريف واضح لكل مهارة رقمية، ومستوياتها، وما يعنيه كل مستوى عملياً في العمل الحكومي.',
    en: 'The skill registry: a clear definition of each digital skill, its levels and what each level means in practice for government work.',
  },
  'future-skills': {
    ar: 'مهارات المستقبل: المهارات الرقمية التي يتزايد الطلب عليها في العمل الحكومي، ولماذا تهم، وكيف تبدأ ببنائها.',
    en: 'Future skills: the digital skills gaining demand in government work, why they matter and how to start building them.',
  },
  'tech-radar': {
    ar: 'رادار التقنيات: نظرة على التقنيات الناشئة ومدى نضجها وأثرها على العمل الحكومي، مع ما يلزم من مهارات لكل منها.',
    en: 'Technology radar: a view of emerging technologies, their maturity and impact on government work, and the skills each one calls for.',
  },
  explore: {
    ar: 'خريطة المهارات: استعراض تفاعلي لمجالات المهارات الرقمية وترابطها، لتفهم الصورة الكاملة قبل اختيار ما تطوره.',
    en: 'Skills map: an interactive view of digital skill domains and how they connect, to see the whole picture before choosing what to develop.',
  },
  careers: {
    ar: 'المسارات المهنية الرقمية في العمل الحكومي: ما يتطلبه كل مسار من مهارات، وكيف تنتقل بينها خطوة بخطوة.',
    en: 'Digital career paths in government: the skills each path requires and how to move between them step by step.',
  },
  lists: {
    ar: 'الاتجاهات المهنية: قراءة في الأدوار والمهارات الرقمية الصاعدة في القطاع الحكومي وما يتغير في طبيعة العمل.',
    en: 'Career trends: a reading of the rising digital roles and skills in the public sector and what is changing in the nature of work.',
  },
  decide: {
    ar: 'التوجيه المهني: أسئلة قصيرة تساعدك على اختيار المسار الرقمي الأنسب لاهتماماتك وخبرتك وظروف عملك.',
    en: 'Career guidance: short questions that help you choose the digital path that best fits your interests, experience and work context.',
  },
  entities: {
    ar: 'الجهات الحكومية ومهاراتها الرقمية: نظرة عامة على توزيع الاحتياج والمهارات عبر الجهات والقطاعات.',
    en: 'Government entities and their digital skills: an overview of how needs and skills are distributed across entities and sectors.',
  },
  impact: {
    ar: 'الأثر: كيف تنعكس المهارات الرقمية على جودة الخدمات الحكومية وسرعة الإنجاز وقرارات العمل اليومية.',
    en: 'Impact: how digital skills translate into better government services, faster delivery and sounder everyday work decisions.',
  },
  sectors: {
    ar: 'القطاعات الحكومية: مقارنة الاحتياج من المهارات الرقمية بين القطاعات، وأبرز الفجوات في كل قطاع.',
    en: 'Government sectors: a comparison of digital skill needs across sectors and the main gaps within each one.',
  },
  directory: {
    ar: 'دليل الجهات الحكومية: ابحث عن جهة واطلع على قطاعها وخدماتها واحتياجها من المهارات الرقمية.',
    en: 'Directory of government entities: search for an entity and see its sector, services and digital skill needs.',
  },
  entity: {
    ar: 'تفاصيل الجهة: قطاعها، وخدماتها الرقمية، واحتياجها من المهارات، وما يرتبط بها من أدوار ومسارات.',
    en: 'Entity details: its sector, digital services, skill needs and the roles and paths connected to it.',
  },
  standards: {
    ar: 'المعايير: الأطر والمراجع التي يستند إليها الرادار في تعريف المهارات ومستوياتها، وكيف جرى تكييفها للعمل الحكومي.',
    en: 'Standards: the frameworks and references the radar relies on to define skills and levels, and how they were adapted for government work.',
  },
  methodology: {
    ar: 'المنهجية: كيف يقيس الرادار المهارات، وكيف تُحدد المستويات المستهدفة لكل دور، وما حدود هذا القياس.',
    en: 'Methodology: how the radar measures skills, how target levels are set for each role, and the limits of that measurement.',
  },
  evidence: {
    ar: 'سجل الأدلة: مصدر كل رقم وادعاء يعرضه الرادار، مع حدود استخدامه، لتراجعه بنفسك قبل الاعتماد عليه.',
    en: 'Evidence register: the source behind every figure and claim the radar shows, with its limits, so you can check it before relying on it.',
  },
  about: {
    ar: 'عن المفهوم: ما هو رادار المهارات الرقمية، ولمن صُمم، وما الذي يقدمه وما لا يدعيه.',
    en: 'About the concept: what Digital Skills Radar is, who it is designed for, and what it offers and does not claim.',
  },
  report: {
    ar: 'ورقة حوار التطوير: ملخص من صفحة واحدة لنتائجك وأولوياتك، جاهز لمناقشته مع مديرك أو فريقك.',
    en: 'Development conversation sheet: a one-page summary of your results and priorities, ready to discuss with your manager or team.',
  },
  services: {
    ar: 'سجل خدمات التمكين: البرامج والخدمات التي تساعد الموظف الحكومي على بناء مهاراته الرقمية، ولمن تناسب.',
    en: 'Enablement service record: the programmes and services that help government staff build digital skills, and who each one suits.',
  },
  sector: {
    ar: 'موجز احتياج القطاع: المهارات الرقمية الأكثر طلباً في هذا القطاع، وأبرز الفجوات، والأدوار المرتبطة بها.',
    en: 'Sector capability brief: the digital skills most needed in this sector, its main gaps and the roles connected to them.',
  },
  leaders: {
    ar: 'للقادة والفرق: أدوات تساعد القائد على قراءة مهارات فريقه الرقمية، وتوجيه قرارات التطوير والتوظيف.',
    en: 'For leaders and teams: tools that help a leader read the team’s digital skills and guide development and hiring decisions.',
  },
  'leader-brief': {
    ar: 'الموجز القيادي: ما يحتاج القائد الحكومي معرفته عن المهارات الرقمية لفريقه في دقائق، وبلغة غير تقنية.',
    en: 'Leader brief: what a government leader needs to know about the team’s digital skills, in minutes and in non-technical language.',
  },
  'leader-check': {
    ar: 'فحص القرار القيادي: مواقف عملية قصيرة تختبر حكمك في قرارات التحول الرقمي، مع قراءة لما يعنيه كل اختيار.',
    en: 'Leader judgment check: short practical situations that test your judgment in digital transformation decisions, with a reading of each choice.',
  },
  'leader-team': {
    ar: 'رادار الفريق: اجمع رموز نتائج أعضاء فريقك لترى توزيع المهارات، والتغطية مقابل المستهدف، وأولويات التطوير المشتركة.',
    en: 'Team radar: combine your team members’ result codes to see skill distribution, coverage against targets and shared development priorities.',
  },
  adoption: {
    ar: 'دليل التبني المؤسسي: كيف تستخدم الجهة الحكومية الرادار في تخطيط القدرات والتدريب والتوظيف، خطوة بخطوة.',
    en: 'Institutional adoption guide: how a government entity can use the radar for capability planning, training and hiring, step by step.',
  },
  work: {
    ar: 'تحوّل العمل الحكومي: كيف تغيّر التقنيات الرقمية طبيعة المهام الحكومية، وما الذي يبقى بيد الإنسان.',
    en: 'How government work is changing: how digital technologies reshape government tasks, and what remains in human hands.',
  },
  'work-shifts': {
    ar: 'خريطة تحوّل المهام: أي المهام الحكومية تتغير أو تُؤتمت، وأيها يزداد أهمية، وما المهارات المطلوبة لكل تحوّل.',
    en: 'Task-shift map: which government tasks change or get automated, which grow in importance, and the skills each shift requires.',
  },
  role: {
    ar: 'ورقة الدور: مهمة الدور، ومسؤولياته، والمستويات المستهدفة في كل مجال مهارة، مع رابط مباشر لتقييم نفسك عليه.',
    en: 'Role sheet: the role’s mission, responsibilities and target level per skill domain, with a direct link to assess yourself against it.',
  },
  'not-found': {
    ar: 'الصفحة التي طلبتها غير موجودة. عد إلى الصفحة الرئيسية لرادار المهارات الرقمية أو استخدم القوائم للتنقل.',
    en: 'The page you requested does not exist. Return to the Digital Skills Radar home page or use the menus to navigate.',
  },
}

/** Views that show a person's own data: never prerendered, never indexed. */
export const PERSONAL_VIEWS: readonly View[] = ['wizard', 'results', 'pathways', 'report', 'leader-check', 'leader-team']

export function isPersonalView(view: View): boolean {
  return PERSONAL_VIEWS.includes(view)
}

/**
 * Canonical path: pathFor() without any query string and with a trailing slash.
 * GitHub Pages serves dist/<lang>/<path>/index.html and 301-redirects to the slash form,
 * so the slash form is the one search engines should keep.
 */
export function canonicalPath(view: View, lang: Lang, params: Record<string, string> = {}): string {
  const path = pathFor(view, lang, params).split('?')[0].split('#')[0]
  return path.endsWith('/') ? path : `${path}/`
}

export function canonicalUrl(view: View, lang: Lang, params: Record<string, string> = {}): string {
  return SITE_URL + canonicalPath(view, lang, params)
}

export interface AlternateLink {
  hrefLang: 'ar' | 'en' | 'x-default'
  href: string
}

export function alternateLinks(view: View, params: Record<string, string> = {}): AlternateLink[] {
  const ar = canonicalUrl(view, 'ar', params)
  const en = canonicalUrl(view, 'en', params)
  return [
    { hrefLang: 'ar', href: ar },
    { hrefLang: 'en', href: en },
    { hrefLang: 'x-default', href: ar },
  ]
}

export interface HeadData {
  lang: Lang
  dir: 'rtl' | 'ltr'
  title: string
  description: string
  canonical: string
  alternates: AlternateLink[]
  /** 'noindex, nofollow' for personal views and not-found; null otherwise. */
  robots: string | null
  og: {
    title: string
    description: string
    url: string
    image: string
    type: 'website'
    locale: 'ar_SA' | 'en_US'
    siteName: string
  }
  twitterCard: 'summary_large_image'
}

export function headFor(view: View, lang: Lang, params: Record<string, string> = {}): HeadData {
  const site = SITE_NAME[lang]
  let title = `${site} — ${pageTitles[view][lang]}`
  let description = pageDescriptions[view][lang]
  if (view === 'role' && params.roleId) {
    const role = libraryRoleById(params.roleId)
    if (role) {
      const name = role.name[lang]
      title = `${site} — ${name} — ${pageTitles.role[lang]}`
      description = lang === 'ar'
        ? `ورقة دور «${name}»: مهمته ومسؤولياته والمستويات المستهدفة في كل مجال مهارة، مع رابط لتقييم نفسك عليه.`
        : `Role sheet for ${name}: mission, responsibilities and target level per skill domain, with a link to assess yourself against it.`
    }
  }
  const canonical = canonicalUrl(view, lang, params)
  return {
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    title,
    description,
    canonical,
    alternates: alternateLinks(view, params),
    robots: isPersonalView(view) || view === 'not-found' ? 'noindex, nofollow' : null,
    og: {
      title,
      description,
      url: canonical,
      image: SITE_URL + OG_IMAGE_PATH,
      type: 'website',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      siteName: site,
    },
    twitterCard: 'summary_large_image',
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type TagSpec = { tag: 'meta' | 'link'; key: Record<string, string>; attrs: Record<string, string> }

/** The tag list shared by the server renderer and the browser upsert, in output order. */
function headTagSpecs(head: HeadData): TagSpec[] {
  const specs: TagSpec[] = [
    { tag: 'meta', key: { name: 'description' }, attrs: { content: head.description } },
    { tag: 'link', key: { rel: 'canonical' }, attrs: { href: head.canonical } },
    ...head.alternates.map<TagSpec>((alt) => ({
      tag: 'link',
      key: { rel: 'alternate', hreflang: alt.hrefLang },
      attrs: { href: alt.href },
    })),
    { tag: 'meta', key: { property: 'og:title' }, attrs: { content: head.og.title } },
    { tag: 'meta', key: { property: 'og:description' }, attrs: { content: head.og.description } },
    { tag: 'meta', key: { property: 'og:url' }, attrs: { content: head.og.url } },
    { tag: 'meta', key: { property: 'og:image' }, attrs: { content: head.og.image } },
    { tag: 'meta', key: { property: 'og:type' }, attrs: { content: head.og.type } },
    { tag: 'meta', key: { property: 'og:locale' }, attrs: { content: head.og.locale } },
    { tag: 'meta', key: { property: 'og:site_name' }, attrs: { content: head.og.siteName } },
    { tag: 'meta', key: { name: 'twitter:card' }, attrs: { content: head.twitterCard } },
  ]
  if (head.robots) specs.push({ tag: 'meta', key: { name: 'robots' }, attrs: { content: head.robots } })
  return specs
}

function selectorFor(spec: TagSpec): string {
  return spec.tag + Object.entries(spec.key).map(([k, v]) => `[${k}="${v}"]`).join('')
}

/** HTML for the <head>: every tag carries data-head so a prerendered page can be updated in place. */
export function renderHeadTags(head: HeadData): string {
  const lines = [`<title data-head>${escapeHtml(head.title)}</title>`]
  for (const spec of headTagSpecs(head)) {
    const attrs = Object.entries({ ...spec.key, ...spec.attrs })
      .map(([k, v]) => `${k}="${escapeHtml(v)}"`)
      .join(' ')
    lines.push(`<${spec.tag} ${attrs} data-head>`)
  }
  return lines.join('\n')
}

/** Browser side: set document.title and upsert the same tags; idempotent and safe without a DOM. */
export function applyHead(head: HeadData): void {
  if (typeof document === 'undefined') return
  try {
    document.title = head.title
    const container = document.head
    if (!container) return
    for (const spec of headTagSpecs(head)) {
      let el = container.querySelector(selectorFor(spec))
      if (!el) {
        el = document.createElement(spec.tag)
        for (const [k, v] of Object.entries(spec.key)) el.setAttribute(k, v)
        container.appendChild(el)
      }
      for (const [k, v] of Object.entries(spec.attrs)) {
        if (el.getAttribute(k) !== v) el.setAttribute(k, v)
      }
      if (!el.hasAttribute('data-head')) el.setAttribute('data-head', '')
    }
    if (!head.robots) container.querySelectorAll('meta[name="robots"]').forEach((el) => el.remove())
  } catch {
    // A broken or partial DOM must never take the page down with it.
  }
}

/** Route params that affect the head (today only the role id changes the title). */
function headParamsFromPath(pathname: string): Record<string, string> {
  const route = routeFromPath(pathname)
  const params: Record<string, string> = {}
  if (route.roleId) params.roleId = route.roleId
  if (route.sectorId) params.sectorId = route.sectorId
  if (route.entityId) params.entityId = route.entityId
  return params
}

export function usePageTitle(view: View, lang: Lang) {
  // Read during render so moving between two role pages (same view, same lang) still re-applies the head.
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  useEffect(() => {
    applyHead(headFor(view, lang, headParamsFromPath(pathname)))
  }, [view, lang, pathname])
}
