import { describe, expect, it } from 'vitest'
import { shouldSkipLocal } from '@/data/proxy/utils/should-skip-local'

const proxy = {
  doNotProxyLocal: true,
  host: 'proxy.example',
  port: 8080,
  type: 'http' as const,
}

describe('shouldSkipLocal', () => {
  it('returns false when local bypass is off', () => {
    expect(
      shouldSkipLocal(
        { ...proxy, doNotProxyLocal: false },
        'http://localhost/',
      ),
    ).toBe(false)
  })

  it('skips localhost variants when enabled', () => {
    expect(shouldSkipLocal(proxy, 'http://localhost/x')).toBe(true)
    expect(shouldSkipLocal(proxy, 'http://127.0.0.1/')).toBe(true)
    expect(shouldSkipLocal(proxy, 'http://foo.localhost/')).toBe(true)
    expect(shouldSkipLocal(proxy, 'https://example.com/')).toBe(false)
  })

  it('returns false for unparseable URLs', () => {
    expect(shouldSkipLocal(proxy, 'not a url')).toBe(false)
  })
})
