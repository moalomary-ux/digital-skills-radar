import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { L, Lang } from './data/types'

export type View =
  | 'home'
  | 'careers'
  | 'decide'
  | 'lists'
  | 'wizard'
  | 'results'
  | 'pathways'
  | 'tech-radar'
  | 'roles'
  | 'standards'

export interface ResultRecord {
  id: string
  date: string // ISO
  roleId: string // generic profile id or `lib:<library role id>`
  answers: Record<string, number>
  scores: Record<string, number>
  overall: number
  /** calibration: correct answers 0-3 per domain id (optional for legacy records) */
  calibration?: Record<string, number>
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
  calibrationAnswers: Record<string, string> // questionId → option key
  setCalibrationAnswer: (questionId: string, optionKey: string) => void
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
  const [lang, setLang] = useState<Lang>(() => load<Lang>(LS_LANG, 'ar'))
  const [view, setView] = useState<View>('home')
  const [history, setHistory] = useState<ResultRecord[]>(() => load<ResultRecord[]>(LS_HISTORY, []))
  const draft = useMemo(
    () =>
      load<{ roleId: string | null; answers: Record<string, number>; calibration: Record<string, string> }>(
        LS_DRAFT,
        { roleId: null, answers: {}, calibration: {} }
      ),
    []
  )
  const [roleId, setRoleIdState] = useState<string | null>(draft.roleId)
  const [answers, setAnswers] = useState<Record<string, number>>(draft.answers)
  const [calibrationAnswers, setCalibrationAnswers] = useState<Record<string, string>>(draft.calibration ?? {})
  const [pendingTechId, setPendingTechId] = useState<string | null>(null)
  const [pendingCareerId, setPendingCareerId] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem(LS_LANG, JSON.stringify(lang))
  }, [lang])

  useEffect(() => {
    localStorage.setItem(LS_DRAFT, JSON.stringify({ roleId, answers, calibration: calibrationAnswers }))
  }, [roleId, answers, calibrationAnswers])

  useEffect(() => {
    localStorage.setItem(LS_HISTORY, JSON.stringify(history))
  }, [history])

  const t = useCallback((l: L) => (lang === 'ar' ? l.ar : l.en), [lang])
  const toggleLang = useCallback(() => setLang((p) => (p === 'ar' ? 'en' : 'ar')), [])
  const go = useCallback((v: View) => {
    setView(v)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])
  const setRoleId = useCallback((id: string) => setRoleIdState(id), [])
  const setAnswer = useCallback(
    (statementId: string, value: number) => setAnswers((p) => ({ ...p, [statementId]: value })),
    []
  )
  const setCalibrationAnswer = useCallback(
    (questionId: string, optionKey: string) => setCalibrationAnswers((p) => ({ ...p, [questionId]: optionKey })),
    []
  )
  const resetDraft = useCallback(() => {
    setRoleIdState(null)
    setAnswers({})
    setCalibrationAnswers({})
  }, [])
  const saveResult = useCallback((rec: ResultRecord) => setHistory((p) => [...p, rec]), [])
  const clearHistory = useCallback(() => setHistory([]), [])
  const openTech = useCallback(
    (techId: string) => {
      setPendingTechId(techId)
      setView('tech-radar')
      window.scrollTo({ top: 0 })
    },
    []
  )
  const clearPendingTech = useCallback(() => setPendingTechId(null), [])
  const openCareer = useCallback((careerId: string) => {
    setPendingCareerId(careerId)
    setView('careers')
    window.scrollTo({ top: 0 })
  }, [])
  const clearPendingCareer = useCallback(() => setPendingCareerId(null), [])

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
    calibrationAnswers,
    setCalibrationAnswer,
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
