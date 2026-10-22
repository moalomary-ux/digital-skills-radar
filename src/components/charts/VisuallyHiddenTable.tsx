import type { ReactNode } from 'react'
import type { Lang } from '../../data/types'

export interface HiddenTableRow {
  key: string
  header: ReactNode
  cells: ReactNode[]
}

interface Props {
  id?: string
  lang: Lang
  caption: string
  /** column headers after the row-header column */
  columns: ReactNode[]
  /** header of the row-header column */
  rowHeader: ReactNode
  rows: HiddenTableRow[]
  /** show the table on screen instead of only to assistive technology */
  visible?: boolean
  className?: string
}

/**
 * The accessible equivalent of a chart: every plotted value in a real table. Visually hidden by
 * default (`sr-only`), optionally shown under the chart. Never `display: none`, so screen readers
 * and the browser's find-in-page both reach it.
 *
 * Hidden, it sits inside a 1 px `sr-only` block (P11, as the map does since P10b): a table ignores
 * `height` and `overflow`, so a bare `table.sr-only` still lays out at full height and can stretch
 * the page or add a printed page; the block wrapper clips it to zero layout height on screen and paper.
 */
export default function VisuallyHiddenTable(props: Props) {
  // the wrapper stays when the table is shown (it only loses `sr-only`), so the table keeps its identity
  return (
    <div className={props.visible ? undefined : 'sr-only'} data-chart-table-wrap="">
      <ChartTable {...props} />
    </div>
  )
}

function ChartTable({ id, lang, caption, columns, rowHeader, rows, visible = false, className = '' }: Props) {
  return (
    <table
      id={id}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
      data-chart-table=""
      className={visible ? `mt-3 w-full border-collapse text-start text-xs text-dga-ink ${className}` : `sr-only ${className}`}
    >
      <caption className={visible ? 'mb-1 text-start text-[11px] text-dga-muted' : undefined}>{caption}</caption>
      <thead>
        <tr className={visible ? 'border-b border-dga-line text-dga-muted' : undefined}>
          <th scope="col" className={visible ? 'py-1 text-start font-semibold' : undefined}>
            {rowHeader}
          </th>
          {columns.map((c, i) => (
            <th key={i} scope="col" className={visible ? 'py-1 text-start font-semibold' : undefined}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key} className={visible ? 'border-b border-dga-line/60' : undefined}>
            <th scope="row" className={visible ? 'py-1 text-start font-medium' : undefined}>
              {r.header}
            </th>
            {r.cells.map((c, i) => (
              <td key={i} className={visible ? 'py-1' : undefined}>
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
