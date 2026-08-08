import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_STORE, type ExtensionStorageObject } from '@/data/types'
import { purgeProxyForContainer } from '@/data/extension/api/purge-proxy-for-container'

describe('purgeProxyForContainer', () => {
  let store: ExtensionStorageObject

  beforeEach(() => {
    store = {
      ...DEFAULT_STORE,
      containerProxies: {
        a: {
          doNotProxyLocal: false,
          host: 's',
          port: 1,
          type: 'socks',
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
          set: vi.fn<(patch: Partial<ExtensionStorageObject>) => Promise<void>>(
            async (patch) => {
              store = { ...store, ...patch }
            },
          ),
        },
      },
    })
  })

  it('removes the stored proxy for a container', async () => {
    await purgeProxyForContainer('a')
    expect(store.containerProxies.a).toBeUndefined()
  })
})
