import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { L, Lang } from './data/types'
import { useLocation, useNavigate } from 'react-router-dom'
import { pathFor, routeFromPath } from './lib/routes'
import { usePageTitle } from './lib/head'

export type View =
  | 'home'
  | 'future-skills'
  | 'entities'
  | 'wizard'
  | 'results'
  | 'pathways'
  | 'tech-radar'
  | 'roles'
  | 'standards'
  | 'methodology'
  | 'skills'
  | 'sectors'
  | 'directory'
  | 'entity'
  | 'evidence'
  | 'about'
  | 'report'
  | 'services'
  | 'sector'
  | 'leaders'
  | 'roles-hub'
  | 'map'
  | 'method-hub'
  | 'leader-brief'
  | 'leader-check'
  | 'leader-team'
  | 'adoption'
  | 'work'
  | 'work-shifts'
  | 'role'
  | 'not-found'

/** Per-domain knowledge-check record («تحقق معرفي»): questions attempted and answered correctly. */
export interface KnowledgeTally {
  attempted: number
  correct: number
}

export const RESULT_SCHEMA_VERSION = 2

export interface ResultRecord {
  /** schema version: 2 for v9 records; missing on legacy records (see `migrateRecord`) */
  v?: 2
  id: string
  date: string // ISO
  /**
   * `lib:<library role id>` when a precise role was chosen, otherwise `cat:<role category>` (v9).
   * Legacy records may hold a generic profile id or `career:<career id>`.
   */
  roleId: string
  /** role category («فئة الدور»): one of the five track ids (optional for legacy records) */
  trackId?: string
  answers: Record<string, number>
  scores: Record<string, number>
  /** kept for compatibility; never shown (no overall score in the UI) */
  overall: number
  /**
   * LEGACY (v missing): correct answers per domain id, attempts unknown. Read-only: new
   * records use `knowledge`. Never used for an agreement flag.
   */
  calibration?: Record<string, number>
  /** v2: knowledge check per domain id — only domains with at least one attempt */
  knowledge?: Record<string, KnowledgeTally>
  /** v6-B: scenario judgment score 0-3 per domain id (optional for legacy records) */
  scenario?: Record<string, number>
  /** v2: chosen option index per scenario item id (for the domain detail view) */
  scenarioChoices?: Record<string, number>
}

const isNumRecord = (x: unknown): x is Record<string, number> =>
  !!x && typeof x === 'object' && !Array.isArray(x) && Object.values(x as object).every((v) => typeof v === 'number' && Number.isFinite(v))

/**
 * Validate and migrate one stored result. Returns null for anything that cannot be shown safely
 * (a malformed record must never crash the results page).
 * - v missing (legacy): kept as is; `calibration` stays readable as «correct, attempts unknown»
 *   and produces no agreement flag (see src/lib/priorities.ts).
 * - v 2: `knowledge` entries are clamped to 0 ≤ correct ≤ attempted.
 */
export function migrateRecord(raw: unknown): ResultRecord | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (typeof r.id !== 'string' || typeof r.date !== 'string' || Number.isNaN(Date.parse(r.date))) return null
  if (!isNumRecord(r.scores) || Object.keys(r.scores).length === 0) return null
  const rec: ResultRecord = {
    id: r.id,
    date: r.date,
    roleId: typeof r.roleId === 'string' ? r.roleId : '',
    answers: isNumRecord(r.answers) ? r.answers : {},
    scores: r.scores,
    overall: typeof r.overall === 'number' && Number.isFinite(r.overall) ? r.overall : 0,
  }
  if (typeof r.trackId === 'string') rec.trackId = r.trackId
  if (isNumRecord(r.scenario)) rec.scenario = r.scenario
  if (isNumRecord(r.scenarioChoices)) rec.scenarioChoices = r.scenarioChoices
  if (r.v === RESULT_SCHEMA_VERSION) {
    rec.v = RESULT_SCHEMA_VERSION
    if (r.knowledge && typeof r.knowledge === 'object') {
      const k: Record<string, KnowledgeTally> = {}
      for (const [d, t] of Object.entries(r.knowledge as Record<string, unknown>)) {
        const tt = t as Partial<KnowledgeTally> | null
        if (!tt || typeof tt.attempted !== 'number' || typeof tt.correct !== 'number') continue
        const attempted = Math.max(0, Math.floor(tt.attempted))
        if (attempted === 0) continue
        k[d] = { attempted, correct: Math.max(0, Math.min(attempted, Math.floor(tt.correct))) }
      }
      if (Object.keys(k).length) rec.knowledge = k
    }
  } else if (isNumRecord(r.calibration)) {
    rec.calibration = r.calibration
  }
  return rec
}

