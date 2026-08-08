import { describe, expect, it, vi } from 'vitest'
import { act } from 'preact/test-utils'
import { DEFAULT_COOKIE_STORE } from '@/data/browser/types'
import { renderHook } from '@/test/render-hook'
import { useCurrentStoreId } from '@/features/container-grid/hooks/use-current-store-id'

describe('useCurrentStoreId', () => {
  it('loads the current tab cookieStoreId', async () => {
    vi.stubGlobal('browser', {
      tabs: {
        getCurrent: vi.fn<() => Promise<{ cookieStoreId: string }>>(
          async () => ({
            cookieStoreId: 'firefox-container-9',
          }),
        ),
      },
    })

    const { result, rerender } = renderHook(() => useCurrentStoreId())
    expect(result.current).toBe(DEFAULT_COOKIE_STORE)

    await act(async () => {
      await Promise.resolve()
    })
    rerender()
    expect(result.current).toBe('firefox-container-9')
  })

  it('falls back when getCurrent fails', async () => {
    vi.stubGlobal('browser', {
      tabs: {
        getCurrent: vi.fn<() => Promise<never>>(async () => {
          throw new Error('no tab')
        }),
      },
    })

    const { result, rerender } = renderHook(() => useCurrentStoreId())
    await act(async () => {
      await Promise.resolve()
    })
    rerender()
    expect(result.current).toBe(DEFAULT_COOKIE_STORE)
  })
})
