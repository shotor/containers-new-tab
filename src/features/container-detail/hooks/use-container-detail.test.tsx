import { describe, expect, it, vi } from 'vitest'
import { act } from 'preact/test-utils'
import { renderHook } from '@/test/render-hook'
import { useContainerDetail } from '@/features/container-detail/hooks/use-container-detail'

const {
  navigate,
  getContainers,
  getProxyForContainer,
  listMac,
  removeContainer,
  purgeProxy,
  purgeUsage,
} = vi.hoisted(() => ({
  getContainers: vi.fn<() => Promise<unknown[]>>(),
  getProxyForContainer: vi.fn<() => Promise<null>>(async () => null),
  listMac: vi.fn<
    () => Promise<Array<{ cookieStoreId: string; host: string; url: string }>>
  >(async () => [
    {
      cookieStoreId: 'firefox-container-1',
      host: 'example.com',
      url: 'https://example.com',
    },
  ]),
  navigate: vi.fn<(to: string) => void>(),
  purgeProxy: vi.fn<() => Promise<void>>(async () => undefined),
  purgeUsage: vi.fn<() => Promise<void>>(async () => undefined),
  removeContainer: vi.fn<() => Promise<void>>(async () => undefined),
}))

vi.mock('wouter', () => ({
  useLocation: () => ['/', navigate],
}))

vi.mock('@/data/extension/extension-storage-api', () => ({
  extensionStorageApi: {
    getContainers,
    getProxyForContainer,
    purgeProxyForContainer: purgeProxy,
    purgeUsageForContainer: purgeUsage,
  },
}))

vi.mock('@/data/browser/browser-api', async () => {
  const actual = await vi.importActual<
    typeof import('@/data/browser/browser-api')
  >('@/data/browser/browser-api')
  return {
    ...actual,
    listMacAssignmentsForContainer: listMac,
    removeContainer,
  }
})

vi.mock('@/features/container-detail/hooks/use-identity-autosave', () => ({
  useIdentityAutosave: () => undefined,
}))

vi.mock('@/features/container-detail/hooks/use-proxy-autosave', () => ({
  useProxyAutosave: () => undefined,
}))

describe('useContainerDetail', () => {
  it('loads an existing container into the form', async () => {
    getContainers.mockResolvedValue([
      {
        color: 'blue',
        cookieStoreId: 'firefox-container-1',
        icon: 'briefcase',
        name: 'Work',
      },
    ])

    const { result, rerender } = renderHook(() =>
      useContainerDetail({ cookieStoreId: 'firefox-container-1' }),
    )

    expect(result.current.loading).toBe(true)

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    rerender()

    expect(result.current.loading).toBe(false)
    expect(result.current.title).toBe('Work')
    expect(result.current.sites).toEqual([
      {
        cookieStoreId: 'firefox-container-1',
        host: 'example.com',
        url: 'https://example.com',
      },
    ])
    expect(result.current.values.color).toBe('blue')
  })

  it('deletes the container and returns home', async () => {
    getContainers.mockResolvedValue([
      {
        color: 'blue',
        cookieStoreId: 'firefox-container-1',
        icon: 'briefcase',
        name: 'Work',
      },
    ])

    const { result, rerender } = renderHook(() =>
      useContainerDetail({ cookieStoreId: 'firefox-container-1' }),
    )

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    rerender()

    await act(async () => {
      await result.current.deleteContainer()
    })

    expect(removeContainer).toHaveBeenCalledWith('firefox-container-1')
    expect(purgeProxy).toHaveBeenCalledWith('firefox-container-1')
    expect(purgeUsage).toHaveBeenCalledWith('firefox-container-1')
    expect(navigate).toHaveBeenCalledWith('/')
  })
})
