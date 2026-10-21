import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import App from './App'
import { AppProvider } from './store'

const Home = lazy(() => import('./views/Home'))
const Wizard = lazy(() => import('./views/Wizard'))
const Results = lazy(() => import('./views/Results'))
const Pathways = lazy(() => import('./views/Pathways'))
const Roles = lazy(() => import('./views/Roles'))
const SkillRegistry = lazy(() => import('./views/SkillRegistry'))
const FutureSkills = lazy(() => import('./views/FutureSkills'))
const TechRadar = lazy(() => import('./views/TechRadar'))
const Explore = lazy(() => import('./views/Explore'))
const Lists = lazy(() => import('./views/Lists'))
const Careers = lazy(() => import('./views/Careers'))
const Decide = lazy(() => import('./views/Decide'))
const Entities = lazy(() => import('./views/Entities'))
const Impact = lazy(() => import('./views/Impact'))
const GovSectors = lazy(() => import('./views/GovSectors'))
const Directory = lazy(() => import('./views/Directory'))
const EntityDetail = lazy(() => import('./views/EntityDetail'))
const Standards = lazy(() => import('./views/Standards'))
const Methodology = lazy(() => import('./views/Methodology'))
const NotFound = lazy(() => import('./views/NotFound'))
const Evidence = lazy(() => import('./views/Evidence'))
const LeaderBrief = lazy(() => import('./views/leaders/LeaderBrief'))
const LeaderCheck = lazy(() => import('./views/leaders/LeaderCheck'))
const WorkShifts = lazy(() => import('./views/work/WorkShifts'))
const RoleDetail = lazy(() => import('./views/RoleDetail'))

const viewRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
  { path: 'assess', element: <Wizard /> },
  { path: 'assess/results', element: <Results /> },
  { path: 'assess/plan', element: <Pathways /> },
  { path: 'roles', element: <Roles /> },
  { path: 'skills', element: <SkillRegistry /> },
  { path: 'future-skills', element: <FutureSkills /> },
  { path: 'tech-radar', element: <TechRadar /> },
  { path: 'map', element: <Explore /> },
  { path: 'careers/trends', element: <Lists /> },
  { path: 'careers', element: <Careers /> },
  { path: 'guidance', element: <Decide /> },
  { path: 'entities', element: <Entities /> },
  { path: 'impact', element: <Impact /> },
  { path: 'sectors', element: <GovSectors /> },
  { path: 'directory', element: <Directory /> },
  { path: 'directory/:entityId', element: <EntityDetail /> },
  { path: 'standards', element: <Standards /> },
  { path: 'methodology', element: <Methodology /> },
  { path: 'tech-radar/:techId', element: <TechRadar /> },
  { path: 'careers/:careerId', element: <Careers /> },
  { path: 'evidence', element: <Evidence /> },
  { path: 'leaders/brief', element: <LeaderBrief /> },
  { path: 'leaders/check', element: <LeaderCheck /> },
  { path: 'work/shifts', element: <WorkShifts /> },
  { path: 'roles/:roleId', element: <RoleDetail /> },
  { path: '*', element: <NotFound /> },
]

/** Shared with the memory-router test harness. */
export const routes: RouteObject[] = [
  {
    element: <AppProvider><App /></AppProvider>,
    children: [
      // AppProvider redirects using its validated stored language.
      { index: true, element: null },
      { path: 'ar', caseSensitive: true, children: viewRoutes },
      { path: 'en', caseSensitive: true, children: viewRoutes },
      { path: '*', element: <NotFound /> },
    ],
  },
]

export default routes
