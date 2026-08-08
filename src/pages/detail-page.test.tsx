import { describe, expect, it, vi } from 'vitest'
import { DetailPage } from '@/pages/detail-page'
import { renderSnapshot } from '@/test/render-snapshot'

vi.mock('@/features/container-detail/hooks/use-container-detail', () => ({
  useContainerDetail: () => ({
    deleteContainer: async () => undefined,
    goHome: () => undefined,
    identity: {
      color: 'blue',
      colorCode: '#0000ff',
      cookieStoreId: 'firefox-container-1',
      icon: 'briefcase',
      name: 'Work',
    },
    loading: false,
    openAssignedSite: async () => undefined,
    proxySaveStatus: 'idle',
    register: (name: string) => ({
      name,
      onBlur: async () => undefined,
      onChange: async () => undefined,
      ref: () => undefined,
    }),
    saveStatus: 'idle',
    setColor: () => undefined,
    setIcon: () => undefined,
    setShowDeleteConfirm: () => undefined,
    showDeleteConfirm: false,
    sites: [
      {
        cookieStoreId: 'firefox-container-1',
        host: 'example.com',
        url: 'https://example.com',
      },
    ],
    title: 'Work',
    values: {
      color: 'blue',
      doNotProxyLocal: true,
      host: '',
      icon: 'briefcase',
      name: 'Work',
      password: '',
      port: '',
      type: 'direct',
      username: '',
    },
  }),
}))

describe('DetailPage', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(<DetailPage cookieStoreId="firefox-container-1" />),
    ).toMatchSnapshot()
  })
})
