import { beforeEach, describe, expect, it, vi } from 'vitest'

import { shortcutsApi } from '@/data/shortcuts/shortcuts-api'

let store: Record<string, unknown>

beforeEach(() => {
  store = {}
  vi.stubGlobal('navigator', {
    locks: {
      request: (_name: string, callback: () => Promise<unknown>) => callback(),
    },
  })
  vi.stubGlobal('browser', {
    storage: {
      local: {
        get: async (key: string) => structuredClone({ [key]: store[key] }),
        set: async (patch: Record<string, unknown>) => {
          store = { ...store, ...structuredClone(patch) }
        },
      },
    },
  })
})

describe('shortcutsApi', () => {
  it('adds a normalised shortcut defaulting to no container, then removes it', async () => {
    const added = await shortcutsApi.add({ url: 'news.ycombinator.com/' })
    expect(added).toEqual({
      cookieStoreId: 'firefox-default',
      id: expect.any(String),
      url: 'https://news.ycombinator.com',
    })
    expect(await shortcutsApi.get()).toEqual([added])

    await shortcutsApi.remove(added.id)
    expect(await shortcutsApi.get()).toEqual([])
  })

  it('keeps the chosen container and rejects duplicates and junk', async () => {
    await shortcutsApi.add({
      cookieStoreId: 'firefox-container-1',
      url: 'https://github.com/notifications',
    })
    expect((await shortcutsApi.get())[0].cookieStoreId).toBe(
      'firefox-container-1',
    )

    await expect(
      shortcutsApi.add({ url: 'github.com/notifications' }),
    ).rejects.toThrow('already a shortcut')
    await expect(shortcutsApi.add({ url: '   ' })).rejects.toThrow(
      'valid website',
    )
    expect(await shortcutsApi.get()).toHaveLength(1)
  })

  it('updates address and container, guarding duplicates and missing ids', async () => {
    const a = await shortcutsApi.add({ url: 'a.example' })
    await shortcutsApi.add({ url: 'b.example' })

    const updated = await shortcutsApi.update(a.id, {
      cookieStoreId: 'firefox-container-2',
      url: 'a.example/inbox',
    })
    expect(updated).toEqual({
      cookieStoreId: 'firefox-container-2',
      id: a.id,
      url: 'https://a.example/inbox',
    })
    expect((await shortcutsApi.get())[0]).toEqual(updated)

    // Keeping its own address is fine; taking another's is not.
    await expect(
      shortcutsApi.update(a.id, { url: 'a.example/inbox' }),
    ).resolves.toEqual(updated)
    await expect(
      shortcutsApi.update(a.id, { url: 'b.example' }),
    ).rejects.toThrow('already a shortcut')
    await expect(
      shortcutsApi.update('missing', { url: 'c.example' }),
    ).rejects.toThrow('no longer exists')
  })
})
