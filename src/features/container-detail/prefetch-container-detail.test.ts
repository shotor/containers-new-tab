import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearPrefetchedContainerDetail,
  peekReadyContainerDetail,
  prefetchContainerDetail,
  takePrefetchedContainerDetail,
} from '@/features/container-detail/prefetch-container-detail'

const { getContainers, listMac } = vi.hoisted(() => ({
  getContainers: vi.fn<() => Promise<unknown[]>>(),
  listMac: vi.fn<() => Promise<unknown[]>>(async () => []),
}))

vi.mock('@/data/extension/extension-storage-api', () => ({
  extensionStorageApi: {
    getContainers,
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
    listMac.mockReset()
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
