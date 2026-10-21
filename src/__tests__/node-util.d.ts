// The app has no @types/node dependency; only this test-side API is needed.
declare module 'node:util' {
  export function transferableAbortController(): AbortController
}
