import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_STORE, type ExtensionStorageObject } from '@/data/types'
import { setProxyForContainer } from '@/data/extension/api/set-proxy-for-container'

describe('setProxyForContainer', () => {
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

  it('stores a non-direct proxy', async () => {
    await setProxyForContainer('b', {
      doNotProxyLocal: false,
      host: 's',
      port: 1,
      type: 'socks',
    })
    expect(store.containerProxies.b).toMatchObject({ host: 's', type: 'socks' })
  })

  it('clears the entry for null or direct', async () => {
    await setProxyForContainer('a', null)
    expect(store.containerProxies.a).toBeUndefined()

    store.containerProxies.a = {
      doNotProxyLocal: true,
      host: 'h',
      port: 1,
      type: 'http',
    }
    await setProxyForContainer('a', {
      doNotProxyLocal: true,
      host: '',
      port: 0,
      type: 'direct',
    })
    expect(store.containerProxies.a).toBeUndefined()
  })
})
