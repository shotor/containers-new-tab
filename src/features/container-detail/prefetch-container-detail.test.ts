import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearPrefetchedContainerDetail,
  peekReadyContainerDetail,
  prefetchContainerDetail,
  takePrefetchedContainerDetail,
} from '@/features/container-detail/prefetch-container-detail'

const { getContainers, getProxyForContainer, listMac } = vi.hoisted(() => ({
  getContainers: vi.fn<() => Promise<unknown[]>>(),
  getProxyForContainer: vi.fn<() => Promise<null>>(async () => null),
  listMac: vi.fn<() => Promise<unknown[]>>(async () => []),
}))

vi.mock('@/data/extension/extension-storage-api', () => ({
  extensionStorageApi: {
    getContainers,
    getProxyForContainer,
  },
}))

vi.mock('@/data/browser/browser-api', async () => {
  const actual = await vi.importActual<
    typeof import('@/data/browser/browser-api')
  >('@/data/browser/browser-api')
  return {
    ...actual,
    listMacAssignmentsForContainer: listMac,
  }
})

describe('prefetchContainerDetail', () => {
  beforeEach(() => {
    clearPrefetchedContainerDetail('firefox-container-1')
    getContainers.mockReset()
    getProxyForContainer.mockReset()
    listMac.mockReset()
    getProxyForContainer.mockResolvedValue(null)
    listMac.mockResolvedValue([])
  })

  it('resolves into peekReady and can be taken once', async () => {
    getContainers.mockResolvedValue([
      {
        color: 'blue',
        cookieStoreId: 'firefox-container-1',
        icon: 'briefcase',
        name: 'Work',
      },
    ])

    prefetchContainerDetail('firefox-container-1')

    expect(peekReadyContainerDetail('firefox-container-1')).toBeUndefined()

    await vi.waitFor(() => {
      expect(
        peekReadyContainerDetail('firefox-container-1')?.identity.name,
      ).toBe('Work')
    })

    const taken = takePrefetchedContainerDetail('firefox-container-1')

    expect(taken).toBeDefined()
    await expect(taken).resolves.toMatchObject({
      identity: { name: 'Work' },
    })
    expect(peekReadyContainerDetail('firefox-container-1')).toBeUndefined()
    expect(takePrefetchedContainerDetail('firefox-container-1')).toBeUndefined()
  })
})
