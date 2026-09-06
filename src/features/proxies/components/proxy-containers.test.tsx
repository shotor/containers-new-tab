import { describe, expect, it, vi } from 'vitest'
import { ProxyContainers } from '@/features/proxies/components/proxy-containers'
import { renderSnapshot } from '@/test/render-snapshot'

vi.mock('@/features/proxies/hooks/use-proxy-containers', () => ({
  useProxyContainers: () => ({
    containers: [
      {
        colorCode: '#37adff',
        cookieStoreId: 'work',
        icon: 'briefcase',
        name: 'Work',
      },
    ],
    error: '',
    loading: false,
  }),
}))

describe('ProxyContainers', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(<ProxyContainers proxyId="office" />),
    ).toMatchSnapshot()
  })
})
