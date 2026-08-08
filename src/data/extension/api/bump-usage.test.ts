import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_STORE, type ExtensionStorageObject } from '@/data/types'
import { bumpUsage } from '@/data/extension/api/bump-usage'

describe('bumpUsage', () => {
  let store: ExtensionStorageObject

  beforeEach(() => {
    store = {
      ...DEFAULT_STORE,
      usageCounts: { a: 1 },
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

  it('increments an existing usage count', async () => {
    await bumpUsage('a')
    expect(store.usageCounts.a).toBe(2)
  })

  it('starts at 1 for a new cookieStoreId', async () => {
    await bumpUsage('b')
    expect(store.usageCounts.b).toBe(1)
  })
})
