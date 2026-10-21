import { describe, expect, it, vi, afterEach } from 'vitest'
import { render, screen, within, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RadarChart from '../components/RadarChart'
import TechRadarChart from '../components/TechRadarChart'
import { radialLabel } from '../components/charts/useChartLabels'
import { rovingIndex } from '../components/charts/keyboard'
import { domains } from '../data/domains'
import { technologies, techClusters } from '../data/technologies'
import type { Lang } from '../data/types'
import { bdi, countPhrase, formatNumber, isolateLtr, MINUS, signed } from '../lib/format'

const ARABIC = /[؀-ۿ]/
const EASTERN = /[٠-٩۰-۹]/

const labels = domains.map((d) => d.shortName)
const ids = domains.map((d) => d.id)
const self = [2.5, 1.8, 3.2, 0.6, 4, 2, 1.25, 3]
const target = [3, 3, 3, 2, 4, 3, 2, 4]
const scenario = [2, 1, 3, 0, 3, 2, 1, 2]
const knowledge: (number | null)[] = [4, null, 2, null, null, null, null, 3]
const previous = [2, 1.5, 3, 0.5, 3.5, 2, 1, 2.5]

function renderRadar(lang: Lang, extra: Partial<Parameters<typeof RadarChart>[0]> = {}) {
  return render(
    <RadarChart
      labels={labels}
      ids={ids}
      values={self}
      targets={target}
      judgment={scenario}
      knowledge={knowledge}
      previous={previous}
      lang={lang}
      {...extra}
    />,
  )
}

describe('format helpers', () => {
  it('formats with Western digits in both languages', () => {
    for (const lang of ['ar', 'en'] as const) {
      expect(formatNumber(1234.5, lang)).toBe('1,234.5')
      expect(formatNumber(7891, lang)).toBe('7,891')
      expect(formatNumber(2.46, lang, { decimals: 1 })).toBe('2.5')
      expect(formatNumber(3, lang, { decimals: 1, minDecimals: 1 })).toBe('3.0')
      expect(formatNumber(-0.25, lang, { decimals: 1 })).toBe(`${MINUS}0.3`)
      expect(formatNumber(-0.04, lang, { decimals: 1 })).toBe('0') // no «−0»
      expect(formatNumber(NaN, lang)).toBe('—')
      expect(EASTERN.test(formatNumber(9876543.21, lang))).toBe(false)
      expect(/[‎‏]/.test(formatNumber(-12.5, lang))).toBe(false) // no hidden LRM/RLM
    }
  })

  it('puts the sign first in signed deltas', () => {
    expect(signed(0.5)).toBe('+0.5')
    expect(signed(-0.5)).toBe(`${MINUS}0.5`)
    expect(signed(0)).toBe('0.0')
    expect(signed(0.04)).toBe('0.0')
    expect(signed(1.234, 2)).toBe('+1.23')
    expect(signed(-12)).toBe(`${MINUS}12.0`)
  })

  it('isolates numbers so RTL text cannot move the sign («0.5+»)', () => {
    expect(isolateLtr('+0.5')).toBe('⁦+0.5⁩')
    const { container } = render(<p dir="rtl">الفرق {bdi(signed(0.5))} نقطة</p>)
    const b = container.querySelector('bdi')!
    expect(b).toHaveAttribute('dir', 'ltr')
    expect(b.textContent).toBe('+0.5')
    expect(b.className).toContain('tabular-nums')
  })

  it('agrees Arabic counts with the number', () => {
    const forms = { one: 'مجال واحد', two: 'مجالان', few: 'مجالات', many: 'مجالًا' }
    expect(countPhrase(1, 'ar', forms, ['domain', 'domains'])).toBe('مجال واحد')
    expect(countPhrase(2, 'ar', forms, ['domain', 'domains'])).toBe('مجالان')
    expect(countPhrase(8, 'ar', forms, ['domain', 'domains'])).toBe('8 مجالات')
    expect(countPhrase(24, 'ar', forms, ['domain', 'domains'])).toBe('24 مجالًا')
    expect(countPhrase(8, 'en', forms, ['domain', 'domains'])).toBe('8 domains')
    expect(countPhrase(1, 'en', forms, ['domain', 'domains'])).toBe('1 domain')
  })
})

describe('chart helpers', () => {
  it('mirrors the horizontal arrows in RTL and wraps around', () => {
    expect(rovingIndex('ArrowRight', 0, 8, false)).toBe(1)
    expect(rovingIndex('ArrowLeft', 0, 8, false)).toBe(7)
    expect(rovingIndex('ArrowLeft', 0, 8, true)).toBe(1)
    expect(rovingIndex('ArrowRight', 0, 8, true)).toBe(7)
    expect(rovingIndex('ArrowDown', 7, 8, true)).toBe(0)
    expect(rovingIndex('Home', 5, 8, false)).toBe(0)
    expect(rovingIndex('End', 1, 8, true)).toBe(7)
    expect(rovingIndex('a', 1, 8, true)).toBeNull()
  })

  it('never lets a radial label run past the chart edge', () => {
    const box = { w: 680, h: 544, fontSize: 15, pad: 6, centreFrac: 0.42 }
    for (let k = 0; k < 360; k += 5) {
      const angle = -90 + k
      const a = (angle * Math.PI) / 180
      const x = 340 + 210 * Math.cos(a)
      const y = 272 + 210 * Math.sin(a)
      const lab = radialLabel(x, y, angle, box)
      if (lab.side === 'right') expect(x + lab.maxWidth).toBeLessThanOrEqual(box.w - box.pad + 1e-9)
      if (lab.side === 'left') expect(x - lab.maxWidth).toBeGreaterThanOrEqual(box.pad - 1e-9)
      if (lab.side === 'top' || lab.side === 'bottom') {
        expect(x - lab.maxWidth / 2).toBeGreaterThanOrEqual(box.pad - 1e-9)
        expect(x + lab.maxWidth / 2).toBeLessThanOrEqual(box.w - box.pad + 1e-9)
      }
      expect(lab.maxWidth).toBeGreaterThan(100) // always room for a readable line
    }
  })
})

describe.each(['ar', 'en'] as const)('RadarChart (%s)', (lang) => {
  it('renders 8 domains with a localized accessible name and description', () => {
    renderRadar(lang)
    const img = screen.getByRole('img')
    const name = img.getAttribute('aria-label') ?? ''
    expect(ARABIC.test(name)).toBe(lang === 'ar')
    expect(name).toMatch(lang === 'ar' ? /8 مجالات/ : /8 domains/)
    const desc = document.getElementById(img.getAttribute('aria-describedby')!)!
    for (const d of domains) expect(desc.textContent).toContain(d.shortName[lang])
    expect(desc.textContent).toContain('2.5')
    expect(ARABIC.test(desc.textContent ?? '')).toBe(lang === 'ar')
    expect(EASTERN.test(desc.textContent ?? '')).toBe(false)
    // labels are HTML in the UI language, never clipped SVG text
    for (const d of domains) expect(document.querySelector(`[data-axis="${d.id}"]`)?.textContent).toBe(d.shortName[lang])
  })

  it('lists every layer value per domain in the data table', () => {
    renderRadar(lang)
    const table = screen.getByRole('table')
    expect(table).toHaveClass('sr-only')
    const rows = within(table).getAllByRole('row')
    expect(rows).toHaveLength(1 + 8)
    const head = within(rows[0]).getAllByRole('columnheader').map((c) => c.textContent)
    expect(head).toEqual(
      lang === 'ar'
        ? ['المجال', 'التقدير الذاتي', 'المستهدف', 'مواقف الحكم', 'التحقق المعرفي', 'التقييم السابق']
        : ['Domain', 'Self-rating', 'Target', 'Judgment scenarios', 'Knowledge check', 'Previous assessment'],
    )
    domains.forEach((d, i) => {
      const cells = within(rows[i + 1]).getAllByRole('cell').map((c) => c.textContent)
      expect(within(rows[i + 1]).getByRole('rowheader').textContent).toBe(d.shortName[lang])
      expect(cells).toEqual([
        formatNumber(self[i], lang, { decimals: 1 }),
        formatNumber(target[i], lang, { decimals: 1 }),
        formatNumber(scenario[i], lang, { decimals: 1 }),
        knowledge[i] === null ? (lang === 'ar' ? 'لا قيمة' : 'no value') : formatNumber(knowledge[i]!, lang, { decimals: 1 }),
        formatNumber(previous[i], lang, { decimals: 1 }),
      ])
    })
  })

  it('shows and hides layers through the `layers` prop', () => {
    const { rerender, container } = renderRadar(lang, { layers: { target: false } })
    const layer = (k: string) => container.querySelector(`[data-layer="${k}"]`)
    expect(layer('self')).toHaveAttribute('data-visible', 'true')
    expect(layer('target')).toHaveAttribute('data-visible', 'false')
    expect((layer('target') as SVGGElement).style.opacity).toBe('0')
    expect(layer('knowledge')!.querySelectorAll('rect')).toHaveLength(3) // markers only where judged
    rerender(
      <RadarChart labels={labels} ids={ids} values={self} targets={target} judgment={scenario} knowledge={knowledge} previous={previous} lang={lang} layers={{ self: false, scenario: false }} />,
    )
    expect(layer('target')).toHaveAttribute('data-visible', 'true')
    expect(layer('self')).toHaveAttribute('data-visible', 'false')
    expect(layer('scenario')).toHaveAttribute('data-visible', 'false')
    // the description follows what is visible
    const desc = document.getElementById(screen.getByRole('img').getAttribute('aria-describedby')!)!
    expect(desc.textContent).not.toContain(lang === 'ar' ? 'التقدير الذاتي' : 'Self-rating')
    // no data → no layer at all
    rerender(<RadarChart labels={labels} values={self} targets={target} lang={lang} />)
    expect(layer('scenario')).toBeNull()
    expect(layer('knowledge')).toBeNull()
    expect(layer('previous')).toBeNull()
  })

  it('moves focus with the arrow keys (mirrored in Arabic) and selects with Enter and Space', async () => {
    const user = userEvent.setup()
    const onAxisSelect = vi.fn()
    const onAxisClick = vi.fn()
    renderRadar(lang, { onAxisSelect, onAxisClick, selectedAxis: ids[0] })
    const bar = screen.getByRole('toolbar')
    const axes = within(bar).getAllByRole('button')
    expect(axes).toHaveLength(8)
    expect(axes.map((b) => b.tabIndex)).toEqual([0, -1, -1, -1, -1, -1, -1, -1]) // one tab stop
    expect(axes[0]).toHaveAttribute('aria-pressed', 'true')
    expect(axes[0].getAttribute('aria-label')).toContain(domains[0].shortName[lang])

    await user.tab()
    expect(axes[0]).toHaveFocus()
    expect(document.querySelector('[data-radar-readout]')).not.toBeNull() // focus shows the readout
    await user.keyboard(lang === 'ar' ? '{ArrowLeft}' : '{ArrowRight}')
    expect(axes[1]).toHaveFocus()
    expect(axes[1].tabIndex).toBe(0)
    await user.keyboard('{Enter}')
    expect(onAxisSelect).toHaveBeenLastCalledWith(ids[1])
    expect(onAxisClick).toHaveBeenLastCalledWith(1)
    await user.keyboard(lang === 'ar' ? '{ArrowRight}{ArrowRight}' : '{ArrowLeft}{ArrowLeft}')
    expect(axes[7]).toHaveFocus() // wraps
    await user.keyboard(' ')
    expect(onAxisSelect).toHaveBeenLastCalledWith(ids[7])
    await user.keyboard('{Escape}')
    expect(document.querySelector('[data-radar-readout]')).toBeNull()
  })

  it('keeps decorative charts out of the tab order', () => {
    renderRadar(lang)
    expect(screen.queryByRole('toolbar')).toBeNull()
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('renders the bilingual legend for the visible layers', () => {
    const { container } = renderRadar(lang, { legend: true, layers: { previous: false } })
    const items = container.querySelectorAll('[data-radar-legend] li')
    expect([...items].map((li) => li.textContent)).toEqual(
      lang === 'ar' ? ['التقدير الذاتي', 'المستهدف', 'مواقف الحكم', 'التحقق المعرفي'] : ['Self-rating', 'Target', 'Judgment scenarios', 'Knowledge check'],
    )
  })
})

describe.each(['ar', 'en'] as const)('TechRadarChart (%s)', (lang) => {
  const props = { technologies, lang, selectedId: null, filterCluster: null, filterHorizon: null, filterDomain: null, animate: false }

  it('makes every blip a focusable button with a one-stop roving tab order', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onClear = vi.fn()
    render(<TechRadarChart {...props} onSelect={onSelect} onClear={onClear} />)
    const img = screen.getByRole('img')
    expect(ARABIC.test(img.getAttribute('aria-label') ?? '')).toBe(lang === 'ar')
    const bar = screen.getByRole('toolbar')
    const blips = within(bar).getAllByRole('button')
    expect(blips).toHaveLength(technologies.length)
    expect(blips.filter((b) => b.tabIndex === 0)).toHaveLength(1)
    expect(blips.every((b) => b.tagName === 'BUTTON')).toBe(true)
    // hit target never below 24 CSS px
    expect(blips[0].style.width).toMatch(/^max\(24px,/)
    const first = blips.find((b) => b.tabIndex === 0)!
    const firstTech = technologies.find((t) => t.id === first.dataset.tech)!
    expect(first.getAttribute('aria-label')).toContain(firstTech.name[lang])

    act(() => first.focus())
    const tip = screen.getByRole('tooltip')
    expect(tip.textContent).toContain(firstTech.name[lang])
    expect(first).toHaveAttribute('aria-describedby', tip.id)

    await user.keyboard(lang === 'ar' ? '{ArrowLeft}' : '{ArrowRight}')
    const second = blips[blips.indexOf(first) + 1]
    expect(second).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onSelect).toHaveBeenLastCalledWith(second.dataset.tech)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).toBeNull()
    expect(onClear).toHaveBeenCalledTimes(1)

    // cluster labels are buttons too
    const clusters = within(screen.getByRole('group')).getAllByRole('button')
    expect(clusters.map((b) => b.textContent)).toEqual(expect.arrayContaining(techClusters.map((c) => c.name[lang])))
    fireEvent.click(clusters[0])
    expect(onSelect).toHaveBeenLastCalledWith(`cluster:${clusters[0].dataset.cluster}`)
  })

  it('skips filtered-out blips in the keyboard order', () => {
    render(<TechRadarChart {...props} filterHorizon="now" onSelect={() => {}} />)
    const blips = within(screen.getByRole('toolbar')).getAllByRole('button')
    const now = technologies.filter((t) => t.horizon === 'now')
    expect(blips).toHaveLength(now.length) // dimmed blips are hidden from assistive technology
    expect(blips.every((b) => technologies.find((t) => t.id === b.dataset.tech)!.horizon === 'now')).toBe(true)
  })
})

describe('TechRadarChart below 480 px', () => {
  const original = window.matchMedia
  afterEach(() => {
    window.matchMedia = original
  })

  it('falls back to a text list and keeps the chart one toggle away', () => {
    window.matchMedia = ((query: string) => ({
      matches: query.includes('max-width: 479'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    })) as unknown as typeof window.matchMedia
    const onSelect = vi.fn()
    const { container } = render(
      <TechRadarChart technologies={technologies} lang="ar" selectedId={null} onSelect={onSelect} filterCluster={null} filterHorizon={null} filterDomain={null} />,
    )
    expect(screen.queryByRole('img')).toBeNull()
    const list = container.querySelector('[data-tech-fallback]')!
    const items = within(list as HTMLElement).getAllByRole('button', { pressed: false })
    expect(items).toHaveLength(technologies.length)
    fireEvent.click(items[0])
    expect(onSelect).toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'اعرض الرسم' }))
    expect(screen.getByRole('img')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'اعرض القائمة' }))
    expect(screen.queryByRole('img')).toBeNull()
  })
})
