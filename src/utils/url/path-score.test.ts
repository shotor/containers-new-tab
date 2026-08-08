import { describe, expect, it } from 'vitest'
import { pathScore } from '@/utils/url/path-score'

describe('pathScore', () => {
  it('scores longer paths higher and treats root as zero', () => {
    expect(pathScore('https://example.com/')).toBe(0)
    expect(pathScore('https://example.com')).toBe(0)
    expect(pathScore('https://example.com/a')).toBe(2)
    expect(pathScore('https://example.com/travel/flights')).toBeGreaterThan(
      pathScore('https://example.com/a'),
    )
  })

  it('returns 0 for invalid URLs', () => {
    expect(pathScore('not a url')).toBe(0)
  })
})
