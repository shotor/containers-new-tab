import { describe, expect, it, vi } from 'vitest'
import { proxyLibraryApi } from '@/data/proxy/proxy-library-api'
import { purgeProxyForContainer } from '@/data/extension/api/purge-proxy-for-container'

vi.mock('@/data/proxy/proxy-library-api', () => ({
  proxyLibraryApi: {
    assign: vi.fn<() => Promise<void>>(async () => undefined),
  },
}))

describe('purgeProxyForContainer', () => {
  it('clears the assignment when a container is deleted', async () => {
    await purgeProxyForContainer('work')
    expect(proxyLibraryApi.assign).toHaveBeenCalledWith('work', '')
  })
})
