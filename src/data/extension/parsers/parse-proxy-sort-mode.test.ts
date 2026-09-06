import { describe, expect, it } from 'vitest'

import { parseProxySortMode } from '@/data/extension/parsers/parse-proxy-sort-mode'

describe('parseProxySortMode', () => {
  it('accepts known modes', () => {
    expect(parseProxySortMode('name')).toBe('name')
    expect(parseProxySortMode('type')).toBe('type')
    expect(parseProxySortMode('port')).toBe('port')
    expect(parseProxySortMode('containers')).toBe('containers')
  })

  it('falls back for unknown or non-string values', () => {
    expect(parseProxySortMode('alpha')).toBe('name')
    expect(parseProxySortMode(1)).toBe('name')
    expect(parseProxySortMode(undefined)).toBe('name')
  })
})
