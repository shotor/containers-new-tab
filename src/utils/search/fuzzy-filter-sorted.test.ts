import { describe, expect, it, vi } from 'vitest'
import { fuzzyFilterSorted } from '@/utils/search/fuzzy-filter-sorted'
import { fuzzyScore } from '@/utils/search/fuzzy-score'

vi.mock('@/utils/search/fuzzy-score', () => ({
  fuzzyScore: vi.fn<(haystack: string, needle: string) => number | null>(),
}))

/** The mocked fuzzyScore, for per-test score scripting. */
const scoreOf = vi.mocked(fuzzyScore)

describe('fuzzyFilterSorted', () => {
  it('sorts alphabetically without scoring when the query is empty', () => {
    scoreOf.mockReturnValue(null)
    const items = ['banana', 'Apple', 'cherry']
    expect(fuzzyFilterSorted(items, '  ', (s) => s)).toEqual([
      'Apple',
      'banana',
      'cherry',
    ])
    expect(scoreOf).not.toHaveBeenCalled()
  })

  it('drops items whose score is null and orders by score descending', () => {
    scoreOf.mockImplementation((name) =>
      name === 'drop-me' ? null : name.length,
    )
    const items = ['bb', 'drop-me', 'aaaa', 'ccc']
    expect(fuzzyFilterSorted(items, 'q', (s) => s)).toEqual([
      'aaaa',
      'ccc',
      'bb',
    ])
  })

  it('breaks score ties by name', () => {
    scoreOf.mockReturnValue(1)
    expect(fuzzyFilterSorted(['beta', 'alpha'], 'q', (s) => s)).toEqual([
      'alpha',
      'beta',
    ])
  })

  it('does not mutate the input', () => {
    scoreOf.mockReturnValue(1)
    const items = ['b', 'a']
    fuzzyFilterSorted(items, 'q', (s) => s)
    expect(items).toEqual(['b', 'a'])
  })
})
