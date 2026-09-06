import { act } from 'preact/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useShortcuts } from '@/features/shortcuts/hooks/use-shortcuts'

import { renderHook } from '@/test/render-hook'

const { add, get, remove, update } = vi.hoisted(() => ({
  add: vi.fn(),
  get: vi.fn(),
  remove: vi.fn(async () => undefined),
  update: vi.fn(),
}))

vi.mock('@/data/shortcuts/shortcuts-api', () => ({
  shortcutsApi: { add, get, remove, update },
}))

const stored = {
  cookieStoreId: 'firefox-default',
  id: 's1',
  url: 'https://a.example',
}

describe('useShortcuts', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('loads shortcuts, adds and removes, and follows storage changes', async () => {
    get.mockResolvedValue([stored])
    const listeners: Array<(changes: unknown, area: string) => void> = []
    vi.stubGlobal('browser', {
      storage: {
        onChanged: {
          addListener: (fn: (changes: unknown, area: string) => void) =>
            listeners.push(fn),
          removeListener: vi.fn(),
        },
      },
    })

    const { result, rerender, unmount } = renderHook(() => useShortcuts())
    await act(async () => {
      await Promise.resolve()
    })
    rerender()
    expect(result.current.loading).toBe(false)
    expect(result.current.shortcuts).toEqual([stored])

    const created = {
      cookieStoreId: 'firefox-container-1',
      id: 's2',
      url: 'https://b.example',
    }
    add.mockResolvedValue(created)
    await act(async () => {
      await result.current.add({
        cookieStoreId: 'firefox-container-1',
        url: 'b.example',
      })
    })
    rerender()
    expect(add).toHaveBeenCalledWith({
      cookieStoreId: 'firefox-container-1',
      url: 'b.example',
    })
    expect(result.current.shortcuts).toEqual([stored, created])

    const edited = { ...stored, cookieStoreId: 'firefox-container-1' }
    update.mockResolvedValue(edited)
    await act(async () => {
      await result.current.update('s1', {
        cookieStoreId: 'firefox-container-1',
        url: 'a.example',
      })
    })
    rerender()
    expect(update).toHaveBeenCalledWith('s1', {
      cookieStoreId: 'firefox-container-1',
      url: 'a.example',
    })
    expect(result.current.shortcuts).toEqual([edited, created])

    await act(async () => {
      await result.current.remove('s1')
    })
    rerender()
    expect(remove).toHaveBeenCalledWith('s1')
    expect(result.current.shortcuts).toEqual([created])

    get.mockResolvedValue([])
    await act(async () => {
      listeners.forEach((fn) => fn({ shortcuts: {} }, 'local'))
      await Promise.resolve()
    })
    rerender()
    expect(result.current.shortcuts).toEqual([])

    unmount()
  })
})
