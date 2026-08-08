import { describe, expect, it, vi } from 'vitest'
import { createContainer } from '@/data/browser/api/create-container'

describe('createContainer', () => {
  it('delegates to contextualIdentities.create', async () => {
    const create = vi.fn<() => Promise<{ cookieStoreId: string }>>(
      async () => ({ cookieStoreId: 'x' }),
    )
    vi.stubGlobal('browser', { contextualIdentities: { create } })

    await createContainer('Work', 'blue', 'briefcase')
    expect(create).toHaveBeenCalledWith({
      color: 'blue',
      icon: 'briefcase',
      name: 'Work',
    })
  })
})
