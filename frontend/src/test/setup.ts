import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { resetEnvironmentCacheForTests } from '../shared/config/environment'

beforeEach(() => {
  vi.stubEnv('VITE_API_URL', 'http://localhost:3000')
  resetEnvironmentCacheForTests()
})

afterEach(() => {
  cleanup()
  sessionStorage.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  resetEnvironmentCacheForTests()
  window.history.replaceState(null, '', '/')
})
