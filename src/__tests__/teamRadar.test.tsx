import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { AppProvider } from '../store'
import TeamRadar from '../views/leaders/TeamRadar'
import { CODE_DOMAINS, encodeResult, formatCode } from '../lib/resultCode'

/**
 * The global route table wires /:lang/leaders/team after delivery; this suite mounts the view on a
 * local route table with the real AppProvider, so it does not depend on that wiring.
 */
const localRoutes: RouteObject[] = [
  {
    element: (
      <AppProvider>
        <main id="main">
          <Outlet />
        </main>
      </AppProvider>
    ),
    children: [
      { path: 'ar/leaders/team', element: <TeamRadar /> },
      { path: 'en/leaders/team', element: <TeamRadar /> },
    ],
  },
]

const routers: ReturnType<typeof createMemoryRouter>[] = []
function renderAt(url: string) {
  const router = createMemoryRouter(localRoutes, { initialEntries: [url] })
  routers.push(router)
  render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)
  return router
}

beforeEach(() => sessionStorage.clear())
afterEach(() => routers.splice(0).forEach((r) => r.dispose()))

/** 12 synthetic codes dated this month (so none is old), with varied scores and scenarios. */
function synthCodes(count: number, offset = 0): string[] {
  const date = new Date().toISOString()
  return Array.from({ length: count }, (_, k) => {
    const scores: Record<string, number> = {}
    const scenario: Record<string, number> = {}
    CODE_DOMAINS.forEach((id, i) => {
      scores[id] = ((k + i + offset) % 9) / 2
      if ((k + i) % 3 !== 0) scenario[id] = (k + 2 * i) % 4
    })
    return encodeResult({ v: 2, trackId: k % 4 === 0 ? 'specialist' : 'applied', scores, scenario, date })
  })
}

const CODES = synthCodes(12)

/** All visible text except what the visitor typed into the input boxes. */
function textOutsideInputs(): string {
  const clone = document.body.cloneNode(true) as HTMLElement
  clone.querySelectorAll('textarea, input').forEach((el) => el.remove())
  return clone.textContent ?? ''
}

