import '@testing-library/jest-dom'
import { transferableAbortController } from 'node:util'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// Node's native localStorage can shadow jsdom's storage on newer Node releases.
const { jsdom } = globalThis as unknown as { jsdom: { window: Window } }
vi.stubGlobal('localStorage', jsdom.window.localStorage)
// React Router uses Node's Request; its signal must come from the same realm.
vi.stubGlobal('AbortController', class {
  constructor() { return transferableAbortController() }
})

// jsdom has no layout or scrolling; keep the real views and router mounted.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  })),
})
window.scrollTo = vi.fn()
Element.prototype.scrollIntoView = vi.fn()
vi.stubGlobal('IntersectionObserver', class {
  root = null
  rootMargin = '0px'
  thresholds = [0]
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
})

beforeEach(() => {
  localStorage.clear()
  document.documentElement.lang = ''
  document.documentElement.dir = ''
  document.title = ''
})

afterEach(() => cleanup())
