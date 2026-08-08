import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_STORE, type ExtensionStorageObject } from '@/data/types'
import { getProxyForContainer } from '@/data/extension/api/get-proxy-for-container'

describe('getProxyForContainer', () => {
  let store: ExtensionStorageObject

  beforeEach(() => {
    store = {
      ...DEFAULT_STORE,
      containerProxies: {
        a: {
          doNotProxyLocal: true,
          host: 'h',
          port: 8080,
          type: 'http',
        },
        b: {
          doNotProxyLocal: true,
          host: '',
          port: 0,
          type: 'direct',
        },
      },
    }

    vi.stubGlobal('browser', {
      storage: {
        local: {
          get: vi.fn<
            (
              key: keyof ExtensionStorageObject,
            ) => Promise<Partial<ExtensionStorageObject>>
          >(async (key) => ({
            [key]: store[key],
          })),
        },
      },
    })
  })

  it('returns a non-direct proxy', async () => {
    await expect(getProxyForContainer('a')).resolves.toMatchObject({
      host: 'h',
      type: 'http',
    })
  })

  it('returns null for missing or direct proxies', async () => {
    await expect(getProxyForContainer('missing')).resolves.toBeNull()
    await expect(getProxyForContainer('b')).resolves.toBeNull()
  })
})
