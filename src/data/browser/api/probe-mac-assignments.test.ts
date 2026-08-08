import { describe, expect, it, vi } from 'vitest'
import { getMacAssignment } from '@/data/browser/api/get-mac-assignment'
import { probeMacAssignments } from '@/data/browser/api/probe-mac-assignments'

vi.mock('@/data/browser/api/get-mac-assignment', () => ({
  getMacAssignment: vi.fn<
    (url: string) => Promise<{ userContextId: string } | null>
  >(async (url) => {
    const host = new URL(url).hostname

    if (host === 'www.amazon.com') {
      return { userContextId: '4' }
    }

    if (host === 'github.com') {
      return { userContextId: '2' }
    }

    return null
  }),
}))

describe('probeMacAssignments', () => {
  it('maps assigned hosts to cookieStoreIds and preferred URLs', async () => {
    await expect(
      probeMacAssignments([
        'https://github.com/orgs',
        'https://example.com',
        'github.com',
      ]),
    ).resolves.toEqual({
      'github.com': {
        cookieStoreId: 'firefox-container-2',
        host: 'github.com',
        url: 'https://github.com/orgs',
      },
    })
  })

  it('finds www assignments when topSites only has the apex host', async () => {
    await expect(probeMacAssignments(['https://amazon.com'])).resolves.toEqual({
      'www.amazon.com': {
        cookieStoreId: 'firefox-container-4',
        host: 'www.amazon.com',
        url: 'https://www.amazon.com',
      },
    })

    expect(getMacAssignment).toHaveBeenCalledWith('https://amazon.com')
    expect(getMacAssignment).toHaveBeenCalledWith('https://www.amazon.com')
  })
})
