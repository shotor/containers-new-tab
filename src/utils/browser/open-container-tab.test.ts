import { beforeEach, describe, expect, it, vi } from 'vitest'
import { openContainerTab } from '@/utils/browser/open-container-tab'

const { bumpUsage, getCurrent, create, remove } = vi.hoisted(() => ({
  bumpUsage: vi.fn<(cookieStoreId: string) => Promise<void>>(
    async () => undefined,
  ),
  create: vi.fn<() => Promise<unknown>>(async () => ({})),
  getCurrent: vi.fn<() => Promise<{ id?: number } | undefined>>(),
  remove: vi.fn<() => Promise<void>>(async () => undefined),
}))

vi.mock('@/data/extension/extension-storage-api', () => ({
  extensionStorageApi: {
    bumpUsage,
  },
}))

describe('openContainerTab', () => {
  beforeEach(() => {
    bumpUsage.mockClear()
    getCurrent.mockReset()
    create.mockClear()
    remove.mockClear()
    getCurrent.mockResolvedValue({ id: 7 })
    vi.stubGlobal('browser', {
      tabs: { create, getCurrent, remove },
    })
  })

  it('bumps usage, creates a tab, and replaces the current tab by default', async () => {
    await openContainerTab('firefox-container-1', 'https://example.com')

    expect(bumpUsage).toHaveBeenCalledWith('firefox-container-1')
    expect(create).toHaveBeenCalledWith({
      active: true,
      cookieStoreId: 'firefox-container-1',
      url: 'https://example.com',
    })
    expect(remove).toHaveBeenCalledWith(7)
  })

  it('opens beside without removing the current tab', async () => {
    await openContainerTab('firefox-container-1', undefined, {
      replaceCurrent: false,
    })

    expect(create).toHaveBeenCalledWith({
      active: false,
      cookieStoreId: 'firefox-container-1',
    })
    expect(remove).not.toHaveBeenCalled()
  })
})
