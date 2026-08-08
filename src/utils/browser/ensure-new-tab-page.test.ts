import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ensureNewTabPage,
  newTabUrl,
} from '@/utils/browser/ensure-new-tab-page'

describe('ensureNewTabPage', () => {
  const update = vi.fn<() => Promise<void>>(async () => undefined)
  const create = vi.fn<() => Promise<void>>(async () => undefined)
  const remove = vi.fn<() => Promise<void>>(async () => undefined)
  const query = vi.fn<() => Promise<browser.tabs.Tab[]>>(async () => [])

  beforeEach(() => {
    update.mockClear()
    create.mockClear()
    remove.mockClear()
    query.mockReset()
    vi.stubGlobal('browser', {
      runtime: {
        getURL: (path: string) => `moz-extension://ext-id/${path}`,
        id: 'ext-id',
      },
      tabs: { create, query, remove, update },
    })
  })

  it('builds the new-tab URL from the runtime id', () => {
    expect(newTabUrl()).toBe('moz-extension://ext-id/src/index.html')
  })

  it('repairs broken startup tabs and does not create another', async () => {
    query
      .mockResolvedValueOnce([
        { id: 1, url: 'http://0.0.0.0/' },
        { id: 2, url: 'https://example.com/' },
      ] as browser.tabs.Tab[])
      .mockResolvedValueOnce([
        { id: 1, url: 'moz-extension://ext-id/src/index.html' },
        { id: 2, url: 'https://example.com/' },
      ] as browser.tabs.Tab[])

    await ensureNewTabPage((url) => url === 'http://0.0.0.0/')

    expect(update).toHaveBeenCalledWith(1, {
      active: true,
      url: 'moz-extension://ext-id/src/index.html',
    })
    expect(create).not.toHaveBeenCalled()
  })

  it('creates a new-tab page when none of ours are open', async () => {
    query
      .mockResolvedValueOnce([
        { id: 1, url: 'https://example.com/' },
      ] as browser.tabs.Tab[])
      .mockResolvedValueOnce([
        { id: 1, url: 'https://example.com/' },
      ] as browser.tabs.Tab[])

    await ensureNewTabPage(() => false)

    expect(update).not.toHaveBeenCalled()
    expect(create).toHaveBeenCalledWith({
      active: true,
      url: 'moz-extension://ext-id/src/index.html',
    })
  })

  it('closes Firefox home and focuses our page', async () => {
    query
      .mockResolvedValueOnce([
        { id: 1, url: 'about:home' },
        { id: 2, url: 'moz-extension://ext-id/src/index.html' },
      ] as browser.tabs.Tab[])
      .mockResolvedValueOnce([
        { id: 2, url: 'moz-extension://ext-id/src/index.html' },
      ] as browser.tabs.Tab[])

    await ensureNewTabPage(() => false)

    expect(remove).toHaveBeenCalledWith(1)
    expect(update).toHaveBeenCalledWith(2, { active: true })
    expect(create).not.toHaveBeenCalled()
  })

  it('does nothing destructive when only our page is open', async () => {
    query
      .mockResolvedValueOnce([
        { id: 1, url: 'moz-extension://ext-id/src/index.html' },
      ] as browser.tabs.Tab[])
      .mockResolvedValueOnce([
        { id: 1, url: 'moz-extension://ext-id/src/index.html' },
      ] as browser.tabs.Tab[])

    await ensureNewTabPage(() => false)

    expect(remove).not.toHaveBeenCalled()
    expect(create).not.toHaveBeenCalled()
    expect(update).toHaveBeenCalledWith(1, { active: true })
  })
})
