import { describe, expect, it, vi } from 'vitest'
import { gatherAssignmentProbeUrls } from '@/data/browser/api/gather-assignment-probe-urls'

describe('gatherAssignmentProbeUrls', () => {
  it('dedupes by host, keeps richest path, and unwraps continue=', async () => {
    vi.stubGlobal('browser', {
      topSites: {
        get: vi.fn<() => Promise<Array<{ url: string }>>>(async () => [
          { url: 'https://Example.com/a' },
          { url: 'https://example.com/travel/flights' },
          { url: 'https://example.com/b' },
          {
            url: 'https://consent.google.com/m?continue=https://www.google.com/travel/flights&gl=NL',
          },
          { url: '' },
        ]),
      },
    })

    await expect(
      gatherAssignmentProbeUrls(['GitHub.com', 'https://news.ycombinator.com']),
    ).resolves.toEqual([
      'https://example.com/travel/flights',
      'https://consent.google.com/m?continue=https://www.google.com/travel/flights&gl=NL',
      'https://www.google.com/travel/flights',
      'https://github.com',
      'https://news.ycombinator.com',
    ])
  })

  it('still returns extra hosts when topSites fails', async () => {
    vi.stubGlobal('browser', {
      topSites: {
        get: vi.fn<() => Promise<never>>(async () => {
          throw new Error('denied')
        }),
      },
    })

    await expect(gatherAssignmentProbeUrls(['a.com'])).resolves.toEqual([
      'https://a.com',
    ])
  })
})
