import { describe, expect, it } from 'vitest'
import { parseCustomOrder } from '@/data/extension/parsers/parse-custom-order'

describe('parseCustomOrder', () => {
  it('keeps non-empty strings', () => {
    expect(parseCustomOrder(['a', 'b'])).toEqual(['a', 'b'])
  })

  it('drops non-strings and empty strings', () => {
    expect(parseCustomOrder(['a', '', 2, null, 'b'])).toEqual(['a', 'b'])
    expect(parseCustomOrder('a')).toEqual([])
  })
})
