import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * One config for both builds:
 *   vite build                                              -> dist/      (client, emptied each build)
 *   vite build --ssr src/entry-server.tsx --outDir dist-ssr -> dist-ssr/  (Node ESM bundle for scripts/prerender.mjs)
 * Dependencies stay external in the SSR bundle (Vite default), so Node loads react, react-dom,
 * react-router-dom and framer-motion from node_modules; no extra noExternal is needed.
 */
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [eagerViewsForSsr(), react()],
  base: '/',
  build: {
    emptyOutDir: true,
    ...(isSsrBuild ? { ssr: true, rollupOptions: { output: { format: 'es' } } } : {}),
  },
  ssr: { target: 'node' },
}))

const LAZY_VIEW_LINE =
  /^const\s+(\w+)\s*=\s*lazy\(\s*\(\)\s*=>\s*import\(\s*(['"])([^'"]+)\2\s*\)\s*\)\s*;?[ \t]*$/gm

/**
 * SSR build only: rewrite every `const X = lazy(() => import('./views/X'))` line of src/routes.tsx
 * into a static `import X from './views/X'`, so the server renders the SAME route table with the
 * view modules loaded eagerly and plain renderToString produces the full page instead of the
 * Suspense fallback. The client build is untouched and keeps its code-split lazy views.
 * The build fails if any lazy() call survives the rewrite, so a changed routes.tsx cannot
 * silently turn the prerendered pages into loading shells (scripts/prerender.mjs re-checks the
 * loaded bundle with lazyRouteElements() as well).
 */
function eagerViewsForSsr(): Plugin {
  return {
    name: 'skills-radar:eager-views-for-ssr',
    enforce: 'pre',
    transform(code, id, options) {
      if (!options?.ssr || !/[\\/]src[\\/]routes\.tsx$/.test(id)) return null
      let rewritten = 0
      const out = code.replace(LAZY_VIEW_LINE, (_line, name: string, quote: string, specifier: string) => {
        rewritten++
        return `import ${name} from ${quote}${specifier}${quote}`
      })
      if (rewritten === 0 || /\blazy\(/.test(out)) {
        this.error(
          `eager-views-for-ssr: could not rewrite every lazy() view in ${id} (${rewritten} rewritten). ` +
            "Keep the one-line form `const X = lazy(() => import('./views/X'))` or update the transform.",
        )
      }
      return { code: out, map: null }
    },
  }
}
