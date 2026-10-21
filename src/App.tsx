import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from './store'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './views/Home'
import Careers from './views/Careers'
import Decide from './views/Decide'
import Lists from './views/Lists'
import FutureSkills from './views/FutureSkills'
import Explore from './views/Explore'
import Entities from './views/Entities'
import Wizard from './views/Wizard'
import Results from './views/Results'
import Pathways from './views/Pathways'
import TechRadar from './views/TechRadar'
import Roles from './views/Roles'
import Standards from './views/Standards'
import Methodology from './views/Methodology'
import SkillRegistry from './views/SkillRegistry'
import Impact from './views/Impact'
import GovSectors from './views/GovSectors'
import Directory from './views/Directory'
import EntityDetail from './views/EntityDetail'

export default function App() {
  const { view } = useApp()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {view === 'home' && <Home />}
            {view === 'careers' && <Careers />}
            {view === 'decide' && <Decide />}
            {view === 'lists' && <Lists />}
            {view === 'future-skills' && <FutureSkills />}
            {view === 'explore' && <Explore />}
            {view === 'entities' && <Entities />}
            {view === 'wizard' && <Wizard />}
            {view === 'results' && <Results />}
            {view === 'pathways' && <Pathways />}
            {view === 'tech-radar' && <TechRadar />}
            {view === 'roles' && <Roles />}
            {view === 'standards' && <Standards />}
            {view === 'methodology' && <Methodology />}
            {view === 'skills' && <SkillRegistry />}
            {view === 'impact' && <Impact />}
            {view === 'sectors' && <GovSectors />}
            {view === 'directory' && <Directory />}
            {view === 'entity' && <EntityDetail />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
