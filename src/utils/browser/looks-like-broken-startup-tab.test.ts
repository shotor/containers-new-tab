import { describe, expect, it } from 'vitest'
import { looksLikeBrokenStartupTab } from '@/utils/browser/looks-like-broken-startup-tab'

const EXT_ID = 'ext-uuid'

describe('looksLikeBrokenStartupTab', () => {
  it('treats empty, blank, and error pages as broken', () => {
    expect(looksLikeBrokenStartupTab(undefined, EXT_ID)).toBe(true)
    expect(looksLikeBrokenStartupTab('about:blank', EXT_ID)).toBe(true)
    expect(looksLikeBrokenStartupTab('about:neterror?e=x', EXT_ID)).toBe(true)
    expect(looksLikeBrokenStartupTab('about:certerror', EXT_ID)).toBe(true)
  })

  it('rejects stale moz-extension pages from other ids', () => {
    expect(
      looksLikeBrokenStartupTab('moz-extension://other/src/index.html', EXT_ID),
    ).toBe(true)
    expect(
      looksLikeBrokenStartupTab(
        `moz-extension://${EXT_ID}/src/index.html`,
        EXT_ID,
      ),
    ).toBe(false)
  })

  it('treats dotted 0.x hosts as broken', () => {
    expect(looksLikeBrokenStartupTab('http://0.0.0.0/', EXT_ID)).toBe(true)
    expect(looksLikeBrokenStartupTab('http://0.1.2.3/', EXT_ID)).toBe(true)
    expect(looksLikeBrokenStartupTab('https://example.com/', EXT_ID)).toBe(
      false,
    )
  })
})
