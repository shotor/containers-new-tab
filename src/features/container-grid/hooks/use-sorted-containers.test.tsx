import { afterEach, describe, expect, it, vi } from 'vitest'
import { act } from 'preact/test-utils'
import { renderHook } from '@/test/render-hook'
import { useSortedContainers } from '@/features/container-grid/hooks/use-sorted-containers'

const { get, set, getContainers } = vi.hoisted(() => ({
  get: vi.fn<(key: string) => Promise<unknown>>(),
  getContainers: vi.fn<() => Promise<unknown[]>>(),
  set: vi.fn<() => Promise<void>>(async () => undefined),
}))

vi.mock('@/data/extension/extension-storage-api', () => ({
  extensionStorageApi: {
    get,
    getContainers,
    set,
  },
}))

describe('useSortedContainers', () => {
  afterEach(() => {
    get.mockReset()
    set.mockReset()
    getContainers.mockReset()
  })

  it('loads and sorts containers, and persists sort mode', async () => {
    get.mockImplementation(async (key: string) => {
      if (key === 'sortMode') {
        return 'alpha'
      }
      if (key === 'usageCounts') {
        return {}
      }
      if (key === 'customOrder') {
        return []
      }
      return undefined
    })
    getContainers.mockResolvedValue([
      { cookieStoreId: 'b', name: 'Beta' },
      { cookieStoreId: 'a', name: 'Alpha' },
    ])

    const listeners: {
      created: Array<() => void>
      updated: Array<() => void>
      removed: Array<() => void>
      storage: Array<(changes: unknown, area: string) => void>
    } = { created: [], removed: [], storage: [], updated: [] }

    vi.stubGlobal('browser', {
      contextualIdentities: {
        onCreated: {
          addListener: (fn: () => void) => listeners.created.push(fn),
          removeListener: vi.fn<() => void>(),
        },
        onRemoved: {
          addListener: (fn: () => void) => listeners.removed.push(fn),
          removeListener: vi.fn<() => void>(),
        },
        onUpdated: {
          addListener: (fn: () => void) => listeners.updated.push(fn),
          removeListener: vi.fn<() => void>(),
        },
      },
      storage: {
        onChanged: {
          addListener: (fn: (changes: unknown, area: string) => void) =>
            listeners.storage.push(fn),
          removeListener: vi.fn<() => void>(),
        },
      },
    })

    const { result, rerender, unmount } = renderHook(() =>
      useSortedContainers(),
    )

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    rerender()

    expect(result.current.sortMode).toBe('alpha')
    expect(result.current.containers.map((c) => c.name)).toEqual([
      'Alpha',
      'Beta',
    ])

    await act(async () => {
      await result.current.setSortMode('mostUsed')
    })
    rerender()
    expect(set).toHaveBeenCalledWith({ sortMode: 'mostUsed' })

    unmount()
  })
})
