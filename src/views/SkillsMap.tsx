import { useApp } from '../store'

/** Placeholder: packet P10 replaces this with the interactive skills map. */
export default function SkillsMap() {
  const { t } = useApp()
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-h1 font-bold text-dga-green-deep">{t({ ar: 'خريطة المهارات التفاعلية', en: 'Interactive skills map' })}</h1>
      <p className="mt-3 text-dga-muted">{t({ ar: 'قيد البناء.', en: 'Under construction.' })}</p>
    </div>
  )
}
