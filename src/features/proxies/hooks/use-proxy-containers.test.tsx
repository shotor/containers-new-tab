import { act } from 'preact/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { useProxyContainers } from '@/features/proxies/hooks/use-proxy-containers'

import { renderHook } from '@/test/render-hook'

vi.mock('@/features/proxies/hooks/use-proxy-library', () => ({
  useProxyLibrary: () => ({
    error: '',
    library: {
      assignments: { personal: 'other', work: 'office' },
      proxies: {},
    },
    loading: false,
  }),
}))

vi.mock('@/data/browser/browser-api', () => ({
  getContainers: async () => [
    { cookieStoreId: 'work', name: 'Work' },
    { cookieStoreId: 'personal', name: 'Personal' },
  ],
}))

describe('useProxyContainers', () => {
  it('shows only identities assigned to the selected proxy', async () => {
    const event = {
      addListener: vi.fn<() => void>(),
      removeListener: vi.fn<() => void>(),
    }

    vi.stubGlobal('browser', {
      contextualIdentities: {
        onCreated: event,
        onRemoved: event,
        onUpdated: event,
      },
    })

    const { result, rerender } = renderHook(() => useProxyContainers('office'))

    await act(async () => {
      await Promise.resolve()
    })

    rerender()

    expect(result.current.containers).toEqual([
      { cookieStoreId: 'work', name: 'Work' },
    ])

    expect(result.current.loading).toBe(false)
  })
})
