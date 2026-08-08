import { describe, expect, it, vi } from 'vitest'
import { updateContainer } from '@/data/browser/api/update-container'

describe('updateContainer', () => {
  it('delegates to contextualIdentities.update', async () => {
    const update = vi.fn<() => Promise<{ cookieStoreId: string }>>(
      async () => ({ cookieStoreId: 'x' }),
    )
    vi.stubGlobal('browser', { contextualIdentities: { update } })

    await updateContainer('x', { name: 'Home' })
    expect(update).toHaveBeenCalledWith('x', { name: 'Home' })
  })
})
