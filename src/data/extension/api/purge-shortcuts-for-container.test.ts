import { beforeEach, describe, expect, it, vi } from 'vitest'

import { purgeShortcutsForContainer } from '@/data/extension/api/purge-shortcuts-for-container'

let store: Record<string, unknown>
const set = vi.fn(async (patch: Record<string, unknown>) => {
  store = { ...store, ...patch }
})

beforeEach(() => {
  set.mockClear()
  store = {
    shortcuts: [
      {
        cookieStoreId: 'firefox-container-1',
        id: 'a',
        url: 'https://a.example',
      },
      {
        cookieStoreId: 'firefox-container-2',
        id: 'b',
        url: 'https://b.example',
      },
    ],
  }
  vi.stubGlobal('browser', {
    storage: {
      local: { get: async (key: string) => ({ [key]: store[key] }), set },
    },
  })
})

describe('purgeShortcutsForContainer', () => {
  it('reassigns the deleted container’s shortcuts to no container', async () => {
    await purgeShortcutsForContainer('firefox-container-1')
    expect(store.shortcuts).toEqual([
      { cookieStoreId: 'firefox-default', id: 'a', url: 'https://a.example' },
      {
        cookieStoreId: 'firefox-container-2',
        id: 'b',
        url: 'https://b.example',
      },
    ])
  })

  it('writes nothing when no shortcut used the container', async () => {
    await purgeShortcutsForContainer('firefox-container-9')
    expect(set).not.toHaveBeenCalled()
  })
})
