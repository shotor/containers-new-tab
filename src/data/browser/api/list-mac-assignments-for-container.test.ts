import { describe, expect, it, vi } from 'vitest'
import { listMacAssignmentsForContainer } from '@/data/browser/api/list-mac-assignments-for-container'
import type { MacSiteAssignment } from '@/data/browser/api/probe-mac-assignments'

vi.mock('@/data/browser/api/gather-assignment-probe-urls', () => ({
  gatherAssignmentProbeUrls: vi.fn<() => Promise<string[]>>(async () => [
    'https://a.com',
    'https://b.com',
  ]),
}))

vi.mock('@/data/browser/api/probe-mac-assignments', () => ({
  probeMacAssignments: vi.fn<() => Promise<Record<string, MacSiteAssignment>>>(
    async () => ({
      'a.com': {
        cookieStoreId: 'firefox-container-1',
        host: 'a.com',
        url: 'https://a.com',
      },
      'b.com': {
        cookieStoreId: 'firefox-container-1',
        host: 'b.com',
        url: 'https://b.com/path',
      },
      'c.com': {
        cookieStoreId: 'firefox-container-9',
        host: 'c.com',
        url: 'https://c.com',
      },
    }),
  ),
}))

describe('listMacAssignmentsForContainer', () => {
  it('returns sorted assignments for one cookieStoreId', async () => {
    await expect(
      listMacAssignmentsForContainer('firefox-container-1'),
    ).resolves.toEqual([
      {
        cookieStoreId: 'firefox-container-1',
        host: 'a.com',
        url: 'https://a.com',
      },
      {
        cookieStoreId: 'firefox-container-1',
        host: 'b.com',
        url: 'https://b.com/path',
      },
    ])
  })
})
