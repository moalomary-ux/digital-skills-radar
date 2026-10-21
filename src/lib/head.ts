import { useEffect } from 'react'
import type { L, Lang } from '../data/types'
import type { View } from '../store'

export const pageTitles: Record<View, L> = {
  home: { ar: 'الرئيسية', en: 'Home' },
  wizard: { ar: 'تقييم المهارات', en: 'Skills Assessment' },
  results: { ar: 'نتائج التقييم', en: 'Assessment Results' },
  pathways: { ar: 'خطة التطوير', en: 'Development Plan' },
  roles: { ar: 'الأدوار', en: 'Roles' },
  skills: { ar: 'سجل المهارات', en: 'Skill Registry' },
  'future-skills': { ar: 'مهارات المستقبل', en: 'Future Skills' },
  'tech-radar': { ar: 'رادار التقنيات', en: 'Technology Radar' },
  explore: { ar: 'خريطة المهارات', en: 'Skills Map' },
  careers: { ar: 'المسارات المهنية', en: 'Careers' },
  lists: { ar: 'الاتجاهات المهنية', en: 'Career Trends' },
  decide: { ar: 'التوجيه المهني', en: 'Career Guidance' },
  entities: { ar: 'الجهات', en: 'Entities' },
  impact: { ar: 'الأثر', en: 'Impact' },
  sectors: { ar: 'القطاعات', en: 'Sectors' },
  directory: { ar: 'دليل الجهات', en: 'Entity Directory' },
  entity: { ar: 'تفاصيل الجهة', en: 'Entity Details' },
  standards: { ar: 'المعايير', en: 'Standards' },
  methodology: { ar: 'المنهجية', en: 'Methodology' },
  'not-found': { ar: 'الصفحة غير موجودة', en: 'Page Not Found' },
}

export function usePageTitle(view: View, lang: Lang) {
  useEffect(() => {
    const site = lang === 'ar' ? 'رادار المهارات الرقمية' : 'Digital Skills Radar'
    document.title = `${site} — ${pageTitles[view][lang]}`
  }, [view, lang])
}