describe('team radar view (/ar/leaders/team)', () => {
  it('renders the page with the banner, the privacy statement and the gate when empty', async () => {
    renderAt('/ar/leaders/team')
    expect(await screen.findByRole('heading', { level: 1, name: 'رادار الفريق' })).toBeInTheDocument()
    expect(screen.getAllByText('للتخطيط التطويري فقط — ليس تقييماً للأداء').length).toBeGreaterThan(0)
    expect(screen.getByText(/لا يُرسل أي رمز إلى أي جهة/)).toBeInTheDocument()
    expect(screen.getByTestId('team-gate')).toBeInTheDocument()
  })

  it('4 codes → the bilingual gate message, and nothing else', async () => {
    renderAt('/ar/leaders/team')
    const box = await screen.findByLabelText('رموز الفريق')
    fireEvent.change(box, { target: { value: CODES.slice(0, 4).join('\n') } })
    const gate = screen.getByTestId('team-gate')
    expect(gate).toHaveTextContent('لا يُعرض شيء حتى يبلغ عدد الرموز الصالحة المختلفة 5')
    expect(gate).toHaveTextContent('المتوفر الآن: 4')
    expect(gate).toHaveTextContent('والمتبقي: 1')
    expect(gate).toHaveTextContent('Nothing is shown until the number of valid, distinct codes reaches 5')
    expect(screen.queryByTestId('team-results')).toBeNull()
    expect(screen.queryByRole('heading', { name: 'توزيع الفريق في كل مجال' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'اطبع ملخص احتياج الفريق' })).toBeNull()
  })

  it('duplicates do not open the gate; the live counters show them', async () => {
    renderAt('/ar/leaders/team')
    const box = await screen.findByLabelText('رموز الفريق')
    fireEvent.change(box, { target: { value: [...CODES.slice(0, 4), formatCode(CODES[0]), CODES[1].toLowerCase(), 'NOT-A-CODE-AT-ALL-XYZ1'].join('\n') } })
    const counters = screen.getAllByRole('definition')
    expect(counters[0]).toHaveTextContent('4') // valid, distinct
    expect(screen.getByText('مكررة').nextSibling).toHaveTextContent('2')
    expect(screen.getByText('غير صالحة').nextSibling).toHaveTextContent('1')
    expect(screen.getByTestId('team-gate')).toBeInTheDocument()
  })

  it('12 codes → distributions and the other views render, with no per-code rows', async () => {
    renderAt('/ar/leaders/team')
    const box = await screen.findByLabelText('رموز الفريق')
    fireEvent.change(box, { target: { value: CODES.map(formatCode).join('\n') } })

    expect(await screen.findByRole('heading', { level: 2, name: 'توزيع الفريق في كل مجال' })).toBeInTheDocument()
    for (const h of ['التغطية مقابل المستهدف الاسترشادي', 'نقاط الفشل المفردة', 'خطر تضخم التقدير الذاتي', 'أولويات التطوير المشتركة المقترحة'])
      expect(screen.getByRole('heading', { level: 2, name: h })).toBeInTheDocument()
    expect(screen.queryByTestId('team-gate')).toBeNull()
    expect(screen.getByTestId('team-results')).toHaveTextContent('12')

    // one focusable row per DOMAIN (8), never one per code (12)
    const results = screen.getByTestId('team-results')
    expect(within(results).getAllByRole('button', { pressed: false }).length + within(results).getAllByRole('button', { pressed: true }).length).toBeGreaterThanOrEqual(8)
    for (const list of Array.from(document.querySelectorAll('ul, ol, tbody'))) expect(list.children.length, list.outerHTML.slice(0, 80)).not.toBe(12)
    for (const tbody of Array.from(document.querySelectorAll('tbody'))) expect(tbody.children.length).toBeLessThanOrEqual(8)

    // no element outside the input box shows a code
    const text = textOutsideInputs()
    for (const c of CODES) {
      expect(text).not.toContain(c)
      expect(text).not.toContain(formatCode(c))
    }
    // the codes live in this tab's sessionStorage only, never in localStorage
    expect(sessionStorage.getItem('dsr-team-a')).toContain(formatCode(CODES[0]))
    for (let i = 0; i < localStorage.length; i++) expect(localStorage.getItem(localStorage.key(i)!) ?? '').not.toContain(CODES[0].slice(0, 10))
  })

  it('hover/focus on a domain shows its summary; the category toggle updates coverage', async () => {
    renderAt('/ar/leaders/team')
    fireEvent.change(await screen.findByLabelText('رموز الفريق'), { target: { value: CODES.join('\n') } })
    const domainBtn = await screen.findByRole('button', { name: 'الأمن السيبراني' })
    act(() => domainBtn.focus())
    expect(domainBtn).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { level: 3, name: 'الأمن السيبراني والثقة الرقمية' })).toBeInTheDocument()
    fireEvent.keyDown(domainBtn, { key: 'ArrowDown' })
    expect(screen.getByRole('button', { name: 'السحابة والبنية' })).toHaveFocus()

    const overview = screen.getByText('المقارنة بمستهدفات فئة').parentElement!
    expect(overview).toHaveTextContent('«تطبيقي»') // the most common category
    fireEvent.click(screen.getByRole('radio', { name: 'تنفيذي' }))
    expect(overview).toHaveTextContent('«تنفيذي»')
    expect(screen.getByRole('radio', { name: 'تنفيذي' })).toBeChecked()
  })

  it('before/after: a second set opens the comparison with a slider and a delta table', async () => {
    renderAt('/ar/leaders/team')
    fireEvent.change(await screen.findByLabelText('رموز الفريق'), { target: { value: CODES.join('\n') } })
    fireEvent.click(screen.getByRole('button', { name: 'أضف مجموعة «بعد البرنامج» للمقارنة' }))
    const after = screen.getByLabelText('بعد البرنامج')
    fireEvent.change(after, { target: { value: synthCodes(4, 3).join('\n') } })
    expect(screen.getByRole('heading', { level: 2, name: 'قبل البرنامج وبعده' })).toBeInTheDocument()
    expect(screen.queryByRole('slider')).toBeNull() // the after set is below the gate
    fireEvent.change(after, { target: { value: synthCodes(12, 3).join('\n') } })
    const slider = await screen.findByRole('slider', { name: 'الانتقال من «قبل» إلى «بعد»' })
    fireEvent.change(slider, { target: { value: '40' } })
    expect(slider).toHaveAttribute('aria-valuetext', 'قبل 60%، بعد 40%')
    const section = screen.getByRole('heading', { level: 2, name: 'قبل البرنامج وبعده' }).closest('section')!
    expect(within(section).getAllByRole('row')).toHaveLength(9) // header + 8 domains
  })

  it('reads codes from an uploaded JSON export', async () => {
    renderAt('/ar/leaders/team')
    const box = (await screen.findByLabelText('رموز الفريق')) as HTMLTextAreaElement
    const input = document.querySelector<HTMLInputElement>('#team-a-input')!.closest('div')!.querySelector<HTMLInputElement>('input[type=file]')!
    const file = new File([JSON.stringify(CODES.slice(0, 3).map((code) => ({ code })))], 'codes.json', { type: 'application/json' })
    fireEvent.change(input, { target: { files: [file] } })
    await waitFor(() => expect(box.value.split('\n')).toHaveLength(3))
    expect(box.value).toContain(formatCode(CODES[0]))
    expect(screen.getByText('رموز أُضيفت من الملف:')).toBeInTheDocument()
  })

  it('English: the gate message leads in English', async () => {
    renderAt('/en/leaders/team')
    expect(await screen.findByRole('heading', { level: 1, name: 'Team radar' })).toBeInTheDocument()
    const first = screen.getByTestId('team-gate').firstElementChild!
    expect(first).toHaveAttribute('lang', 'en')
    expect(first).toHaveTextContent('You have 0; still needed: 5.')
  })
})
