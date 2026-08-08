import { describe, expect, it, vi } from 'vitest'
import { removeContainer } from '@/data/browser/api/remove-container'

describe('removeContainer', () => {
  it('delegates to contextualIdentities.remove', async () => {
    const remove = vi.fn<() => Promise<void>>(async () => undefined)
    vi.stubGlobal('browser', { contextualIdentities: { remove } })

    await removeContainer('x')
    expect(remove).toHaveBeenCalledWith('x')
  })
})
