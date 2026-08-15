import { describe, expect, it, vi } from 'vitest'
import { getApiUrl, resetEnvironmentCacheForTests } from './environment'

describe('getApiUrl', () => {
  it('normalizes a valid trailing slash', () => {
    vi.stubEnv('VITE_API_URL', 'https://api.curime.test/')
    resetEnvironmentCacheForTests()
    expect(getApiUrl()).toBe('https://api.curime.test/')
  })

  it('names a missing variable without exposing another value', () => {
    vi.stubEnv('VITE_API_URL', '')
    resetEnvironmentCacheForTests()
    expect(() => getApiUrl()).toThrow('VITE_API_URL')
  })

  it('rejects non-http configuration', () => {
    vi.stubEnv('VITE_API_URL', 'file:///tmp/api')
    resetEnvironmentCacheForTests()
    expect(() => getApiUrl()).toThrow('HTTP(S)')
  })

  it('rejects a URL path because the contract requires an origin', () => {
    vi.stubEnv('VITE_API_URL', 'https://api.curime.test/v1')
    resetEnvironmentCacheForTests()
    expect(() => getApiUrl()).toThrow('origen')
  })
})
