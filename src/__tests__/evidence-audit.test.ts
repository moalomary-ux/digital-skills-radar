// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../store'
import Evidence from '../views/Evidence'
import { claimById, claims } from '../data/claims'
import { isOutdatedSource, referenceSources, SOURCE_CURRENT_FROM } from '../data/claims/sources'

/**
 * Content-evidence audit (reviews/content-evidence-audit-20261022.md) and the owner's source
 * policy (DECISION-20261021 §5-ب): corrected facts stay registered, the evidence register shows
 * each source's year and flags old ones, and the approved reference sources are listed.
 */

const sources = import.meta.glob(['../data/**/*.ts', '../views/**/*.tsx'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const src = (rel: string) => sources[`../${rel}`] ?? ''

const filled = (l?: { ar: string; en: string }) => !!l && l.ar.trim() !== '' && l.en.trim() !== ''

describe('audit: corrected facts are registered claims', () => {
  it('PDPL in force since 14 September 2023, grace period to 14 September 2024', () => {
    const c = claimById('future-pdpl-in-force')!
    expect(c.period).toBe('2023-09-14')
    expect(c.text.ar).toContain('14 سبتمبر 2023')
    expect(c.text.ar).toContain('14 سبتمبر 2024')
    expect(claimById('leaders-pdpl-enforcement')?.value.en).toBe('September 2024')
  })

  it('legal research hallucination rates, the agentic AI forecast and the OECD pilots finding carry their sources', () => {
    const legal = claimById('leaders-legal-ai-hallucination')!
    expect(legal.value.en).toBe('17–33%')
    expect(legal.source.year).toBe(2025)
    expect(legal.source.publisher.en).toContain('Journal of Empirical Legal Studies')
    expect(claimById('future-gartner-agentic-cancel')?.source.publisher.en).toBe('Gartner')
    expect(claimById('future-oecd-2025-ai-pilots')?.source.year).toBe(2025)
    expect(claimById('leaders-gds-product-teams')?.source.url).toBe('https://www.gov.uk/service-manual/service-standard')
  })

  it('the 2,918 consulting services belong to «منصة الاستشارات والدراسات», not the training program', () => {
    const c = claimById('method-gov-consulting-register')!
    expect(c.text.ar).toContain('منصة الاستشارات والدراسات')
    expect(c.source.title.ar).toContain('منصة الاستشارات والدراسات')
    expect(claimById('method-gov-training-register')?.source.title.ar).toContain('برنامج قدراتك')
  })

  it('the unsupported wording from the audit is gone', () => {
    const futureSkills = src('data/futureSkills.ts')
    expect(futureSkills).not.toContain('سريان نظام حماية البيانات الشخصية (2024)')
    expect(futureSkills).not.toContain('منذ سبتمبر 2024 يجعل')
    expect(futureSkills).not.toContain('يتطلب ملّاكًا معيّنين')
    expect(futureSkills).not.toContain('إلى التشغيل الحكومي الفعلي')
    expect(futureSkills).not.toContain('أولوية حكومية معلنة')
    expect(src('data/workShifts.ts')).not.toContain('حق الاعتراض')
    const tech = src('data/technologies.ts')
    expect(tech).not.toContain('كنفاذ وأبشر')
    expect(tech).not.toContain('موثقة في my.gov.sa')
    expect(tech).not.toContain('مراكز العمليات الأمنية الحكومية الخليجية')
    expect(src('data/leaders/shifts.ts')).toContain("claimId: 'leaders-gds-product-teams'")
  })

  it('editorial wording in the leader brief points at registered editorial claims', () => {
    for (const id of ['leaders-editorial-decisions', 'leaders-editorial-questions', 'leaders-editorial-role-tasks']) {
      const c = claimById(id)
      expect(c?.kind, id).toBe('editorial')
      expect(c?.confidence, id).toBe('low')
    }
    expect(src('views/leaders/LeaderBrief.tsx')).toContain('leaders-editorial-decisions')
    expect(src('views/leaders/LeaderBrief.tsx')).toContain('leaders-editorial-questions')
  })
})

describe('audit: approved reference sources', () => {
  it('lists 25 complete, current, https sources with unique ids', () => {
    expect(referenceSources).toHaveLength(25)
    expect(new Set(referenceSources.map((s) => s.id)).size).toBe(referenceSources.length)
    for (const s of referenceSources) {
      expect(s.id, s.id).toMatch(/^ref-[a-z0-9-]+$/)
      expect(filled(s.title) && filled(s.publisher) && filled(s.covers), s.id).toBe(true)
      expect(s.url, s.id).toMatch(/^https:\/\//)
      expect(s.year !== undefined || s.yearLabel !== undefined, s.id).toBe(true)
      expect(isOutdatedSource(s.year), s.id).toBe(false)
      expect(/[٠-٩۰-۹]/.test(JSON.stringify(s)), s.id).toBe(false)
    }
  })

  it('flags only known years before the currency year', () => {
    expect(SOURCE_CURRENT_FROM).toBe(2023)
    expect(isOutdatedSource(2020)).toBe(true)
    expect(isOutdatedSource(2023)).toBe(false)
    expect(isOutdatedSource(undefined)).toBe(false)
  })
})

describe('audit: the evidence register shows source years (jsdom)', () => {
  afterEach(() => {
    cleanup()
    localStorage.clear()
  })

  const renderEvidence = (lang: 'ar' | 'en') => {
    localStorage.setItem('dsr-lang', JSON.stringify(lang))
    return render(createElement(MemoryRouter, { initialEntries: [`/${lang}/evidence`] }, createElement(AppProvider, null, createElement(Evidence))))
  }

  it('Arabic: a source-year column, «قديم — يُحدَّث» on every old source, and the reference table at the end', () => {
    const { container } = renderEvidence('ar')
    const headers = [...container.querySelectorAll('th[aria-sort]')].map((th) => th.textContent ?? '')
    expect(headers.some((h) => h.includes('سنة المصدر'))).toBe(true)
    const outdated = claims.filter((c) => isOutdatedSource(c.source.year))
    expect(outdated.length).toBeGreaterThan(0)
    for (const c of outdated) expect(container.querySelector(`#ev-${c.id}`)?.textContent, c.id).toContain('قديم — يُحدَّث')
    const current = claims.find((c) => typeof c.source.year === 'number' && !isOutdatedSource(c.source.year))!
    expect(container.querySelector(`#ev-${current.id}`)?.textContent).not.toContain('قديم — يُحدَّث')
    expect(container.querySelector(`#ev-${current.id}`)?.textContent).toContain(String(current.source.year))
    const refs = container.querySelector('section[aria-labelledby="ev-refs"]')!
    expect(refs.querySelector('h2')?.textContent).toBe('المصادر المرجعية المعتمدة')
    expect(refs.querySelectorAll('tbody tr').length).toBe(referenceSources.length)
    expect(/[٠-٩]/.test(refs.textContent ?? '')).toBe(false)
  })

  it('English: the reference table is in English', () => {
    const { container } = renderEvidence('en')
    const refs = container.querySelector('section[aria-labelledby="ev-refs"]')!
    expect(refs.querySelector('h2')?.textContent).toBe('Approved reference sources')
    expect(/[؀-ۿ]/.test(refs.textContent ?? '')).toBe(false)
  })
})
