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
const Entities = lazy(() => import('./views/Entities'))
const Services = lazy(() => import('./views/Services'))
const SectorBrief = lazy(() => import('./views/SectorBrief'))
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
const Report = lazy(() => import('./views/Report'))
const TeamRadar = lazy(() => import('./views/leaders/TeamRadar'))
const About = lazy(() => import('./views/About'))
const HubLeaders = lazy(() => import('./views/hubs/Leaders'))
const HubWork = lazy(() => import('./views/hubs/Work'))
const HubRolesSkills = lazy(() => import('./views/hubs/RolesSkills'))
const HubEntitiesSectors = lazy(() => import('./views/hubs/EntitiesSectors'))
const HubMethod = lazy(() => import('./views/hubs/Method'))

const viewRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
  { path: 'assess', element: <Wizard /> },
  { path: 'assess/results', element: <Results /> },
  { path: 'assess/plan', element: <Pathways /> },
  { path: 'assess/report', element: <Report /> },
  { path: 'roles', element: <Roles /> },
  { path: 'skills', element: <SkillRegistry /> },
  { path: 'future-skills', element: <FutureSkills /> },
  { path: 'tech-radar', element: <TechRadar /> },
  { path: 'entities', element: <HubEntitiesSectors /> },
  { path: 'leaders/adoption', element: <Entities /> },
  { path: 'leaders', element: <HubLeaders /> },
  { path: 'work', element: <HubWork /> },
  { path: 'capabilities', element: <HubRolesSkills /> },
  { path: 'method', element: <HubMethod /> },
  { path: 'about', element: <About /> },
  { path: 'services', element: <Services /> },
  { path: 'sectors/:sectorId', element: <SectorBrief /> },
  { path: 'sectors', element: <GovSectors /> },
  { path: 'directory', element: <Directory /> },
  { path: 'directory/:entityId', element: <EntityDetail /> },
  { path: 'standards', element: <Standards /> },
  { path: 'methodology', element: <Methodology /> },
  { path: 'tech-radar/:techId', element: <TechRadar /> },
  { path: 'evidence', element: <Evidence /> },
  { path: 'leaders/brief', element: <LeaderBrief /> },
  { path: 'leaders/check', element: <LeaderCheck /> },
  { path: 'leaders/team', element: <TeamRadar /> },
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
