import { describe, expect, it } from 'vitest'
import { uniq } from '@/utils/array/uniq'

describe('uniq', () => {
  it('dedupes while preserving first-seen order', () => {
    expect(uniq(['b', 'a', 'b', 'c', 'a'])).toEqual(['b', 'a', 'c'])
  })

  it('returns a new empty array for empty input', () => {
    expect(uniq([])).toEqual([])
  })
})
