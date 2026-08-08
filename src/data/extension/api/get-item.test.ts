import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_STORE, type ExtensionStorageObject } from '@/data/types'
import { getItem } from '@/data/extension/api/get-item'

describe('getItem', () => {
  let store: ExtensionStorageObject

  beforeEach(() => {
    store = {
      ...DEFAULT_STORE,
      sortMode: 'alpha',
      usageCounts: { a: 2 },
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

  it('reads and parses a single storage key', async () => {
    await expect(getItem('sortMode')).resolves.toBe('alpha')
    await expect(getItem('usageCounts')).resolves.toEqual({ a: 2 })
  })

  it('falls back to defaults when the stored value is invalid', async () => {
    store.sortMode = 'nope' as ExtensionStorageObject['sortMode']
    await expect(getItem('sortMode')).resolves.toBe('mostUsed')
  })
})
