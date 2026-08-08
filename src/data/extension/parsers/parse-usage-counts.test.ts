import { describe, expect, it } from 'vitest'
import { parseUsageCounts } from '@/data/extension/parsers/parse-usage-counts'

describe('parseUsageCounts', () => {
  it('keeps finite non-negative counts', () => {
    expect(parseUsageCounts({ a: 1, b: 0, c: 2.5 })).toEqual({
      a: 1,
      b: 0,
      c: 2.5,
    })
  })

  it('drops invalid entries and bad shapes', () => {
    expect(
      parseUsageCounts({
        a: 1,
        b: -1,
        c: Number.NaN,
        d: '3',
        e: Number.POSITIVE_INFINITY,
      }),
    ).toEqual({ a: 1 })

    expect(parseUsageCounts(null)).toEqual({})
    expect(parseUsageCounts(['x'])).toEqual({})
  })
})
