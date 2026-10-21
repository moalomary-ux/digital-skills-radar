# Packet P1 — Router foundation (URLs, language prefix, lazy views, test harness, omary.me base)

Owner of this packet: one executor. Scope: the files listed under "Files you may change". Do not redesign anything visually; keep every one of the 19 views reachable and working exactly as today. Keep the localStorage keys `dsr-lang`, `dsr-history`, `dsr-draft` unchanged.

## Why
The app switches 19 views by React state, so every page shares one URL: no deep links, no back button, no per-page titles, no shareable results. This packet gives every page a real URL with the language in the path, splits the views into lazy chunks, adds a test harness, and prepares the build for the root of omary.me.

## Dependencies already installed (do NOT run npm install; there is no network)
`react-router-dom@6.30`, `vitest@2`, `jsdom@25`, `@testing-library/react@16`, `@testing-library/jest-dom@6`, `@testing-library/user-event@14` are in `package.json` and `node_modules/`.

## Target routes (English slugs; `:lang` is `ar` or `en`)
| view id (today) | route |
|---|---|
| home | `/:lang` |
| wizard | `/:lang/assess` |
| results | `/:lang/assess/results` |
| pathways | `/:lang/assess/plan` |
| roles | `/:lang/roles` |
| skills | `/:lang/skills` |
| future-skills | `/:lang/future-skills` |
| tech-radar | `/:lang/tech-radar` and `/:lang/tech-radar/:techId` |
| explore | `/:lang/map` (optional `?domain=<domainId>`) |
| careers | `/:lang/careers` and `/:lang/careers/:careerId` |
| lists | `/:lang/careers/trends` (declare BEFORE `careers/:careerId`) |
| decide | `/:lang/guidance` |
| entities | `/:lang/entities` |
| impact | `/:lang/impact` |
| sectors | `/:lang/sectors` (optional `?category=<consulting category>`) |
| directory | `/:lang/directory` |
| entity | `/:lang/directory/:entityId` |
| standards | `/:lang/standards` |
| methodology | `/:lang/methodology` |
| (new) not found | `*` → a small bilingual 404 view with a link home |

- `/` redirects to `/<lang>` where `<lang>` is the stored `dsr-lang` (default `ar`).
- A path whose first segment is not `ar`/`en` renders the 404 view.
- `document.documentElement.lang` and `.dir` follow the URL language (`ar` → `rtl`, `en` → `ltr`); the stored `dsr-lang` is updated from the URL.

## Design — keep the store API so views need (almost) no changes
1. `src/main.tsx`: `createBrowserRouter` (basename `import.meta.env.BASE_URL`) + `RouterProvider`. The `AppProvider` must live INSIDE the router (it uses `useNavigate`, `useLocation`, `useParams`, `useSearchParams`).
2. `src/routes.tsx` (new): the route table above; every view imported with `React.lazy`; one `Suspense` fallback (a minimal centered spinner/skeleton, no new design); `App` becomes the layout route element (Header, `<Outlet/>`, Footer; keep the `AnimatePresence` page transition keyed by `location.pathname`).
3. `src/store.tsx`: keep the exported `View` type and the whole `AppState` interface. Re-implement:
   - `view`: derived from the current location (the view id of the matched route, e.g. `/ar/assess/results` → `'results'`; unknown → `'home'` for header purposes is NOT acceptable — use a new `'not-found'` member or keep `view` as the closest known id; document the choice).
   - `go(view)`: `navigate(pathFor(view, lang))` + scroll to top.
   - `toggleLang()`: navigate to the same path with the other prefix (keep search and hash).
   - `openTech(id)` → `/:lang/tech-radar/:techId`; `openCareer(id)` → `/:lang/careers/:careerId`; `openEntity(id)` → `/:lang/directory/:entityId`; `openDomainAt(domainId)` → `/:lang/map?domain=`; `openSectorsByCategory(c)` → `/:lang/sectors?category=`.
   - `pendingTechId`, `pendingCareerId`, `pendingEntityId`, `pendingDomainId`, `pendingSectorCategory`: derived from the route params / search params so the existing views keep working unchanged. The `clearPending*` functions become no-ops or remove the param — pick what keeps the views' current behavior (read the views first: `TechRadar.tsx`, `Careers.tsx`, `EntityDetail.tsx`, `Explore.tsx`, `GovSectors.tsx`).
   - Export a pure helper `pathFor(view: View, lang: Lang, params?: Record<string,string>)` and `viewFromPath(pathname): View | 'not-found'` in a new `src/lib/routes.ts` so tests can import them without React.
4. Document title: new `src/lib/head.ts` with a bilingual title per view (`رادار المهارات الرقمية — <page>` / `Digital Skills Radar — <page>`) and a hook that sets `document.title` on route change. No meta/OG yet (a later packet does SEO).
5. `src/components/Header.tsx` and `Footer.tsx`: keep using `go()`; mark the active item from `view`. No visual change.
6. Build for omary.me: `vite.config.ts` `base: '/'`; add `public/CNAME` containing exactly `omary.me`; add a `postbuild` script that copies `dist/index.html` to `dist/404.html` (GitHub Pages SPA fallback); keep `public/.nojekyll`-equivalent behavior (`.nojekyll` must end up in `dist/` — add `public/.nojekyll`).
7. Tests: `vitest.config.ts` (environment `jsdom`, globals, setup file importing `@testing-library/jest-dom`); `src/__tests__/routes.test.tsx` covering at least: `/` redirects to `/ar`; `/ar/assess` renders the wizard's first heading; `/en/directory/<a real entity id from src/data/govEntities.ts>` renders that entity's name; `/ar/tech-radar/<a real tech id>` opens with that tech selected (or at least renders the tech radar); `/ar/nope` renders the 404 view; `viewFromPath`/`pathFor` round-trip for all 19 views in both languages. `package.json`: `"test": "vitest run"`, keep `"build": "tsc --noEmit && vite build"`.

## Files you may change
`src/main.tsx`, `src/App.tsx`, `src/store.tsx`, `src/routes.tsx` (new), `src/lib/**` (new), `src/views/NotFound.tsx` (new), `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/__tests__/**` (new), `vitest.config.ts` (new), `vite.config.ts`, `package.json` (scripts only), `public/CNAME` (new), `public/.nojekyll` (new), `index.html` (only if needed for the `<base>`/lang attributes), and minimal edits inside `src/views/TechRadar.tsx`, `src/views/Careers.tsx`, `src/views/EntityDetail.tsx`, `src/views/Explore.tsx`, `src/views/GovSectors.tsx` ONLY where a pending-id read must change. Do not touch `src/data/**`, `src/index.css`, `tailwind.config.js`, other views.

## Done when
- `npm run build` passes (tsc + vite) and `dist/` contains `index.html`, `404.html`, `CNAME`, `.nojekyll`, and MORE than one JS chunk (views are lazy).
- `npm test` passes with the tests above.
- Manual check list written in your final note: back/forward works between pages; reload on `/ar/assess/results` after an assessment shows results; `English` toggle on `/ar/directory/<id>` goes to `/en/directory/<id>`.
- Final note (3–6 lines): what changed, how verified, what was not verified.
