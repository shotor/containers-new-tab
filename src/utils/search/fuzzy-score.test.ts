import { describe, expect, it } from 'vitest'
import { fuzzyScore } from '@/utils/search/fuzzy-score'

describe('fuzzyScore', () => {
  it('returns 0 for a blank needle', () => {
    expect(fuzzyScore('anything', '')).toBe(0)
    expect(fuzzyScore('anything', '   ')).toBe(0)
  })

  it('returns null when the needle is not a subsequence', () => {
    expect(fuzzyScore('github.com', 'xyz')).toBeNull()
  })

  it('matches case-insensitively', () => {
    expect(fuzzyScore('GitHub', 'git')).not.toBeNull()
  })

  it('scores consecutive matches above scattered ones', () => {
    const consecutive = fuzzyScore('git', 'git')
    const scattered = fuzzyScore('gxixt', 'git')
    expect(consecutive).not.toBeNull()
    expect(scattered).not.toBeNull()
    expect(consecutive ?? 0).toBeGreaterThan(scattered ?? 0)
  })

  it('rewards word boundaries', () => {
    const boundary = fuzzyScore('my-site.com', 'site')
    const middle = fuzzyScore('website.com', 'site')
    expect(boundary).not.toBeNull()
    expect(middle).not.toBeNull()
    expect(boundary ?? 0).toBeGreaterThan(middle ?? 0)
  })
})
