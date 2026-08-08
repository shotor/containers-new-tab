import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setStore } from '@/data/extension/api/set-store'

describe('setStore', () => {
  const set = vi.fn<() => Promise<void>>(async () => undefined)

  beforeEach(() => {
    set.mockClear()
    vi.stubGlobal('browser', {
      storage: {
        local: { set },
      },
    })
  })

  it('writes the patch to browser.storage.local', async () => {
    await setStore({ sortMode: 'alpha' })
    expect(set).toHaveBeenCalledWith({ sortMode: 'alpha' })
  })
})
