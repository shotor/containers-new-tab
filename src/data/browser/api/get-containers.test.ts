import { describe, expect, it, vi } from 'vitest'
import { getContainers } from '@/data/browser/api/get-containers'

describe('getContainers', () => {
  it('queries contextualIdentities', async () => {
    const query = vi.fn<() => Promise<Array<{ cookieStoreId: string }>>>(
      async () => [{ cookieStoreId: 'a' }],
    )
    vi.stubGlobal('browser', { contextualIdentities: { query } })

    await expect(getContainers()).resolves.toEqual([{ cookieStoreId: 'a' }])
    expect(query).toHaveBeenCalledWith({})
  })
})
