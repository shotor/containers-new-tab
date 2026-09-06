import { act } from 'preact/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { proxyLibraryApi } from '@/data/proxy/proxy-library-api'

import { Proxy } from '@/features/container-detail/components/proxy'

import { renderSnapshot } from '@/test/render-snapshot'

vi.mock('@/features/proxies/hooks/use-proxy-library', () => ({
  useProxyLibrary: () => ({
    error: '',
    library: {
      assignments: {},
      proxies: {
        office: { host: 'proxy.example', name: 'Office', port: 8080 },
      },
    },
    loading: false,
  }),
}))
vi.mock('@/data/proxy/proxy-library-api', () => ({
  proxyLibraryApi: {
    assign: vi.fn<() => Promise<void>>(async () => undefined),
  },
}))

describe('Proxy', () => {
  it('matches snapshot', () => {
    expect(renderSnapshot(<Proxy cookieStoreId="work" />)).toMatchSnapshot()
  })

  it('assigns the selected saved proxy', async () => {
    const root = renderSnapshot(<Proxy cookieStoreId="work" />)
    const select = root.querySelector('select')!
    await act(async () => {
      select.value = 'office'
      select.dispatchEvent(new Event('change', { bubbles: true }))
    })
    expect(proxyLibraryApi.assign).toHaveBeenCalledWith('work', 'office')
  })
})
