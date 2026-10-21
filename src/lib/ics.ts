/**
 * Calendar file for «خطتك للأيام الـ90 المقبلة» (RFC 5545). Pure functions, generated in the browser:
 * 13 weekly reminders (day 1, 8, 15, … 85) and one re-check event on day 90. All events are
 * all-day events (no time-zone ambiguity) with a display alarm at 09:00 on the day.
 * No personal data: titles and descriptions hold the plan steps only.
 */

export interface IcsItem {
  title: string
  description: string
}

export interface PlanIcsInput {
  /** day 1 of the plan (local calendar date) */
  start: Date
  /** generation time (DTSTAMP); defaults to now */
  now?: Date
  calendarName: string
  /** exactly 13 weekly reminders, week 1 first */
  weeks: IcsItem[]
  /** the day-90 re-check */
  recheck: IcsItem
  /** stable seed for event UIDs (e.g. the result id) */
  uidSeed: string
}

export const PLAN_WEEKS = 13
export const PLAN_DAYS = 90
/** day numbers are 1-based: day 1 = start */
export const CHECKPOINT_DAYS = [45, 90] as const

const pad = (n: number, w = 2) => String(n).padStart(w, '0')

/** Local calendar date + n days (DST-safe: built from Y/M/D, never from milliseconds). */
export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

/** Calendar date of plan day `day` (1-based). */
export function planDay(start: Date, day: number): Date {
  return addDays(start, day - 1)
}

/** YYYYMMDD from local date parts. */
export function icsDate(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
}

/** YYYYMMDDTHHMMSSZ in UTC. */
export function icsStamp(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
}

/** TEXT escaping (RFC 5545 §3.3.11). */
export function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

const encoder = new TextEncoder()

/** Fold a content line at 75 octets (UTF-8), never splitting a character (RFC 5545 §3.1). */
export function foldLine(line: string): string {
  const out: string[] = []
  let cur = ''
  let curBytes = 0
  let limit = 75
  for (const ch of line) {
    const b = encoder.encode(ch).length
    if (curBytes + b > limit) {
      out.push(cur)
      cur = ' ' + ch
      curBytes = 1 + b
      limit = 75
    } else {
      cur += ch
      curBytes += b
    }
  }
  out.push(cur)
  return out.join('\r\n')
}

function event(lines: string[], uid: string, stamp: string, date: Date, item: IcsItem, alarm: string) {
  lines.push(
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${icsDate(date)}`,
    `DTEND;VALUE=DATE:${icsDate(addDays(date, 1))}`,
    `SUMMARY:${escapeText(item.title)}`,
    `DESCRIPTION:${escapeText(item.description)}`,
    'TRANSP:TRANSPARENT',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'TRIGGER:PT9H',
    `DESCRIPTION:${escapeText(alarm)}`,
    'END:VALARM',
    'END:VEVENT'
  )
}

/** Build the plan calendar: 13 weekly reminders + the day-90 re-check. */
export function buildPlanIcs(input: PlanIcsInput): string {
  if (input.weeks.length !== PLAN_WEEKS) throw new Error(`expected ${PLAN_WEEKS} weekly items, got ${input.weeks.length}`)
  const stamp = icsStamp(input.now ?? new Date())
  const seed = input.uidSeed.replace(/[^A-Za-z0-9-]/g, '') || 'plan'
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//omary.me//Digital Skills Radar//AR-EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(input.calendarName)}`,
  ]
  input.weeks.forEach((w, i) => {
    event(lines, `dsr-${seed}-w${i + 1}@omary.me`, stamp, planDay(input.start, 1 + i * 7), w, w.title)
  })
  event(lines, `dsr-${seed}-d${PLAN_DAYS}@omary.me`, stamp, planDay(input.start, PLAN_DAYS), input.recheck, input.recheck.title)
  lines.push('END:VCALENDAR')
  return lines.map(foldLine).join('\r\n') + '\r\n'
}

/* ------------------------------------------------------------- browser helpers */

/** Long Gregorian date with Western digits in both languages. */
export function formatLongDate(d: Date, lang: 'ar' | 'en'): string {
  return d.toLocaleDateString(lang === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** Save generated text as a file (calendar, JSON export). Returns false where the browser cannot. */
export function downloadText(filename: string, text: string, mime: string): boolean {
  try {
    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return false
    const url = URL.createObjectURL(new Blob([text], { type: mime }))
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return true
  } catch {
    return false
  }
}
