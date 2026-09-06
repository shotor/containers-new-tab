import { afterEach, describe, expect, it, vi } from 'vitest'
import { act } from 'preact/test-utils'
import { renderHook } from '@/test/render-hook'
import { useProxySort } from '@/features/proxies/hooks/use-proxy-sort'

const { get, set } = vi.hoisted(() => ({
  get: vi.fn<(key: string) => Promise<unknown>>(),
  set: vi.fn<() => Promise<void>>(async () => undefined),
}))

vi.mock('@/data/extension/extension-storage-api', () => ({
  extensionStorageApi: { get, set },
}))

describe('useProxySort', () => {
  afterEach(() => {
    get.mockReset()
    set.mockReset()
    vi.unstubAllGlobals()
  })

  it('loads the stored sort, toggles direction on re-select, and persists', async () => {
    get.mockImplementation(async (key: string) =>
      key === 'proxySortMode' ? 'port' : 'asc',
    )
    const storageListeners: Array<(changes: unknown, area: string) => void> = []
    vi.stubGlobal('browser', {
      storage: {
        onChanged: {
          addListener: (fn: (changes: unknown, area: string) => void) =>
            storageListeners.push(fn),
          removeListener: vi.fn<() => void>(),
        },
      },
    })

    const { result, rerender, unmount } = renderHook(() => useProxySort())
    await act(async () => {
      await Promise.resolve()
    })
    rerender()
    expect(result.current.sortMode).toBe('port')
    expect(result.current.sortDirection).toBe('asc')

    await act(async () => {
      await result.current.setSortMode('port')
    })
    rerender()
    expect(result.current.sortDirection).toBe('desc')
    expect(set).toHaveBeenLastCalledWith({
      proxySortDirection: 'desc',
      proxySortMode: 'port',
    })

    await act(async () => {
      await result.current.setSortMode('name')
    })
    rerender()
    expect(result.current.sortMode).toBe('name')
    expect(result.current.sortDirection).toBe('asc')

    // Another tab changing the stored sort is picked up.
    get.mockImplementation(async (key: string) =>
      key === 'proxySortMode' ? 'containers' : 'desc',
    )
    await act(async () => {
      storageListeners.forEach((fn) => fn({ proxySortMode: {} }, 'local'))
      await Promise.resolve()
    })
    rerender()
    expect(result.current.sortMode).toBe('containers')
    expect(result.current.sortDirection).toBe('desc')

    unmount()
  })
})
