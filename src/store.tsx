import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { L, Lang } from './data/types'
import { useLocation, useNavigate } from 'react-router-dom'
import { pathFor, routeFromPath } from './lib/routes'
import { usePageTitle } from './lib/head'

export type View =
  | 'home'
  | 'careers'
  | 'decide'
  | 'lists'
  | 'future-skills'
  | 'explore'
  | 'entities'
  | 'wizard'
  | 'results'
  | 'pathways'
  | 'tech-radar'
  | 'roles'
  | 'standards'
  | 'methodology'
  | 'skills'
  | 'impact'
  | 'sectors'
  | 'directory'
  | 'entity'
  | 'evidence'
  | 'about'
  | 'report'
  | 'services'
  | 'sector'
  | 'leaders'
  | 'leader-brief'
  | 'leader-check'
  | 'leader-team'
  | 'adoption'
  | 'work'
  | 'work-shifts'
  | 'role'
  | 'not-found'

export interface ResultRecord {
  id: string
  date: string // ISO
  roleId: string // generic profile id or `lib:<library role id>` or `career:<career id>`
  /** v6: chosen audience track (optional for legacy records) */
  trackId?: string
  answers: Record<string, number>
  scores: Record<string, number>
  overall: number
  /** calibration: correct answers 0-3 per domain id (optional for legacy records) */
  calibration?: Record<string, number>
  /** v6-B: scenario judgment score 0-3 per domain id (optional for legacy records) */
  scenario?: Record<string, number>
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
  setRoleId: (id: string) => void
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
  pendingCareerId: string | null
  openCareer: (careerId: string) => void
  clearPendingCareer: () => void
  pendingDomainId: string | null
  openDomainAt: (domainId: string) => void
  clearPendingDomain: () => void
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
  const [history, setHistory] = useState<ResultRecord[]>(() => load<ResultRecord[]>(LS_HISTORY, []))
  const draft = useMemo(
    () =>
      load<{ roleId: string | null; answers: Record<string, number>; calibration: Record<string, string>; trackId: string | null; scenarios: Record<string, number> }>(
        LS_DRAFT,
        { roleId: null, answers: {}, calibration: {}, trackId: null, scenarios: {} }
      ),
    []
  )
  const [roleId, setRoleIdState] = useState<string | null>(draft.roleId)
  const [answers, setAnswers] = useState<Record<string, number>>(draft.answers)
  const [calibrationAnswers, setCalibrationAnswers] = useState<Record<string, string>>(draft.calibration ?? {})
  const [trackId, setTrackIdState] = useState<string | null>(draft.trackId ?? null)
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, number>>(draft.scenarios ?? {})
  const pendingTechId = route.techId
  const pendingCareerId = route.careerId
  const pendingEntityId = route.entityId
  const search = new URLSearchParams(location.search)
  const pendingDomainId = view === 'explore' ? search.get('domain') : null
  const pendingSectorCategory = view === 'sectors' ? search.get('category') : null

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem(LS_LANG, JSON.stringify(lang))
    setStoredLang(lang)
  }, [lang])

  useEffect(() => {
    localStorage.setItem(LS_DRAFT, JSON.stringify({ roleId, answers, calibration: calibrationAnswers, trackId, scenarios: scenarioAnswers }))
  }, [roleId, answers, calibrationAnswers, trackId, scenarioAnswers])

  useEffect(() => {
    localStorage.setItem(LS_HISTORY, JSON.stringify(history))
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
  const setRoleId = useCallback((id: string) => setRoleIdState(id), [])
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
  const openCareer = useCallback((careerId: string) => open('careers', { careerId }), [open])
  const openDomainAt = useCallback((domain: string) => open('explore', { domain }), [open])
  const openEntity = useCallback((entityId: string) => open('entity', { entityId }), [open])
  const openSectorsByCategory = useCallback((category: string) => open('sectors', { category }), [open])
  // Effect consumers must retain IDs in the URL for reloads and language changes.
  const clearPendingTech = useCallback(() => {}, [])
  const clearPendingCareer = useCallback(() => {}, [])
  const clearPendingDomain = useCallback(() => {}, [])
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
    pendingCareerId,
    openCareer,
    clearPendingCareer,
    pendingDomainId,
    openDomainAt,
    clearPendingDomain,
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