/** Read the stored history defensively: non-arrays and malformed entries are dropped. */
export function migrateHistory(raw: unknown): ResultRecord[] {
  if (!Array.isArray(raw)) return []
  return raw.map(migrateRecord).filter((r): r is ResultRecord => r !== null)
}

interface AppState {
  lang: Lang
  dir: 'rtl' | 'ltr'
  t: (l: L) => string
  toggleLang: () => void
  view: View
  go: (v: View) => void
  // assessment draft
  roleId: string | null
  /** `null` clears a preselected role (role choice is optional in v9) */
  setRoleId: (id: string | null) => void
  answers: Record<string, number>
  setAnswer: (statementId: string, value: number) => void
  trackId: string | null
  setTrackId: (id: string) => void
  calibrationAnswers: Record<string, string> // questionId → option key
  setCalibrationAnswer: (questionId: string, optionKey: string) => void
  scenarioAnswers: Record<string, number> // scenarioId → chosen option index
  setScenarioAnswer: (scenarioId: string, optionIndex: number) => void
  resetDraft: () => void
  // results history
  history: ResultRecord[]
  saveResult: (rec: ResultRecord) => void
  clearHistory: () => void
  // cross-view navigation
  pendingTechId: string | null
  openTech: (techId: string) => void
  clearPendingTech: () => void
  /** v8: entity detail page */
  pendingEntityId: string | null
  openEntity: (entityId: string) => void
  clearPendingEntity: () => void
  /** v8: open sectors ranked by demand for a consulting category */
  pendingSectorCategory: string | null
  openSectorsByCategory: (category: string) => void
  clearPendingSectorCategory: () => void
}

const Ctx = createContext<AppState | null>(null)

