import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getItem } from '@/data/extension/api/get-item'
import { proxyCache } from '@/data/proxy/proxy-cache'
import { refreshProxyCache } from '@/data/proxy/api/refresh-proxy-cache'

vi.mock('@/data/extension/api/get-item', () => ({
  getItem: vi.fn<() => Promise<Record<string, unknown>>>(),
}))

describe('refreshProxyCache', () => {
  beforeEach(() => {
    proxyCache.current = {}
    vi.mocked(getItem).mockReset()
  })

  it('reloads containerProxies into the cache', async () => {
    vi.mocked(getItem).mockResolvedValue({
      a: {
        doNotProxyLocal: true,
        host: 'h',
        port: 1,
        type: 'http',
      },
    })

    await refreshProxyCache()
    expect(getItem).toHaveBeenCalledWith('containerProxies')
    expect(proxyCache.current.a?.type).toBe('http')
  })
})
