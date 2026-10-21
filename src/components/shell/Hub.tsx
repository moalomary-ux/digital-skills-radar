import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import type { View } from '../../store'
import type { L } from '../../data/types'
import { pathFor } from '../../lib/routes'
import Icon from '../Icon'
import { SOON } from './site'
import { useArrow } from './hooks'

/** Hub landing header: eyebrow, h1, one-paragraph purpose. */
export function HubHeader({ eyebrow, title, intro, children }: { eyebrow: L; title: L; intro: L; children?: ReactNode }) {
  const { t } = useApp()
  return (
    <header className="relative overflow-hidden border-b border-dga-line bg-white">
      <div className="dot-grid-green absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="eyebrow">{t(eyebrow)}</p>
        <h1 className="mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-tight text-dga-green-deep">{t(title)}</h1>
        <p className="mt-4 max-w-3xl text-body-lg text-dga-muted">{t(intro)}</p>
        {children}
      </div>
    </header>
  )
}

export interface HubCardProps {
  view: View
  title: L
  desc: ReactNode
  icon?: string
  soon?: boolean
  /** what the visitor walks away with (printable output), if any */
  output?: L
  highlight?: boolean
  params?: Record<string, string>
}

/**
 * A sub-page card. The title is the only link and stretches over the card, so the whole card is clickable
 * while the accessible name stays short. A «soon» card is not a link at all.
 */
export function HubCard({ view, title, desc, icon = 'radar', soon = false, output, highlight = false, params }: HubCardProps) {
  const { t, lang } = useApp()
  const arrow = useArrow()
  return (
    <article
      className={`group relative flex flex-col rounded-card border bg-white p-5 shadow-card transition-all duration-200 sm:p-6 ${
        soon ? 'border-dashed border-dga-line bg-dga-bg' : 'border-dga-line hover:-translate-y-0.5 hover:border-dga-green hover:shadow-card-lg focus-within:border-dga-green focus-within:shadow-card-lg'
      } ${highlight ? 'ring-2 ring-dga-amber ring-offset-2' : ''}`}
    >
      <span className={`grid h-11 w-11 place-items-center rounded-btn ${soon ? 'bg-dga-line/50 text-dga-muted' : 'bg-dga-green/10 text-dga-green'}`}>
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-dga-black">
        {soon ? (
          <span className="flex flex-wrap items-center gap-2">
            {t(title)}
            <span className="chip text-[11px]">{t(SOON)}</span>
          </span>
        ) : (
          <Link
            to={pathFor(view, lang, params)}
            className="text-dga-black no-underline after:absolute after:inset-0 after:rounded-card after:content-[''] hover:no-underline group-hover:text-dga-green-dark"
          >
            {t(title)}
          </Link>
        )}
      </h3>
      <div className="mt-2 flex-1 text-sm leading-relaxed text-dga-muted">{desc}</div>
      {output && (
        <p className="mt-4 text-xs text-dga-muted">
          <span className="font-semibold text-dga-ink">{t({ ar: 'المخرج:', en: 'Output:' })}</span> {t(output)}
        </p>
      )}
      {!soon && (
        <p className="mt-4 text-sm font-bold text-dga-green-dark" aria-hidden="true">
          {t({ ar: 'افتح', en: 'Open' })} <span className="inline-block transition-transform group-hover:-translate-x-1 ltr:group-hover:translate-x-1">{arrow}</span>
        </p>
      )}
    </article>
  )
}

/** Section wrapper used by hub pages. */
export function HubSection({ title, intro, children, id }: { title: L; intro?: L; children: ReactNode; id?: string }) {
  const { t } = useApp()
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h2 className="text-xl font-bold text-dga-green-dark sm:text-2xl">{t(title)}</h2>
      {intro && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-dga-muted">{t(intro)}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

/**
 * Native radio buttons styled as chips: one tab stop, arrow keys move the choice (browser behaviour),
 * and the label is the visible text.
 */
export function ChoiceChips<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  columns = 'flex flex-wrap gap-2',
}: {
  name: string
  legend: L
  options: { value: T; label: L }[]
  value: T
  onChange: (v: T) => void
  columns?: string
}) {
  const { t } = useApp()
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-dga-ink">{t(legend)}</legend>
      <div className={columns}>
        {options.map((o) => {
          const checked = o.value === value
          return (
            <label
              key={o.value}
              className={`flex cursor-pointer items-center gap-2 rounded-pill border px-3.5 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-dga-green has-[:focus-visible]:ring-offset-1 ${
                checked ? 'border-dga-green bg-dga-green text-white' : 'border-dga-line bg-white text-dga-ink hover:border-dga-green'
              }`}
            >
              <input type="radio" name={name} value={o.value} checked={checked} onChange={() => onChange(o.value)} className="sr-only" />
              {t(o.label)}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
