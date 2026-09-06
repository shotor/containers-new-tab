import { describe, expect, it } from 'vitest'
import { parseSortDirection } from '@/data/extension/parsers/parse-sort-direction'

describe('parseSortDirection', () => {
  it('accepts known directions', () => {
    expect(parseSortDirection('asc')).toBe('asc')
    expect(parseSortDirection('desc')).toBe('desc')
  })

  it('falls back for unknown or non-string values', () => {
    expect(parseSortDirection('up')).toBe('asc')
    expect(parseSortDirection(1)).toBe('asc')
    expect(parseSortDirection(null)).toBe('asc')
  })
})
