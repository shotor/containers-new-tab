import { describe, expect, it, vi } from 'vitest'

import { ProxyDeleteDialog } from '@/features/proxies/components/proxy-delete-dialog'

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
      {
        colorCode: '#ff9f00',
        cookieStoreId: 'personal',
        icon: 'fingerprint',
        name: 'Personal',
      },
    ],
    error: '',
    loading: false,
  }),
}))

describe('ProxyDeleteDialog', () => {
  it('shows affected containers and explains direct connections', () => {
    const root = renderSnapshot(
      <ProxyDeleteDialog
        proxyId="office"
        name="Office"
        busy={false}
        error=""
        onCancel={() => undefined}
        onConfirm={() => undefined}
      />,
    )
    expect(root).toMatchSnapshot()
    expect(root.querySelector('ul')?.textContent).toContain('Work')
    expect(root.querySelector('ul')?.textContent).toContain('Personal')
    expect(root.textContent).toContain('connect directly')
  })
})
