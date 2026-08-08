import { afterEach, describe, expect, it, vi } from 'vitest'
import { act } from 'preact/test-utils'
import type { ProxyFormValues } from '@/features/container-detail/container-detail.schema'
import { renderHook } from '@/test/render-hook'
import { useProxyAutosave } from '@/features/container-detail/hooks/use-proxy-autosave'

const { setProxyForContainer } = vi.hoisted(() => ({
  setProxyForContainer: vi.fn<() => Promise<void>>(async () => undefined),
}))

vi.mock('@/data/extension/extension-storage-api', () => ({
  extensionStorageApi: {
    setProxyForContainer,
  },
}))

describe('useProxyAutosave', () => {
  afterEach(() => {
    vi.useRealTimers()
    setProxyForContainer.mockReset()
  })

  it('persists a valid proxy after debounce', async () => {
    vi.useFakeTimers()
    const lastProxySavedRef = { current: null as ProxyFormValues | null }
    const setPending = vi.fn<() => void>()
    const markSaved = vi.fn<() => void>()
    const resetSave = vi.fn<() => void>()

    renderHook(() =>
      useProxyAutosave({
        activeCookieStoreId: 'firefox-container-1',
        doNotProxyLocal: true,
        host: 'proxy.example',
        lastProxySavedRef,
        loading: false,
        markSaved,
        password: '',
        port: '8080',
        resetSave,
        setPending,
        type: 'http',
        username: '',
      }),
    )

    expect(setPending).toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })

    expect(setProxyForContainer).toHaveBeenCalledWith(
      'firefox-container-1',
      expect.objectContaining({
        host: 'proxy.example',
        port: 8080,
        type: 'http',
      }),
    )
    expect(markSaved).toHaveBeenCalled()
  })

  it('resets save status when the proxy form is invalid', () => {
    const resetSave = vi.fn<() => void>()
    renderHook(() =>
      useProxyAutosave({
        activeCookieStoreId: 'firefox-container-1',
        doNotProxyLocal: true,
        host: '',
        lastProxySavedRef: { current: null },
        loading: false,
        markSaved: vi.fn<() => void>(),
        password: '',
        port: '80',
        resetSave,
        setPending: vi.fn<() => void>(),
        type: 'http',
        username: '',
      }),
    )

    expect(resetSave).toHaveBeenCalled()
    expect(setProxyForContainer).not.toHaveBeenCalled()
  })
})
