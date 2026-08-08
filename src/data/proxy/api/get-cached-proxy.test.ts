import { beforeEach, describe, expect, it } from 'vitest'
import { getCachedProxy } from '@/data/proxy/api/get-cached-proxy'
import { proxyCache } from '@/data/proxy/proxy-cache'

describe('getCachedProxy', () => {
  beforeEach(() => {
    proxyCache.current = {}
  })

  it('returns null for missing or direct proxies', () => {
    expect(getCachedProxy(undefined)).toBeNull()
    expect(getCachedProxy('missing')).toBeNull()
    proxyCache.current = {
      a: {
        doNotProxyLocal: true,
        host: '',
        port: 0,
        type: 'direct',
      },
    }
    expect(getCachedProxy('a')).toBeNull()
  })

  it('returns cached non-direct proxies', () => {
    const proxy = {
      doNotProxyLocal: false,
      host: '127.0.0.1',
      port: 1080,
      type: 'socks' as const,
    }
    proxyCache.current = { a: proxy }
    expect(getCachedProxy('a')).toEqual(proxy)
  })
})
