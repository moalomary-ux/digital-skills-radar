import { describe, expect, it } from 'vitest'
// @ts-ignore: plain Node ESM script without type declarations (scripts/content-lint.mjs)
import * as lintModule from '../../scripts/content-lint.mjs'

interface Violation {
  file: string
  line: number
  rule: 'eastern-digits' | 'banned-term' | 'empty-translation' | 'arabic-in-en'
  message: string
  excerpt: string
}
interface LintApi {
  lintText: (text: string, file?: string) => Violation[]
  runContentLint: (opts?: { files?: string[] }) => { files: string[]; violations: Violation[] }
  BANNED_TERMS: { label: string; pattern: RegExp; fix: string }[]
  EN_ARABIC_ALLOW: string[]
  STRICT: boolean
}
const lint = lintModule as unknown as LintApi

/** Files owned by packet P5a: the lint must be green on all of them. */
const P5A_FILES = [
  'src/components/Claim.tsx',
  'src/views/Evidence.tsx',
  'src/views/Methodology.tsx',
  'src/views/Standards.tsx',
  'src/data/standards.ts',
  'src/data/claims/types.ts',
  'src/data/claims/standards.ts',
  'src/data/claims/method.ts',
]

const rules = (text: string) => lint.lintText(text, 'fixture.ts').map((v) => v.rule)

describe('content-lint: rules', () => {
  it('flags Eastern Arabic digits', () => {
    const text = `const a = { ar: 'العدد ${String.fromCharCode(0x0663)}', en: 'the count 3' }`
    expect(rules(text)).toContain('eastern-digits')
    expect(rules(`const p = '${String.fromCharCode(0x06f5)}'`)).toContain('eastern-digits')
  })

  it('flags every banned term from the glossary', () => {
    const samples: Record<string, string> = {
      'قيّس': 'قيّس مهاراتك',
      'تخطيط العدو / مراجعة العدو': 'اجتماع تخطيط العدو',
      'يندثر / مندثر': 'ما يزدهر وما يندثر',
      'البنفسجي': 'المضلع البنفسجي',
      '20 دورًا': 'مكتبة الأدوار (20 دورًا)',
      'عشرون دورًا': 'عشرون دورًا مرجعيًا',
      '170M / 92M / 78M': '170M new jobs',
      'معايرة معرفية': 'أسئلة المعايرة المعرفية',
      'أثر تمكين': 'أثر تمكين الجهات',
      'إجمالي الاستفادة': 'إجمالي الاستفادة 10,788',
      Qudratok: 'Qudratok Program',
      'Qudrat-Tech': 'QTech (Qudrat-Tech)',
      'يقيس موقعك': 'يقيس موقعك بدقة',
      'تسعون يومك': 'تسعون يومك القادمة',
      'و4 خدمة أخرى': 'تفعيل الهوية (2)؛ و4 خدمة أخرى',
      'أرقام موثقة من سجلات': 'أرقام موثقة من سجلات رسمية',
      'فجوة مقاسة': 'فجوة مقاسة في المجال',
      'الذكاء التوليدي': 'أدوات الذكاء التوليدي',
      'نامٍ': 'المرحلة: نامٍ',
      'التسليم الرشيق': 'المنتجات الرقمية والتسليم الرشيق',
      'أجايل': 'منهجية أجايل',
      'الرسوم البيانية المعرفية': 'الرسوم البيانية المعرفية والويب الدلالي',
      'التشفير المتماثل': 'الحوسبة السرية والتشفير المتماثل',
      'كشّاف التقنيات': 'كشّاف التقنيات الناشئة',
    }
    for (const term of lint.BANNED_TERMS) {
      const sample = samples[term.label]
      expect(sample, `missing fixture for banned term ${term.label}`).toBeTruthy()
      const found = lint.lintText(`const x = { ar: '${sample}', en: 'x' }`, 'f.ts').filter((v) => v.rule === 'banned-term')
      expect(found.length, `banned term not detected: ${term.label}`).toBeGreaterThan(0)
    }
  })

  it('accepts the approved forms', () => {
    const approved = [
      'قِس مهاراتك',
      'تخطيط السبرنت ومراجعة السبرنت',
      'مهام تتراجع',
      'المضلع المستهدف',
      'مكتبة الأدوار (24 دورًا)',
      '170 مليون وظيفة',
      'تحقق معرفي',
      'سجل خدمات التمكين',
      'يساعدك على استكشاف أولويات تطويرك',
      'خطتك للأيام الـ90 المقبلة',
      'وخدمة أخرى، وخدمتان أخريان، و4 خدمات أخرى',
      'أولوية تطوير مقترحة',
      'الذكاء الاصطناعي التوليدي',
      'أنظمة محصّنة واختبار الاختراق',
      'إدارة المنتجات الرقمية والنهج المرن',
      'العمل بالنهج المرن (Agile)',
      'المخططات المعرفية والتشغيل البيني الدلالي',
      'الحوسبة السرية والتشفير المتجانس',
      'أخصائي رصد التقنيات الناشئة',
      'استكشاف التقنيات الناشئة',
    ]
    for (const a of approved) expect(lint.lintText(`const x = { ar: '${a}', en: 'ok' }`, 'f.ts'), a).toEqual([])
  })

  it('ignores banned terms on comment lines', () => {
    expect(rules(`// replaced «يندثر» with «يتراجع»\n * note: قيّس was a typo`)).toEqual([])
  })

  it('flags empty translations', () => {
    expect(rules(`const a = { ar: '', en: 'x' }`)).toEqual(['empty-translation'])
    expect(rules(`const a = { ar: 'نص', en: "" }`)).toEqual(['empty-translation'])
    expect(rules('const a = { ar: `نص`, en: `  ` }')).toEqual(['empty-translation'])
  })

  it('flags Arabic inside an en string, except allow-listed proper nouns and ${} expressions', () => {
    expect(rules(`const a = { ar: 'نص', en: 'a mixed نص string' }`)).toEqual(['arabic-in-en'])
    expect(rules(`const a = { ar: 'نص', en: 'records of «برنامج قدراتك»' }`)).toEqual([])
    expect(rules('const a = { ar: `${x.ar}`, en: `${x.ar} and more` }')).toEqual([])
  })

  it('reports the right line', () => {
    const v = lint.lintText(`line one\nline two\nconst x = { ar: 'قيّس', en: 'measure' }\n`, 'f.ts')
    expect(v).toHaveLength(1)
    expect(v[0].line).toBe(3)
    expect(v[0].file).toBe('f.ts')
  })
})

describe('content-lint: the codebase', () => {
  it('P5a files are clean', () => {
    const { files, violations } = lint.runContentLint({ files: P5A_FILES })
    expect(files).toHaveLength(P5A_FILES.length)
    expect(violations.map((v) => `${v.file}:${v.line} [${v.rule}] ${v.message}`)).toEqual([])
  })

  it('other files: reported as warnings (fail only with CONTENT_LINT_STRICT=1)', () => {
    const { files, violations } = lint.runContentLint()
    expect(files.length).toBeGreaterThan(P5A_FILES.length)
    const others = violations.filter((v) => !P5A_FILES.includes(v.file))
    if (others.length) {
      const perFile = new Map<string, number>()
      for (const v of others) perFile.set(v.file, (perFile.get(v.file) ?? 0) + 1)
      console.warn(
        `[content-lint] ${others.length} violation(s) outside P5a, in ${perFile.size} file(s):\n` +
          [...perFile.entries()].map(([f, n]) => `  ${f}: ${n}`).join('\n')
      )
    }
    if (lint.STRICT) expect(others).toEqual([])
  })
})
