import type { Role } from './types'

/**
 * Role target profiles — drive the "target" polygon on the radar
 * and the pathway priorities.
 */
export const roles: Role[] = [
  {
    id: 'generalist',
    name: { ar: 'موظف حكومي عام', en: 'Generalist Government Employee' },
    description: {
      ar: 'تستخدم الأدوات الرقمية وتتعامل مع الخدمات الحكومية في عملك اليومي. الهدف: مستوى «تطبيق» في كل المجالات، و«ممارس» في القيادة وتصميم الخدمات.',
      en: 'You use digital tools and interact with government services in daily work. Target: “Working” across all domains, “Practitioner” in leadership and service design.',
    },
    targets: {
      'ai-data': 2,
      cyber: 2,
      cloud: 2,
      'service-design': 3,
      policy: 2,
      agile: 2,
      emerging: 2,
      leadership: 3,
    },
  },
  {
    id: 'specialist',
    name: { ar: 'أخصائي رقمي', en: 'Digital Specialist' },
    description: {
      ar: 'تعمل في مجال رقمي متخصص (بيانات، أمن، بنية تحتية، تطوير منتجات). الهدف: مستوى «ممارس» في عائلة مجالك التقنية، و«تطبيق» في بقية المجالات.',
      en: 'You work in a specialist digital field (data, security, infrastructure, product delivery). Target: “Practitioner” in your technical domain family, “Working” elsewhere.',
    },
    targets: {
      'ai-data': 3,
      cyber: 3,
      cloud: 3,
      'service-design': 2,
      policy: 2,
      agile: 3,
      emerging: 2,
      leadership: 2,
    },
  },
  {
    id: 'leader',
    name: { ar: 'قائد رقمي', en: 'Digital Leader' },
    description: {
      ar: 'تقود التحول الرقمي والفرق والقرارات الاستراتيجية. الهدف: مستوى «خبير» في السياسات والقيادة، و«ممارس» في معظم المجالات الأخرى.',
      en: 'You lead digital transformation, teams and strategic decisions. Target: “Expert” in policy and leadership, “Practitioner” across most other domains.',
    },
    targets: {
      'ai-data': 3,
      cyber: 2,
      cloud: 2,
      'service-design': 3,
      policy: 4,
      agile: 3,
      emerging: 3,
      leadership: 4,
    },
  },
]

export const roleById = (id: string): Role | undefined => roles.find((r) => r.id === id)