const LS_LANG = 'dsr-lang'
const LS_HISTORY = 'dsr-history'
const LS_DRAFT = 'dsr-draft'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const route = routeFromPath(location.pathname)
  const [storedLang, setStoredLang] = useState<Lang>(() => load<unknown>(LS_LANG, 'ar') === 'en' ? 'en' : 'ar')
  const lang = route.lang ?? storedLang
  const view = route.view
  usePageTitle(view, lang)

  useEffect(() => {
    if (location.pathname === '/') {
      navigate({ pathname: pathFor('home', lang), search: location.search, hash: location.hash }, { replace: true })
    }
  }, [location.pathname, location.search, location.hash, lang, navigate])
  const [history, setHistory] = useState<ResultRecord[]>(() => migrateHistory(load<unknown>(LS_HISTORY, [])))
  const draft = useMemo(() => {
    type Draft = { roleId: string | null; answers: Record<string, number>; calibration: Record<string, string>; trackId: string | null; scenarios: Record<string, number> }
    const empty: Draft = { roleId: null, answers: {}, calibration: {}, trackId: null, scenarios: {} }
    const d = load<unknown>(LS_DRAFT, empty)
    return d && typeof d === 'object' && !Array.isArray(d) ? (d as Draft) : empty
  }, [])
  const [roleId, setRoleIdState] = useState<string | null>(typeof draft.roleId === 'string' ? draft.roleId : null)
  const [answers, setAnswers] = useState<Record<string, number>>(isNumRecord(draft.answers) ? draft.answers : {})
  const [calibrationAnswers, setCalibrationAnswers] = useState<Record<string, string>>(
    draft.calibration && typeof draft.calibration === 'object' ? draft.calibration : {}
  )
  const [trackId, setTrackIdState] = useState<string | null>(typeof draft.trackId === 'string' ? draft.trackId : null)
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, number>>(isNumRecord(draft.scenarios) ? draft.scenarios : {})
  const pendingTechId = route.techId
  const pendingEntityId = route.entityId
  const search = new URLSearchParams(location.search)
  const pendingSectorCategory = view === 'sectors' ? search.get('category') : null

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try { localStorage.setItem(LS_LANG, JSON.stringify(lang)) } catch { /* storage unavailable */ }
    setStoredLang(lang)
  }, [lang])

  useEffect(() => {
    try {
      localStorage.setItem(LS_DRAFT, JSON.stringify({ roleId, answers, calibration: calibrationAnswers, trackId, scenarios: scenarioAnswers }))
    } catch { /* storage unavailable */ }
  }, [roleId, answers, calibrationAnswers, trackId, scenarioAnswers])

  useEffect(() => {
    try { localStorage.setItem(LS_HISTORY, JSON.stringify(history)) } catch { /* storage unavailable */ }
  }, [history])

  const t = useCallback((l: L) => (lang === 'ar' ? l.ar : l.en), [lang])
  const toggleLang = useCallback(() => {
    const next = lang === 'ar' ? 'en' : 'ar'
    const pathname = /^\/(ar|en)(?=\/|$)/.test(location.pathname)
      ? location.pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${next}`)
      : `/${next}${location.pathname === '/' ? '' : location.pathname}`
    navigate({ pathname, search: location.search, hash: location.hash })
  }, [lang, location.pathname, location.search, location.hash, navigate])
  const go = useCallback((v: View) => {
    navigate(pathFor(v, lang))
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [lang, navigate])
  const setRoleId = useCallback((id: string | null) => setRoleIdState(id), [])
  const setAnswer = useCallback(
    (statementId: string, value: number) => setAnswers((p) => ({ ...p, [statementId]: value })),
    []
  )
  const setCalibrationAnswer = useCallback(
    (questionId: string, optionKey: string) => setCalibrationAnswers((p) => ({ ...p, [questionId]: optionKey })),
    []
  )
  const setScenarioAnswer = useCallback(
    (scenarioId: string, optionIndex: number) => setScenarioAnswers((p) => ({ ...p, [scenarioId]: optionIndex })),
    []
  )
  const setTrackId = useCallback((id: string) => setTrackIdState(id), [])
  const resetDraft = useCallback(() => {
    setRoleIdState(null)
    setAnswers({})
    setCalibrationAnswers({})
    setTrackIdState(null)
    setScenarioAnswers({})
  }, [])
  const saveResult = useCallback((rec: ResultRecord) => setHistory((p) => [...p, rec]), [])
  const clearHistory = useCallback(() => setHistory([]), [])
  const open = useCallback((v: View, params: Record<string, string>) => {
    navigate(pathFor(v, lang, params))
    window.scrollTo({ top: 0 })
  }, [lang, navigate])
  const openTech = useCallback((techId: string) => open('tech-radar', { techId }), [open])
  const openEntity = useCallback((entityId: string) => open('entity', { entityId }), [open])
  const openSectorsByCategory = useCallback((category: string) => open('sectors', { category }), [open])
  // Effect consumers must retain IDs in the URL for reloads and language changes.
  const clearPendingTech = useCallback(() => {}, [])
  const clearPendingEntity = useCallback(() => {}, [])
  // Sectors exposes an explicit reset button, rather than consuming its value in an effect.
  const clearPendingSectorCategory = useCallback(() => {
    const params = new URLSearchParams(location.search)
    params.delete('category')
    navigate({ pathname: location.pathname, search: params.toString(), hash: location.hash })
  }, [location.pathname, location.search, location.hash, navigate])

  const value: AppState = {
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    t,
    toggleLang,
    view,
    go,
    roleId,
    setRoleId,
    answers,
    setAnswer,
    trackId,
    setTrackId,
    calibrationAnswers,
    setCalibrationAnswer,
    scenarioAnswers,
    setScenarioAnswer,
    resetDraft,
    history,
    saveResult,
    clearHistory,
    pendingTechId,
    openTech,
    clearPendingTech,
    pendingEntityId,
    openEntity,
    clearPendingEntity,
    pendingSectorCategory,
    openSectorsByCategory,
    clearPendingSectorCategory,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp outside provider')
  return ctx
}

/** Compute domain scores (0-4 average) from answers. */
export function computeScores(answers: Record<string, number>, statementGroups: { domainId: string; ids: string[] }[]) {
  const scores: Record<string, number> = {}
  for (const g of statementGroups) {
    const vals = g.ids.map((id) => answers[id] ?? 0)
    scores[g.domainId] = vals.reduce((a, b) => a + b, 0) / g.ids.length
  }
  const overall = Object.values(scores).reduce((a, b) => a + b, 0) / statementGroups.length
  return { scores, overall }
}
