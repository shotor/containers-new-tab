import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_STORE, type ExtensionStorageObject } from '@/data/types'
import { purgeUsageForContainer } from '@/data/extension/api/purge-usage-for-container'

describe('purgeUsageForContainer', () => {
  let store: ExtensionStorageObject

  beforeEach(() => {
    store = {
      ...DEFAULT_STORE,
      customOrder: ['a', 'b'],
      usageCounts: { a: 3, b: 1 },
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

  it('drops usage and custom-order entries for the container', async () => {
    await purgeUsageForContainer('a')
    expect(store.usageCounts.a).toBeUndefined()
    expect(store.usageCounts.b).toBe(1)
    expect(store.customOrder).toEqual(['b'])
  })
})
