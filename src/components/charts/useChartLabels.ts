import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import type { L, Lang } from '../../data/types'

/**
 * Radial label layout for the hand-built SVG charts (P9).
 *
 * Labels are HTML laid over the SVG (not SVG `<text>`), so the browser does the Arabic shaping,
 * the bidi ordering and the word wrapping. Each label is positioned in percentages of the chart
 * box, on the side of its anchor point that faces away from the centre, with a `max-width` equal
 * to the room left before the chart edge: a label can wrap onto more lines but can never be
 * pushed past the edge in either language. Font size is in container units (`cqw`) so labels
 * scale with the chart exactly like the SVG geometry does.
 */
export interface ChartBox {
  /** viewBox width and height (user units) */
  w: number
  h: number
  /** label font size in user units */
  fontSize: number
  /** gap kept between a label and the chart edge (user units) */
  pad?: number
  /** max width of a label centred above/below the chart, as a fraction of `w` */
  centreFrac?: number
}

export type LabelSide = 'left' | 'right' | 'top' | 'bottom'

export interface RadialLabel {
  side: LabelSide
  /** style for an absolutely positioned label inside a `position: relative` chart box */
  style: CSSProperties
  /** room for the label, in user units (exposed for tests) */
  maxWidth: number
}

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`

/** `font-size` in container-width units for a size given in viewBox units. */
export const cqFont = (size: number, boxW: number) => `${((size / boxW) * 100).toFixed(3)}cqw`

export function radialLabel(x: number, y: number, angleDeg: number, box: ChartBox): RadialLabel {
  const pad = box.pad ?? 6
  const cos = Math.cos((angleDeg * Math.PI) / 180)
  const sin = Math.sin((angleDeg * Math.PI) / 180)
  const base: CSSProperties = {
    position: 'absolute',
    fontSize: cqFont(box.fontSize, box.w),
    lineHeight: 1.25,
    overflowWrap: 'normal',
    wordBreak: 'normal',
    hyphens: 'none',
    textWrap: 'balance',
  } as CSSProperties
  if (cos > 0.3) {
    const maxWidth = Math.max(0, box.w - x - pad)
    return {
      side: 'right',
      maxWidth,
      style: { ...base, left: pct(x, box.w), top: pct(y, box.h), transform: 'translateY(-50%)', maxWidth: pct(maxWidth, box.w), textAlign: 'left' },
    }
  }
  if (cos < -0.3) {
    const maxWidth = Math.max(0, x - pad)
    return {
      side: 'left',
      maxWidth,
      style: { ...base, right: pct(box.w - x, box.w), top: pct(y, box.h), transform: 'translateY(-50%)', maxWidth: pct(maxWidth, box.w), textAlign: 'right' },
    }
  }
  const maxWidth = Math.max(0, Math.min(2 * Math.min(x, box.w - x) - 2 * pad, (box.centreFrac ?? 0.42) * box.w))
  const common: CSSProperties = { ...base, left: pct(x, box.w), transform: 'translateX(-50%)', width: 'max-content', maxWidth: pct(maxWidth, box.w), textAlign: 'center' }
  return sin < 0
    ? { side: 'top', maxWidth, style: { ...common, bottom: pct(box.h - y, box.h) } }
    : { side: 'bottom', maxWidth, style: { ...common, top: pct(y, box.h) } }
}

export interface AxisLabel extends RadialLabel {
  text: string
  lang: Lang
  /** axis angle in degrees (−90 = top) */
  angle: number
  x: number
  y: number
}

/**
 * Labels for `n` axes evenly spread from the top, clockwise in English and counter-clockwise in
 * Arabic (the chart follows the reading direction).
 */
export function useChartLabels(
  labels: L[],
  lang: Lang,
  geometry: { cx: number; cy: number; r: number; box: ChartBox; startDeg?: number; offset?: number },
): AxisLabel[] {
  const { cx, cy, r, box, startDeg = -90, offset = 0 } = geometry
  const dir = lang === 'ar' ? -1 : 1
  const key = labels.map((l) => `${l.ar}|${l.en}`).join('§')
  return useMemo(() => {
    const n = labels.length
    return labels.map((label, i) => {
      const angle = startDeg + dir * (i + offset) * (360 / n)
      const a = (angle * Math.PI) / 180
      const x = cx + r * Math.cos(a)
      const y = cy + r * Math.sin(a)
      return { ...radialLabel(x, y, angle, box), text: label[lang], lang, angle, x, y }
    })
    // labels are compared by content: callers often rebuild the array on every render
  }, [key, lang, cx, cy, r, box.w, box.h, box.fontSize, box.pad, box.centreFrac, startDeg, offset, dir]) // eslint-disable-line react-hooks/exhaustive-deps
}
