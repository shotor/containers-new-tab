import { describe, expect, it } from 'vitest'
import { parseSortMode } from '@/data/extension/parsers/parse-sort-mode'

describe('parseSortMode', () => {
  it('accepts known modes', () => {
    expect(parseSortMode('alpha')).toBe('alpha')
    expect(parseSortMode('custom')).toBe('custom')
    expect(parseSortMode('mostUsed')).toBe('mostUsed')
  })

  it('falls back for unknown or non-string values', () => {
    expect(parseSortMode('nope')).toBe('mostUsed')
    expect(parseSortMode(1)).toBe('mostUsed')
    expect(parseSortMode(null)).toBe('mostUsed')
  })
})
