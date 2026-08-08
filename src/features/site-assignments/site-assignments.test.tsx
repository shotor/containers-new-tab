import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderSnapshot, renderTo, typeInput } from '@/test/render-snapshot'
import { SiteAssignments } from '@/features/site-assignments/site-assignments'

vi.mock('@/features/container-grid/hooks/use-sorted-containers', () => ({
  useSortedContainers: () => ({
    containers: [
      {
        color: 'blue',
        colorCode: '#00f',
        cookieStoreId: 'firefox-container-1',
        icon: 'briefcase',
        name: 'Work',
      },
    ],
  }),
}))

vi.mock('@/data/browser/browser-api', () => ({
  gatherAssignmentProbeUrls: vi.fn<() => Promise<string[]>>(async () => [
    'https://github.com',
  ]),
  probeMacAssignments: vi.fn<
    () => Promise<
      Record<string, { cookieStoreId: string; host: string; url: string }>
    >
  >(async () => ({
    'github.com': {
      cookieStoreId: 'firefox-container-1',
      host: 'github.com',
      url: 'https://github.com',
    },
  })),
}))

vi.mock('@/utils/browser/open-container-tab', () => ({
  openContainerTab: vi.fn<() => void>(),
}))

describe('SiteAssignments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('matches snapshot after assignments load', async () => {
    const container = renderSnapshot(<SiteAssignments />)
    await vi.waitFor(() => {
      expect(container.textContent).toContain('github.com')
    })
    expect(container).toMatchSnapshot()
  })

  it('filters rows by search query', async () => {
    const container = renderTo(<SiteAssignments />)

    await vi.waitFor(() => {
      expect(container.textContent).toContain('github.com')
    })

    const input = container.querySelector('input[type="search"]')
    expect(input).toBeTruthy()
    typeInput(input as HTMLInputElement, 'zzz')

    await vi.waitFor(() => {
      expect(container.textContent).toMatch(/No sites match/)
    })
  })
})
